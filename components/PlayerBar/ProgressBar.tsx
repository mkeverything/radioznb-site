"use client"

import { formatNowPlayingLine } from "../hooks/useLivestreamStatus"
import { formatTime } from "./Player"
import { usePlayer } from "../PlayerContext"
import PlayerBarWavesAnimation from "./Waves"

const ProgressBar = () => {
  const { title, timecode, duration, seek, isLive, isPlaying, nowPlaying } =
    usePlayer()

  if (isLive) {
    const showPlaylist =
      nowPlaying?.playlist?.trim() && formatNowPlayingLine(nowPlaying)

    return (
      <div className="flex w-full min-w-0 grow items-center gap-3 max-sm:gap-2">
        {nowPlaying?.art ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={nowPlaying.art}
            alt=""
            className="ignore-invert invert size-10 shrink-0 rounded-md object-cover max-sm:size-8"
          />
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
          <div className="truncate text-lg text-wrap uppercase max-sm:text-base">
            {title}
          </div>
          {showPlaylist ? (
            <div className="truncate text-xs opacity-40 max-sm:text-[0.65rem]">
              {nowPlaying?.playlist}
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-fit w-full min-w-0 flex-col justify-center gap-1">
      <div className="truncate text-lg uppercase">{title}</div>

      <input
        type="range"
        min={0}
        max={duration}
        step={0.1}
        value={timecode}
        onChange={(e) => seek(Number(e.target.value))}
        className={`h-0.5 w-full appearance-none ${inputExtraStyles}`}
      />

      <div className="flex w-full justify-between text-xs opacity-30">
        <div>{formatTime(timecode)}</div>
        <div>{formatTime(duration)}</div>
      </div>
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
  [&::-webkit-slider-thumb]:size-3
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
  [&::-webkit-slider-thumb]:mt-[-5px]  /* recenter thumb for thin track */
  [&::-moz-range-thumb]:size-3
  [&::-moz-range-thumb]:rounded-full
  [&::-moz-range-thumb]:bg-current
`

export default ProgressBar
