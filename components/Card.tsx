import { FC, HTMLAttributes, PropsWithChildren } from 'react'

const Card: FC<{ className?: string } & PropsWithChildren & HTMLAttributes<HTMLDivElement>> = ({
	className,
	children,
  ...props
}) => {
	return (
		<div
			className={`w-32 h-32 text-wrap whitespace-break-spaces text-ellipsis text-[80%] aspect-square bg-white text-black p-4 ${className}`}
      {...props}
		>
			{children}
		</div>
	)
}

export default Card
