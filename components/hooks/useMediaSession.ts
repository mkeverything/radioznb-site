"use client"

import { useEffect, useRef } from "react"
import type { Livestream, NowPlayingTrack } from "./useLivestreamStatus"

/**
 * Map live metadata to MediaMetadata for lock screen / Bluetooth / car displays.
 *
 * - Live with a streamer name: `title` = radio · host (nothing else).
 * - Otherwise: `title` = radio · playlist, `artist` = artist — title (now playing).
 */
function liveMediaFields(
  stationTitle: string,
  nowPlaying: NowPlayingTrack | undefined,
  livestream: Livestream,
): { title: string; artist: string; album: string } {
  const radio = stationTitle.trim()
  const playlist = nowPlaying?.playlist?.trim() ?? ""
  const songArtist = nowPlaying?.artist?.trim() ?? ""
  const songTitle = nowPlaying?.title?.trim() ?? ""
  const streamer =
    livestream?.is_live &&
    (livestream.streamer_name?.trim() || nowPlaying?.streamer?.trim())
      ? livestream.streamer_name?.trim() ||
        nowPlaying?.streamer?.trim() ||
        ""
      : ""

  if (streamer) {
    const title = [radio, streamer].filter(Boolean).join(" · ")
    return { title, artist: "", album: "" }
  }

  const title = [radio, playlist].filter(Boolean).join(" · ")
  const artist = [songArtist, songTitle].filter(Boolean).join(" — ")
  const album = ""

  return { title, artist, album }
}

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

    const { title, artist, album } = liveMediaFields(
      stationTitle,
      nowPlaying,
      livestream,
    )

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
      album,
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
