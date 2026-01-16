'use client'

import TapePlayer from '@/components/TapePlayer'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'

export default function Home() {
	return (
		<div className='flex items-center justify-center inset-0 fixed'>
			<Desktop className='max-sm:hidden' />
			<Mobile className='sm:hidden' />
			<Image
				src={'/assets/table.png'}
				className='fixed bottom-8 left-0 right-0 sm:h-2/3 h-2/5 -z-10'
				height={5906}
				width={5906}
				alt='table'
			/>
		</div>
	)
}

const Desktop: FC<{ className: string }> = ({ className }) => {
	return (
		<div className={`flex w-full relative ${className}`}>
			<Link
				href={'/about'}
				className='max-sm:w-1/3 left-8 absolute top-1/2 z-10'
			>
				<Image
					src={'/assets/about-us.png'}
					className='h-64 w-auto hover:scale-105 transition'
					height={5906}
					width={5906}
					alt='about-us'
				/>
			</Link>
			<div className='flex w-full justify-center'>
				<TapePlayer />
			</div>
			<Link
				href={'/library'}
				className='max-sm:w-1/3 absolute -right-8 top-1/4'
			>
				<Image
					src={'/assets/tapes.png'}
					className='h-108 w-auto hover:scale-105 transition'
					height={5906}
					width={5906}
					alt='tapes'
				/>
			</Link>
		</div>
	)
}

const Mobile: FC<{ className: string }> = ({ className }) => {
	return (
		<div className={`flex w-full h-full flex-col relative ${className}`}>
			<Link href={'/about'} className='absolute top-4 left-8'>
				<Image
					src={'/assets/about-us-mobile.png'}
					className='h-32 w-auto hover:scale-105 transition'
					height={1816}
					width={2762}
					alt='about-us'
				/>
			</Link>
			<Link href={'/library'} className='absolute top-8 right-0'>
				<Image
					src={'/assets/tapes-mobile.png'}
					className='h-56 w-auto hover:scale-105 transition'
					height={3107}
					width={3734}
					alt='tapes'
				/>
			</Link>
			<div className='flex w-[175%] -left-[36%] absolute bottom-14 justify-center'>
				<TapePlayer />
			</div>
		</div>
	)
}
