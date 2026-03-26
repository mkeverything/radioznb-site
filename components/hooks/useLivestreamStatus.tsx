import { useEffect, useState } from "react"
import useWebSocket, { ReadyState } from "react-use-websocket"

const STATIC_NP =
  "https://server.radioznb.ru/api/nowplaying_static/radioznb-live.json"
const NOWPLAYING_POLL =
  "https://server.radioznb.ru/api/nowplaying/radioznb-live"
const WS_URL = "wss://server.radioznb.ru/api/live/nowplaying/websocket"

const POLL_MS = 20_000

export type NowPlayingTrack = {
  title: string | null
  artist: string | null
  album: string | null
  art: string | null
  playlist: string | null
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

export const useLivestreamStatus = (): StationFeed => {
  const [livestream, setLivestream] = useState<Livestream>(undefined)
  const [nowPlaying, setNowPlaying] = useState<NowPlayingTrack | undefined>(
    undefined,
  )

  const ws = useWebSocket(WS_URL)

  useEffect(() => {
    if (ws.readyState === ReadyState.OPEN) {
      ws.sendJsonMessage({
        subs: { "station:radioznb-live": { recover: true } },
      })
    }
  }, [ws, ws.readyState])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(STATIC_NP)
        if (!response.ok) throw new Error("Network response was not ok")
        const data = await response.json()
        if (data.live && "is_live" in data.live) {
          setLivestream(data.live)
        }
        setNowPlaying(mapNowPlayingFromApi(data.now_playing))
      } catch (err) {
        console.error("Fetch error:", err)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const response = await fetch(NOWPLAYING_POLL)
        if (!response.ok) return
        const data = await response.json()
        setNowPlaying(mapNowPlayingFromApi(data.now_playing))
        if (data.live && "is_live" in data.live) {
          setLivestream(data.live)
        }
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

  return { livestream, nowPlaying }
}
