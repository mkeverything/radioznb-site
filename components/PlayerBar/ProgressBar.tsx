"use client"

import { usePlayer } from "../PlayerContext"
import { formatTime } from "./Player"

const ProgressBar = () => {
  const { title, timecode, duration, seek, isLive, nowPlaying, livestream } =
    usePlayer()

  if (isLive) {
    const songArtist = nowPlaying?.artist?.trim()
    const songTitle = nowPlaying?.title?.trim()
    const playlist = nowPlaying?.playlist?.trim()
    const hasSong = !!(songArtist || songTitle)
    const showPlaylistExtra = !!playlist && hasSong

    const hostOnAir =
      livestream?.is_live &&
      (livestream.streamer_name?.trim() || nowPlaying?.streamer?.trim())

    const coverArt =
      nowPlaying?.art ||
      (livestream?.is_live && livestream.art ? livestream.art : null)

    return (
      <div
        className={`flex w-full min-w-0 flex-1 flex-row items-center gap-2 max-sm:gap-1.5`}
      >
        {coverArt ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverArt}
            alt=""
            className="ignore-invert size-8 shrink-0 self-center rounded-md object-cover invert max-sm:size-7"
          />
        ) : null}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center">
          {hostOnAir ? (
            <>
              <div className="line-clamp-2 text-xs uppercase opacity-50 max-sm:text-[0.65rem]">
                {title}
              </div>
              <div className="text-sm font-medium text-pretty break-words opacity-90 max-sm:text-xs">
                {livestream?.streamer_name?.trim() ||
                  nowPlaying?.streamer?.trim()}
              </div>
            </>
          ) : (
            <>
              {songArtist ? (
                <div className="text-sm text-pretty break-words opacity-80 max-sm:text-xs">
                  {songArtist}
                </div>
              ) : null}
              {songTitle ? (
                <div className="text-lg text-pretty break-words uppercase max-sm:text-base">
                  {songTitle}
                </div>
              ) : null}
              {!hasSong && playlist ? (
                <div className="text-lg text-pretty break-words uppercase max-sm:text-base">
                  {playlist}
                </div>
              ) : null}
              {showPlaylistExtra ? (
                <div className="text-xs text-pretty break-words opacity-40 max-sm:text-[0.65rem]">
                  {playlist}
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex h-fit w-full min-w-0 flex-1 flex-col justify-center gap-2`}
    >
      <div className="text-lg text-pretty break-words uppercase">{title}</div>

      <input
        type="range"
        min={0}
        max={duration}
        step={0.1}
        value={timecode}
        onChange={(e) => seek(Number(e.target.value))}
        className={`h-0.5 w-full shrink-0 appearance-none ${inputExtraStyles}`}
      />

      <div className="flex w-full shrink-0 justify-between text-xs opacity-30">
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
