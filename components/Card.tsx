import { FC, PropsWithChildren } from 'react'

const Card: FC<{ className?: string } & PropsWithChildren> = ({
	className,
	children,
}) => {
	return (
		<div
			className={`w-32 h-32 text-wrap whitespace-break-spaces text-ellipsis text-[80%] aspect-square bg-white rounded-xl text-black p-4 ${className}`}
		>
			{children}
		</div>
	)
}

export default Card
