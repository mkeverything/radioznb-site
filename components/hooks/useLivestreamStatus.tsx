import {
  defaultLiveStreamSources,
  LiveStreamSources,
  nowplayingApiUrl,
  nowplayingStaticUrl,
  nowplayingWebSocketUrl,
  wsStationChannel,
} from "@/lib/radioStation"
import { useEffect, useState } from "react"
import useWebSocket, { ReadyState } from "react-use-websocket"

const POLL_MS = 20_000

export type NowPlayingTrack = {
  title: string | null
  artist: string | null
  album: string | null
  art: string | null
  playlist: string | null
  /** Present on some AzuraCast builds; `live.streamer_name` is the usual source for DJ name. */
  streamer: string | null
}

export type Livestream =
  | {
      art: string | null
      broadcast_start: number | null
      is_live: boolean
      streamer_name: string
    }
  | undefined

type StationFeed = {
  livestream: Livestream
  nowPlaying: NowPlayingTrack | undefined
  streamSources: LiveStreamSources
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapNowPlayingFromApi(raw: any): NowPlayingTrack | undefined {
  if (!raw) return undefined
  const song = raw.song
  if (!song && !raw.playlist) return undefined
  return {
    title: song?.title ?? null,
    artist: song?.artist ?? null,
    album: song?.album ?? null,
    art: song?.art ?? null,
    playlist: raw.playlist ?? null,
    streamer: typeof raw.streamer === "string" ? raw.streamer : null,
  }
}

export function formatNowPlayingLine(
  np: NowPlayingTrack | undefined,
): string | null {
  if (!np) return null
  const { title, artist, playlist } = np
  if (artist?.trim() && title?.trim()) return `${artist.trim()} — ${title.trim()}`
  if (title?.trim()) return title.trim()
  if (artist?.trim()) return artist.trim()
  if (playlist?.trim()) return playlist.trim()
  return null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapStreamSourcesFromStation(raw: any): LiveStreamSources {
  if (!raw || typeof raw !== "object") return defaultLiveStreamSources
  const mp3Url =
    typeof raw.listen_url === "string" && raw.listen_url
      ? raw.listen_url
      : defaultLiveStreamSources.mp3Url
  const apiHlsUrl =
    typeof raw.hls_url === "string" && raw.hls_url ? raw.hls_url : null

  if (apiHlsUrl) {
    return {
      mp3Url,
      hlsUrl: apiHlsUrl,
      hlsEnabled: Boolean(raw.hls_enabled),
    }
  }
  if (raw.hls_enabled === false) {
    return { mp3Url, hlsUrl: null, hlsEnabled: false }
  }
  return {
    mp3Url,
    hlsUrl: defaultLiveStreamSources.hlsUrl,
    hlsEnabled: defaultLiveStreamSources.hlsEnabled,
  }
}

export const useLivestreamStatus = (): StationFeed => {
  const [livestream, setLivestream] = useState<Livestream>(undefined)
  const [nowPlaying, setNowPlaying] = useState<NowPlayingTrack | undefined>(
    undefined,
  )
  const [streamSources, setStreamSources] = useState<LiveStreamSources>(
    defaultLiveStreamSources,
  )

  const ws = useWebSocket(nowplayingWebSocketUrl)

  useEffect(() => {
    if (ws.readyState === ReadyState.OPEN) {
      ws.sendJsonMessage({
        subs: { [wsStationChannel]: { recover: true } },
      })
    }
  }, [ws, ws.readyState])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(nowplayingStaticUrl)
        if (!response.ok) throw new Error("Network response was not ok")
        const data = await response.json()
        if (data.live && "is_live" in data.live) {
          setLivestream(data.live)
        }
        setNowPlaying(mapNowPlayingFromApi(data.now_playing))
        setStreamSources(mapStreamSourcesFromStation(data.station))
      } catch (err) {
        console.error("Fetch error:", err)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const response = await fetch(nowplayingApiUrl)
        if (!response.ok) return
        const data = await response.json()
        setNowPlaying(mapNowPlayingFromApi(data.now_playing))
        if (data.live && "is_live" in data.live) {
          setLivestream(data.live)
        }
        setStreamSources(mapStreamSourcesFromStation(data.station))
      } catch {
        /* ignore poll errors */
      }
    }, POLL_MS)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const msg = ws.lastJsonMessage as any
    const npRoot = msg?.pub?.data?.np
    if (!npRoot || typeof npRoot !== "object") return

    const live = npRoot.live
    if (live && "is_live" in live) {
      setLivestream((prev) =>
        JSON.stringify(prev) !== JSON.stringify(live) ? live : prev,
      )
    }

    const np = mapNowPlayingFromApi(npRoot.now_playing)
    if (np) {
      setNowPlaying((prev) =>
        JSON.stringify(prev) !== JSON.stringify(np) ? np : prev,
      )
    }
  }, [ws.lastJsonMessage])

  return { livestream, nowPlaying, streamSources }
}
