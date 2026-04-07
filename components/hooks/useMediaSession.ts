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

function archiveMediaFields(
  currentTitle: string,
  stationTitle: string,
): { title: string; artist: string; album: string } {
  return {
    title: currentTitle.trim() || stationTitle.trim(),
    artist: "",
    album: "",
  }
}

export function useMediaSessionSync(
  src: string,
  currentTitle: string,
  isLive: boolean,
  isPlaying: boolean,
  nowPlaying: NowPlayingTrack | undefined,
  livestream: Livestream,
  stationTitle: string,
  playCurrent: () => void,
  pause: () => void,
) {
  const playRef = useRef(playCurrent)
  const pauseRef = useRef(pause)
  playRef.current = playCurrent
  pauseRef.current = pause

  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) {
      return
    }

    if (!src) {
      navigator.mediaSession.metadata = null
      navigator.mediaSession.setActionHandler("play", null)
      navigator.mediaSession.setActionHandler("pause", null)
      navigator.mediaSession.setActionHandler("stop", null)
      return
    }

    const { title, artist, album } = isLive
      ? liveMediaFields(stationTitle, nowPlaying, livestream)
      : archiveMediaFields(currentTitle, stationTitle)

    const artwork: MediaImage[] = []
    const artUrl = isLive ? nowPlaying?.art || livestream?.art : undefined
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
    navigator.mediaSession.setActionHandler("stop", () => {
      pauseRef.current()
    })

    return () => {
      navigator.mediaSession.setActionHandler("play", null)
      navigator.mediaSession.setActionHandler("pause", null)
      navigator.mediaSession.setActionHandler("stop", null)
    }
  }, [currentTitle, isLive, isPlaying, livestream, nowPlaying, src, stationTitle])
}
