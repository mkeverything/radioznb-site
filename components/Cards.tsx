import Image from 'next/image'
import { FC, HTMLAttributes, PropsWithChildren } from 'react'

export const ProgramCircle: FC<
	{ className?: string } & PropsWithChildren & HTMLAttributes<HTMLDivElement>
> = ({ className, children, ...props }) => {
	return (
		<div
			className={`size-28 text-wrap whitespace-break-spaces text-[10px] aspect-square text-black p-2 relative ${className}`}
			{...props}
		>
			<Image
				className='absolute inset-0 z-0'
				src='/assets/new/circle.png'
				width={1215}
				height={1254}
				alt={'circle'}
			/>
			<div className='z-10 p-4 m-auto size-fit flex drop-shadow-[0_0_0.75px_rgba(0,0,0,0)] h-fit absolute inset-0 justify-center items-center'>
				{children}
			</div>
		</div>
	)
}

export const RecordSquare: FC<
	{ className?: string } & PropsWithChildren & HTMLAttributes<HTMLDivElement>
> = ({ className, children, ...props }) => {
	return (
		<div
			className={`text-wrap whitespace-break-spaces text-[10px] aspect-square text-black p-4 relative ${className}`}
			{...props}
		>
			<Image
				className='absolute inset-0 z-0'
				src='/assets/new/square.png'
				width={1215}
				height={1254}
				alt={'circle'}
			/>
			<div className='drop-shadow-[0_0_1px_white] py-2'>{children}</div>
		</div>
	)
}
