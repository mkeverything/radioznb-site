"use client"

import { useEffect, useRef } from "react"
import type { Livestream, NowPlayingTrack } from "./useLivestreamStatus"

export function useMediaSessionSync(
  isLive: boolean,
  isPlaying: boolean,
  nowPlaying: NowPlayingTrack | undefined,
  livestream: Livestream,
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

    const songTitle = nowPlaying?.title?.trim()
    const songArtist = nowPlaying?.artist?.trim()
    const playlist = nowPlaying?.playlist?.trim()

    const onAir =
      livestream?.is_live && livestream.streamer_name?.trim()
        ? livestream.streamer_name.trim()
        : ""

    const title =
      songTitle || playlist || stationTitle

    // Live DJ broadcast: host is primary in `artist`; keep performer when a track is tagged.
    const artist = onAir
      ? songArtist
        ? `${onAir} · ${songArtist}`
        : onAir
      : songArtist ?? ""

    const artwork: MediaImage[] = []
    const artUrl = nowPlaying?.art || livestream?.art
    if (artUrl) {
      artwork.push({
        src: artUrl,
        sizes: "512x512",
        type: "image/jpeg",
      })
    }

    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist,
      album: stationTitle,
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
  }, [isLive, isPlaying, nowPlaying, livestream, stationTitle])
}
