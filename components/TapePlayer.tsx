'use client'

import Image from 'next/image'
import LiveIndicator from './LiveIndicator'
import { stream, Stream, usePlayer } from './PlayerContext'
import WaveAnimation from './Waves'
import useRandomArchiveStream from './hooks/useRandomArchiveRecord'

const TapePlayer = () => {
	const {
		src,
		isPlaying: playing,
		isLive,
		play,
		pause,
		toggle: togglePlay,
	} = usePlayer()
	const isPlayingLive = playing && isLive
	const isPlayingArchive = playing && !isLive
	const randomArchiveStream = useRandomArchiveStream()

	const toggle = (playing: boolean, stream: Stream) =>
		playing ? pause() : play(stream)

	const onToggle = () =>
		isLive
			? toggle(isPlayingArchive, randomArchiveStream)
			: toggle(isPlayingLive, stream)

	const onPlay = () => (!src ? play(randomArchiveStream) : togglePlay())

	return (
		<div
			className='sm:w-3xl w-2xl relative'
			onDragStart={(e) => e.preventDefault()}
		>
			<WaveAnimation />
			<div className='relative size-full'>
				<Image
					className='relative inset-0'
					src='/assets/tape-player/main.png'
					alt='player'
					width={1366}
					height={768}
					priority
				/>
				<Image
					className={`absolute top-0 origin-[67%_25%] max-sm:scale-x-75 transition-transform duration-700 ease-in-out ${isPlayingLive && 'rotate-45'}`}
					src={'/assets/tape-player/antenna.png'}
					width={1366}
					height={768}
					alt='antenna'
				/>
				<div
					onClick={onToggle}
					className='h-1/4 absolute top-16 right-2/5 left-2/7 cursor-pointer z-20'
				/>
				<Image
					className='absolute top-[29.5%] skew-3 left-[30%] h-2.5 w-auto'
					src={`/assets/tape-player/live.png`}
					width={1366}
					height={768}
					alt='title-radio'
				/>
				<Image
					className='absolute top-[25.5%] scale-x-90 scale-y-120 sm:left-[40%] left-[40.5%] sm:h-8 h-7 w-auto'
					src={`/assets/tape-player/toggle${isLive ? 'L' : 'R'}.png`}
					width={1366}
					height={768}
					alt='toggle'
				/>
				<Image
					className='absolute top-[30%] skew-1 left-[48%] h-3.5 w-auto'
					src={`/assets/tape-player/archive.png`}
					width={1366}
					height={768}
					alt='title-tape'
				/>
				<LiveIndicator />
				<div
					onClick={onPlay}
					className='h-1/3 aspect-square absolute bottom-10 w-auto left-[41%] cursor-pointer z-10'
				/>
				<Image
					className='absolute bottom-[17%] left-[50%] -translate-x-1/2 h-6 w-auto cursor-pointer'
					src={`/assets/${playing ? 'pause-sm' : 'play-sm'}.png`}
					width={1366}
					height={768}
					alt='live'
				/>
				<Image
					className={`absolute bottom-[33%] left-[42.5%] size-5 ${isPlayingArchive && 'animate-spin'}`}
					src={'/assets/tape-player/gear-l.png'}
					width={1366}
					height={768}
					alt='gear-l'
				/>
				<Image
					className={`absolute bottom-[33%] right-[41.5%] z-10 size-5 ${isPlayingArchive && 'animate-spin'}`}
					src={'/assets/tape-player/gear-r.png'}
					width={1366}
					height={768}
					alt='gear-r'
				/>
			</div>
		</div>
	)
}

export default TapePlayer
