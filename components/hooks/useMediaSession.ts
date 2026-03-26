"use client"

import { useEffect, useRef } from "react"
import type { NowPlayingTrack } from "./useLivestreamStatus"

export function useMediaSessionSync(
  isLive: boolean,
  isPlaying: boolean,
  nowPlaying: NowPlayingTrack | undefined,
  stationTitle: string,
  playLive: () => void,
  pause: () => void,
) {
  const playRef = useRef(playLive)
  const pauseRef = useRef(pause)
  playRef.current = playLive
  pauseRef.current = pause

  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) {
      return
    }

    if (!isLive) {
      navigator.mediaSession.metadata = null
      navigator.mediaSession.setActionHandler("play", null)
      navigator.mediaSession.setActionHandler("pause", null)
      return
    }

    const title = nowPlaying?.title?.trim() || stationTitle
    const artist =
      nowPlaying?.artist?.trim() ||
      (nowPlaying?.playlist?.trim() ? undefined : stationTitle) ||
      stationTitle
    const album =
      nowPlaying?.album?.trim() ||
      nowPlaying?.playlist?.trim() ||
      undefined

    const artwork: MediaImage[] = []
    if (nowPlaying?.art) {
      artwork.push({
        src: nowPlaying.art,
        sizes: "512x512",
        type: "image/jpeg",
      })
    }

    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist,
      ...(album ? { album } : {}),
      ...(artwork.length ? { artwork } : {}),
    })

    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused"

    navigator.mediaSession.setActionHandler("play", () => {
      playRef.current()
    })
    navigator.mediaSession.setActionHandler("pause", () => {
      pauseRef.current()
    })

    return () => {
      navigator.mediaSession.setActionHandler("play", null)
      navigator.mediaSession.setActionHandler("pause", null)
    }
  }, [isLive, isPlaying, nowPlaying, stationTitle])
}
