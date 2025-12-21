'use client'

import { formatTime } from './Player'
import { usePlayer } from '../PlayerContext'
import PlayerBarWavesAnimation from './Waves'

const ProgressBar = () => {
	const { title, timecode, duration, seek, isLive, isPlaying } = usePlayer()

	if (isLive) return <PlayerBarWavesAnimation playing={isPlaying} />

	return (
		<div className='w-full h-fit flex flex-col min-w-0 justify-center gap-1'>
			<div className='truncate text-sm'>{title}</div>

			<input
				type='range'
				min={0}
				max={duration}
				step={0.1}
				value={timecode}
				onChange={(e) => seek(Number(e.target.value))}
				className={`
				w-full
				h-0.5
				appearance-none
        ${inputExtraStyles}`}
			/>

			<div className='flex w-full text-xs opacity-30 justify-between'>
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
