"use client"

import { PropsWithChildren } from "react"
import { usePlayer } from "../PlayerContext"
import Controls from "./Controls"
import { formatTime } from "./Player"
import VolumeBar from "./VolumeBar"

function TitleRow({ children }: PropsWithChildren) {
  const { isLive } = usePlayer()

  return (
    <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
      {!isLive && (
        <div className="hidden shrink-0 sm:block">
          <Controls />
        </div>
      )}
      <div className="min-w-0 flex-1">{children}</div>
      {!isLive && (
        <div className="shrink-0 sm:hidden">
          <Controls />
        </div>
      )}
      <VolumeBar className="hidden shrink-0 sm:block" />
    </div>
  )
}

function SongCredits({ className = "" }: { className?: string }) {
  const { nowPlaying } = usePlayer()
  const songArtist = nowPlaying?.artist?.trim()
  const songTitle = nowPlaying?.title?.trim()

  if (!songArtist && !songTitle) return null

  return (
    <p className={`min-w-0 text-pretty break-words ${className}`}>
      {songArtist ? (
        <span className="text-xs font-semibold tracking-wide sm:text-sm">
          {songArtist}
        </span>
      ) : null}
      {songArtist && songTitle ? " " : null}
      {songTitle ? (
        <span
          className={`text-xs sm:text-sm ${songArtist ? "opacity-50" : ""}`}
        >
          {songTitle}
        </span>
      ) : null}
    </p>
  )
}

function LiveNowPlaying() {
  const { title, nowPlaying, livestream } = usePlayer()

  const songArtist = nowPlaying?.artist?.trim()
  const songTitle = nowPlaying?.title?.trim()
  const playlist = nowPlaying?.playlist?.trim()
  const hasSong = !!(songArtist || songTitle)
  const hasPlaylist = !!playlist

  const hostOnAir =
    livestream?.is_live &&
    (livestream.streamer_name?.trim() || nowPlaying?.streamer?.trim())

  if (hostOnAir) {
    const host =
      livestream?.streamer_name?.trim() || nowPlaying?.streamer?.trim()
    return (
      <>
        <TitleRow>
          {host ? (
            <div className="line-clamp-1 text-xs font-semibold tracking-wide text-pretty break-words uppercase sm:text-sm">
              {host}
            </div>
          ) : null}
        </TitleRow>
        <div className="line-clamp-1 text-[0.625rem] uppercase opacity-45 sm:text-xs">
          {title}
        </div>
        {hasSong ? <SongCredits className="line-clamp-2" /> : null}
      </>
    )
  }

  if (hasPlaylist) {
    return (
      <>
        <TitleRow>
          <div className="line-clamp-1 text-xs text-pretty break-words uppercase sm:text-sm">
            {playlist}
          </div>
        </TitleRow>
        {hasSong ? <SongCredits className="line-clamp-2" /> : null}
      </>
    )
  }

  if (hasSong) {
    return (
      <TitleRow>
        <SongCredits className="line-clamp-3" />
      </TitleRow>
    )
  }

  return (
    <TitleRow>
      <div className="line-clamp-1 text-xs text-pretty break-words uppercase sm:text-sm">
        {title}
      </div>
    </TitleRow>
  )
}

function ArchiveSeekBar() {
  const { title, timecode, duration, seek } = usePlayer()

  return (
    <>
      <TitleRow>
        <div className="line-clamp-1 text-xs text-pretty break-words uppercase sm:text-sm">
          {title}
        </div>
      </TitleRow>

      <input
        type="range"
        min={0}
        max={duration}
        step={0.1}
        value={timecode}
        onChange={(e) => seek(Number(e.target.value))}
        className={`mt-2 h-0.5 w-full shrink-0 appearance-none sm:mt-2.5 ${inputExtraStyles}`}
      />

      <div className="flex w-full shrink-0 justify-between text-[0.625rem] opacity-30 sm:text-xs">
        <div>{formatTime(timecode)}</div>
        <div>{formatTime(duration)}</div>
      </div>
    </>
  )
}

const archiveProgressClass =
  "flex h-16 w-full min-w-0 flex-1 flex-col justify-center gap-1 overflow-x-hidden sm:h-20"

const liveProgressClass =
  "flex w-full min-w-0 flex-1 flex-col justify-center gap-0.5 overflow-visible sm:gap-1"

const ProgressBar = () => {
  const { isLive } = usePlayer()

  if (isLive) {
    return (
      <div className={liveProgressClass}>
        <LiveNowPlaying />
      </div>
    )
  }

  return (
    <div className={archiveProgressClass}>
      <ArchiveSeekBar />
    </div>
  )
}

const inputExtraStyles = `
  /* Track styling (MUST include bg color) */
  [&::-webkit-slider-runnable-track]:h-0.5
  [&::-webkit-slider-runnable-track]:rounded-full
  [&::-webkit-slider-runnable-track]:bg-black
  dark:[&::-webkit-slider-runnable-track]:bg-white
  [&::-moz-range-track]:h-1
  [&::-moz-range-track]:rounded-full
  /* Thumb styling */
  [&::-webkit-slider-thumb]:appearance-none
  [&::-webkit-slider-thumb]:size-3.5
  [&::-webkit-slider-thumb]:rounded-full
  [&::-webkit-slider-thumb]:bg-current
  [&::-webkit-slider-thumb:hover]:scale-125
  [&::-webkit-slider-thumb]:cursor-pointer
  [&::-webkit-slider-thumb:active]:cursor-grabbing
  [&::-moz-range-thumb]:cursor-pointer
  [&::-moz-range-thumb:active]:cursor-grabbing
  [&::-webkit-slider-thumb]:transition-transform
  [&::-moz-range-thumb:hover]:scale-125
  [&::-moz-range-thumb]:transition-transform
  [&::-webkit-slider-thumb]:mt-[-6px]
  [&::-moz-range-thumb]:size-3.5
  [&::-moz-range-thumb]:rounded-full
  [&::-moz-range-thumb]:bg-current
`

export default ProgressBar
