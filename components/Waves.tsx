'use client'

import Image from 'next/image'
import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { usePlayer } from './PlayerContext'

const WaveAnimation: FC<PropsWithChildren> = ({ children }) => {
	const [src, setSrc] = useState<Wave>(waves[0])
	const { isPlaying, isLive } = usePlayer()

	useEffect(() => {
		setSrc(waves[Math.floor(Math.random() * waves.length)])

		const interval = setInterval(() => {
			setSrc((prev) => {
				const nextIndex = (waves.indexOf(prev) + 1) % waves.length
				return waves[nextIndex]
			})
		}, 2000)
		return () => clearInterval(interval)
	}, [isPlaying, isLive])

	if (!isPlaying || !isLive) return children
	return (
		<div className='pointer-events-none'>
			<WavesLeft src={src.left} />
			{children}
			<WavesRight src={src.right} />
		</div>
	)
}

const WavesLeft: FC<{ src: string[] }> = ({ src }) => (
	<div className='absolute h-1/5 w-1/7 flex gap-2 sm:gap-4 left-2/7 -top-1/3 max-sm:translate-x-1/3'>
		<div
			className={`animate-waves relative opacity-0 h-full w-1/4`}
			style={{ animationDelay: '500ms' }}
		>
			<Image src={src[0]} alt='wave-l-1' fill sizes='100vw' />
		</div>
		<div
			className={`animate-waves relative opacity-0 top-1/5 h-2/3 w-1/6`}
			style={{ animationDelay: '400ms' }}
		>
			<Image src={src[1]} alt='wave-l-2' fill sizes='100vw' />
		</div>
		<div
			className={`animate-waves relative opacity-0 top-2/5 h-2/5 w-1/8`}
			style={{ animationDelay: '300ms' }}
		>
			<Image src={src[2]} alt='wave-l-3' fill sizes='100vh' />
		</div>
	</div>
)

const WavesRight: FC<{ src: string[] }> = ({ src }) => (
	<div className='absolute h-1/5 w-1/7 flex gap-2 sm:gap-4 right-1/4 -top-1/3'>
		<div
			className={`animate-waves relative opacity-0 top-2/5 h-2/5 w-1/8`}
			style={{ animationDelay: '300ms' }}
		>
			<Image src={src[0]} alt='wave-r-1' fill />
		</div>
		<div
			className={`animate-waves relative opacity-0 top-1/5 h-2/3 w-1/6`}
			style={{ animationDelay: '400ms' }}
		>
			<Image src={src[1]} alt='wave-r-2' fill />
		</div>
		<div
			className={`animate-waves relative opacity-0 h-full w-1/4`}
			style={{ animationDelay: '500ms' }}
		>
			<Image src={src[2]} alt='wave-r-3' fill />
		</div>
	</div>
)

const waves = [
	{
		left: [
			'/assets/waves/lwave-11.png',
			'/assets/waves/lwave-21.png',
			'/assets/waves/lwave-31.png',
		],
		right: [
			'/assets/waves/rwave-11.png',
			'/assets/waves/rwave-21.png',
			'/assets/waves/rwave-31.png',
		],
	},
	{
		left: [
			'/assets/waves/lwave-12.png',
			'/assets/waves/lwave-22.png',
			'/assets/waves/lwave-32.png',
		],
		right: [
			'/assets/waves/rwave-12.png',
			'/assets/waves/rwave-22.png',
			'/assets/waves/rwave-32.png',
		],
	},
	{
		left: [
			'/assets/waves/lwave-13.png',
			'/assets/waves/lwave-23.png',
			'/assets/waves/lwave-33.png',
		],
		right: [
			'/assets/waves/rwave-13.png',
			'/assets/waves/rwave-23.png',
			'/assets/waves/rwave-33.png',
		],
	},
]

type Wave = (typeof waves)[0]

export default WaveAnimation
