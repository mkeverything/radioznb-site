"use client"

import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { useMediaSessionSync } from "./hooks/useMediaSession"
import { listenUrl } from "@/lib/radioStation"
import {
  Livestream,
  NowPlayingTrack,
  useLivestreamStatus,
} from "./hooks/useLivestreamStatus"

const LIVE_RECONNECT_DEBOUNCE_MS = 900
const LIVE_FREEZE_THRESHOLD_MS = 12_000
const LIVE_RECONNECT_ATTEMPT_CAP = 15

const LOG_PREFIX = "[radioznb live]"

function describeMediaError(audio: HTMLAudioElement): string {
  const err = audio.error
  if (!err) return "unknown (no MediaError)"
  const names: Record<number, string> = {
    1: "MEDIA_ERR_ABORTED",
    2: "MEDIA_ERR_NETWORK",
    3: "MEDIA_ERR_DECODE",
    4: "MEDIA_ERR_SRC_NOT_SUPPORTED",
  }
  const name = names[err.code] ?? `MEDIA_ERR_${err.code}`
  const msg = err.message?.trim()
  return msg ? `${name}: ${msg}` : name
}

function liveUrlWithCacheBust(): string {
  const sep = listenUrl.includes("?") ? "&" : "?"
  return `${listenUrl}${sep}_=${Date.now()}`
}

export const PlayerContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [src, setSrc] = useState("")
  const [title, setTitle] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [timecode, setTimecode] = useState(defaultState.timecode)
  const [duration, setDuration] = useState(defaultState.duration)
  const [volume, setVolume] = useState(defaultState.volume)
  const { livestream, nowPlaying } = useLivestreamStatus()
  const [isLive, setIsLive] = useState(!!livestream?.is_live)
  const [readyState, setReadyState] = useState(0)
  const ctx = isLive ? "player-context" : "archive-context"

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const wantsLivePlayRef = useRef(false)
  const isLiveRef = useRef(false)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )
  const reconnectAttemptsRef = useRef(0)
  const lastLiveCurrentTimeRef = useRef(0)
  const liveFrozenSinceRef = useRef<number | null>(null)
  const scheduleLiveReconnectRef = useRef<(reason: string) => void>(
    (_reason) => {},
  )

  useEffect(() => {
    isLiveRef.current = isLive
  }, [isLive])

  useEffect(() => {
    const saved = getLocalStorageContext(ctx)

    if (!saved) return

    setSrc(saved.src)
    setTitle(saved.title)
    setTimecode(saved.timecode)
    setDuration(saved.duration)
    setIsLive(saved.isLive)
    setVolume(saved.volume)
  }, [ctx])

  useEffect(() => {
    localStorage.setItem(
      ctx,
      JSON.stringify({
        src,
        title: isLive ? stream.title : title,
        isPlaying,
        timecode,
        duration,
        isLive,
        volume,
      }),
    )
  }, [ctx, duration, isLive, isPlaying, src, timecode, title, volume])

  useEffect(() => {
    if (!isLive) return
    setTitle(stream.title)
  }, [isLive])

  const clearReconnectTimeout = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
  }

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }

    const audio = audioRef.current

    let lastThrottle = 0
    const throttleMs = 1000

    const runReconnect = () => {
      if (!wantsLivePlayRef.current || !isLiveRef.current) return
      if (reconnectAttemptsRef.current >= LIVE_RECONNECT_ATTEMPT_CAP) {
        console.error(
          LOG_PREFIX,
          "giving up after",
          LIVE_RECONNECT_ATTEMPT_CAP,
          "reconnect attempts",
        )
        wantsLivePlayRef.current = false
        setIsPlaying(false)
        return
      }
      reconnectAttemptsRef.current += 1
      console.warn(
        LOG_PREFIX,
        "reconnect attempt",
        `${reconnectAttemptsRef.current}/${LIVE_RECONNECT_ATTEMPT_CAP}`,
        "→",
        "new src",
      )
      audio.src = liveUrlWithCacheBust()
      audio.load()
      void audio.play().catch((e) => {
        console.warn(LOG_PREFIX, "play() failed after reconnect:", e)
        scheduleLiveReconnectRef.current("play() failed after reconnect")
      })
    }

    const scheduleLiveReconnect = (reason: string) => {
      if (!wantsLivePlayRef.current || !isLiveRef.current) return
      console.warn(
        LOG_PREFIX,
        "reconnect scheduled:",
        reason,
        `(in ${LIVE_RECONNECT_DEBOUNCE_MS}ms)`,
      )
      clearReconnectTimeout()
      reconnectTimeoutRef.current = setTimeout(() => {
        reconnectTimeoutRef.current = null
        runReconnect()
      }, LIVE_RECONNECT_DEBOUNCE_MS)
    }

    scheduleLiveReconnectRef.current = scheduleLiveReconnect

    const onTimeUpdate = () => {
      const now = performance.now()
      if (now - lastThrottle >= throttleMs) {
        lastThrottle = now
        setTimecode(audio.currentTime)
      }

      if (
        isLiveRef.current &&
        wantsLivePlayRef.current &&
        !audio.paused
      ) {
        const t = audio.currentTime
        if (t === lastLiveCurrentTimeRef.current) {
          if (liveFrozenSinceRef.current === null)
            liveFrozenSinceRef.current = now
          else if (now - liveFrozenSinceRef.current >= LIVE_FREEZE_THRESHOLD_MS) {
            liveFrozenSinceRef.current = null
            scheduleLiveReconnect(
              `currentTime frozen ~${LIVE_FREEZE_THRESHOLD_MS}ms (decode/network stall)`,
            )
          }
        } else {
          lastLiveCurrentTimeRef.current = t
          liveFrozenSinceRef.current = null
        }
      }
    }

    const onLoadStart = () => {
      setReadyState(audio.readyState)
    }

    const onLoaded = () => {
      setSrc(audio.src)
      setDuration(isFinite(audio.duration) ? audio.duration : 0)
      setReadyState(audio.readyState)
      if (isLiveRef.current) {
        reconnectAttemptsRef.current = 0
        liveFrozenSinceRef.current = null
        lastLiveCurrentTimeRef.current = audio.currentTime
      }
    }

    const onEnded = () => {
      if (isLiveRef.current && wantsLivePlayRef.current) {
        console.warn(LOG_PREFIX, "ended during live (stream ended or server closed connection)")
        scheduleLiveReconnect("ended")
        return
      }
      setIsPlaying(false)
      setTimecode(0)
    }

    const onPause = () => setIsPlaying(false)

    const onPlay = () => {
      setIsPlaying(true)
      if (isLiveRef.current) {
        reconnectAttemptsRef.current = 0
        liveFrozenSinceRef.current = null
        lastLiveCurrentTimeRef.current = audio.currentTime
      }
    }

    const onError = () => {
      const detail = describeMediaError(audio)
      console.warn(LOG_PREFIX, "audio error:", detail, {
        networkState: audio.networkState,
        readyState: audio.readyState,
        currentSrc: audio.currentSrc || audio.src,
      })
      if (isLiveRef.current && wantsLivePlayRef.current)
        scheduleLiveReconnect(`error: ${detail}`)
    }

    const onStalled = () => {
      if (!isLiveRef.current || !wantsLivePlayRef.current) return
      console.warn(LOG_PREFIX, "stalled", {
        networkState: audio.networkState,
        readyState: audio.readyState,
      })
      scheduleLiveReconnect("stalled")
    }

    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("loadstart", onLoadStart)
    audio.addEventListener("loadeddata", onLoaded)
    audio.addEventListener("play", onPlay)
    audio.addEventListener("pause", onPause)
    audio.addEventListener("ended", onEnded)
    audio.addEventListener("error", onError)
    audio.addEventListener("stalled", onStalled)

    const onVisible = () => {
      if (document.visibilityState !== "visible") return
      if (!wantsLivePlayRef.current || !isLiveRef.current) return
      if (audio.paused) {
        void audio.play().catch((e) => {
          console.warn(LOG_PREFIX, "tab visible: resume play() failed:", e)
          scheduleLiveReconnect("visibility resume play() failed")
        })
      }
    }

    document.addEventListener("visibilitychange", onVisible)

    return () => {
      clearReconnectTimeout()
      document.removeEventListener("visibilitychange", onVisible)
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("loadstart", onLoadStart)
      audio.removeEventListener("loadeddata", onLoaded)
      audio.removeEventListener("play", onPlay)
      audio.removeEventListener("pause", onPause)
      audio.removeEventListener("ended", onEnded)
      audio.removeEventListener("error", onError)
      audio.removeEventListener("stalled", onStalled)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
  }, [volume])

  const play = async ({
    src: newSrc,
    title,
    isLive: live,
    timecode: storedTimecode,
  }: Stream) => {
    const audio = audioRef.current
    if (!audio) return

    if (live) {
      wantsLivePlayRef.current = true
      isLiveRef.current = true
    } else {
      wantsLivePlayRef.current = false
      isLiveRef.current = false
      clearReconnectTimeout()
    }

    audio.pause()
    if (live) {
      audio.src = newSrc
    } else {
      if (audio.src !== newSrc) {
        audio.src = newSrc
      }
      if (storedTimecode) {
        audio.currentTime = storedTimecode
      } else if (src === newSrc) audio.currentTime = timecode
    }
    setIsLive(live)
    setTitle(title)

    try {
      await audio.play()
    } catch (e) {
      if (live) {
        console.warn(LOG_PREFIX, "play() rejected:", e)
        if (wantsLivePlayRef.current)
          scheduleLiveReconnectRef.current("play() rejected (e.g. autoplay policy)")
      }
    }
  }

  const pause = () => {
    wantsLivePlayRef.current = false
    clearReconnectTimeout()
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
  }

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      play({ src, title, isLive })
    } else {
      pause()
    }
  }

  const seek = (time: number) => {
    const audio = audioRef.current
    if (!audio || isLive) return
    audio.currentTime = time
    setTimecode(time)
  }

  useMediaSessionSync(
    isLive,
    isPlaying,
    nowPlaying,
    livestream,
    stream.title,
    () => {
      void play({ ...stream })
    },
    pause,
  )

  return (
    <PlayerContext.Provider
      value={{
        src,
        setSrc,
        title,
        isPlaying,
        timecode,
        duration,
        isLive,
        setIsLive,
        play,
        pause,
        toggle,
        seek,
        volume,
        setVolume,
        readyState,
        livestream,
        nowPlaying,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export const stream: Stream = {
  src: listenUrl,
  title: "радио зимы не будет",
  isLive: true,
}

const defaultState: PlayerContextType = {
  ...stream,
  isPlaying: false,
  timecode: 0,
  duration: 0,
  setSrc: () => {},
  setIsLive: () => {},
  play: () => {},
  pause: () => {},
  seek: () => {},
  toggle: () => {},
  volume: 1,
  setVolume: () => {},
  readyState: 0,
  livestream: {
    art: null,
    broadcast_start: null,
    is_live: false,
    streamer_name: "",
  },
  nowPlaying: undefined,
}

const PlayerContext = createContext<PlayerContextType>(defaultState)

export const usePlayer = () => useContext(PlayerContext)

export const getLocalStorageContext = (
  ctx: string,
): PlayerContextType | undefined => {
  try {
    const raw = localStorage.getItem(ctx)
    if (raw) {
      return { ...JSON.parse(raw) }
    }
  } catch {}
  return undefined
}

export type Stream = {
  src: string
  title: string
  isLive: boolean
  timecode?: number
}

export type PlayerContextType = {
  src: string
  title: string
  isPlaying: boolean
  timecode: number
  duration: number
  isLive: boolean
  setSrc: (stream: string) => void
  setIsLive: (arg: boolean) => void
  play: (props: Stream) => void
  pause: () => void
  toggle: () => void
  seek: (time: number) => void
  volume: number
  setVolume: (vol: number) => void
  readyState: number
  livestream: Livestream
  nowPlaying: NowPlayingTrack | undefined
}
