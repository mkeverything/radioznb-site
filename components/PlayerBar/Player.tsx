'use client'

import { usePathname } from 'next/navigation'
import Controls from './Controls'
import { usePlayer } from '../PlayerContext'
import ProgressBar from './ProgressBar'
import VolumeBar from './VolumeBar'

const PlayerBar = () => {
	const { src, isLive } = usePlayer()
	const pathname = usePathname()

	if (!src) return null
	if (pathname === '/' && isLive)
		return <VolumeBar className='fixed bottom-8 right-8' />
	return (
		<div
			className={`fixed flex sm:bottom-8 bottom-0 bg-white invert dark:bg-transparent dark:backdrop-blur-xs justify-center ${isLive ? 'sm:max-w-1/3' : 'sm:max-w-2/3'} transition-all duration-300 m-auto sm:h-24 left-0 right-0 z-50`}
		>
			<div className='flex relative w-full max-sm:flex-col-reverse items-center h-full p-4 sm:px-8 sm:gap-4 gap-2'>
				<Controls />
				<ProgressBar />
				<VolumeBar />
			</div>
		</div>
	)
}

export const formatTime = (time: number): string => {
	if (isNaN(time) || time < 0) return '00:00'

	const hours = Math.floor(time / 3600)
	const minutes = Math.floor((time % 3600) / 60)
	const seconds = Math.floor(time % 60)

	if (hours > 0) {
		return [hours, minutes, seconds]
			.map((v) => String(v).padStart(2, '0'))
			.join(':')
	} else {
		return [minutes, seconds].map((v) => String(v).padStart(2, '0')).join(':')
	}
}

export default PlayerBar
