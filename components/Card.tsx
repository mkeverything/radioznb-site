import { FC, HTMLAttributes, PropsWithChildren } from 'react'

const Card: FC<
	{ className?: string } & PropsWithChildren & HTMLAttributes<HTMLDivElement>
> = ({ className, children, ...props }) => {
	return (
		<div
			className={`w-24 h-24 text-wrap whitespace-break-spaces text-[10px] aspect-square text-stone-100 bg-stone-900 p-2 ${className}`}
			{...props}
		>
			{children}
		</div>
	)
}

export default Card
