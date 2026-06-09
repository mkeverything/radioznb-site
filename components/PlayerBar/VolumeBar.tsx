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
		<div className={`overflow-visible ${className ?? ''}`}>
			<div className="relative overflow-visible">
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
						className='volume-slider absolute bottom-full left-1/2 z-[60] mb-1 h-24 w-6 -translate-x-1/2 accent-stone-800 transition-all duration-700 dark:accent-black'
					/>
				)}
				<button {...commonProps} onClick={() => setVolume(volume > 0 ? 0 : 1)}>
					<Image
						className='h-6 w-auto'
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
