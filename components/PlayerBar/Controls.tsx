import Image from 'next/image'
import { stream, usePlayer } from '../PlayerContext'

const Controls = () => {
	const { isPlaying, toggle, isLive, play, livestream } = usePlayer()
	const icon = isPlaying ? 'pause' : 'play'

	return (
		<div className='flex gap-4 relative w-full sm:w-32 sm:justify-start items-center justify-center max-sm:flex-row-reverse'>
			<button onClick={toggle} className='size-6 sm:size-8'>
				<Image
					className='w-full h-full'
					width={354}
					height={354}
					src={`/assets/${icon}-sm.png`}
					alt='play'
				/>
			</button>
			{!isLive && livestream?.is_live && (
				<button
					className={`sm:static size-16 p-2 absolute -left-4 -bottom-4`}
					onClick={() => play(stream)}
					title={`в эфире ${livestream.streamer_name}!`}
				>
					<Image
						className='ignore-invert invert'
						src={'/assets/live-animation.gif'}
						width={107}
						height={107}
						alt='live'
					/>
				</button>
			)}
		</div>
	)
}

// export const streamArchive = {
// 	title: `моковая архивная запись – орфей`,
// 	src: `https://orfeyfm.hostingradio.ru:8034/orfeyfm128.mp3`,
// 	isLive: false,
// }

export default Controls
