'use client'

import { FC, useState } from 'react'
import { usePlayer } from '../PlayerContext'
import Image from 'next/image'

const VolumeBar: FC<{ className?: string }> = ({ className }) => {
	const { volume, setVolume } = usePlayer()
	const [visible, setVisible] = useState(false)

	const commonProps = {
		onMouseOver: () => setVisible(true),
		onMouseLeave: () => setVisible(false),
	}

	return (
		<div className={`${className} ml-4 max-lg:hidden`}>
			<div className={`relative`}>
				{visible && (
					<input
						type='range'
						min={0}
						max={1}
						step={0.01}
						value={volume}
						style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
						{...commonProps}
						onChange={(e) => setVolume(parseFloat(e.target.value))}
						className='volume-slider transition-all duration-700 absolute bottom-full left-0 right-0 accent-stone-800 dark:accent-black'
					/>
				)}
				<button {...commonProps} onClick={() => setVolume(volume > 0 ? 0 : 1)}>
					<Image
						className='h-8 w-auto'
						src={`/assets/speaker${getVolumeIcon(volume)}.png`}
						width={515}
						height={310}
						alt='volume'
					/>
				</button>
			</div>
		</div>
	)
}

const getVolumeIcon = (volume: number) => {
	switch (true) {
		case volume >= 0.66:
			return '3'
		case volume >= 0.33:
			return '2'
		case volume > 0:
			return ''
		case volume === 0:
			return ''
	}
}

export default VolumeBar
