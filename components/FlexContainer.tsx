import { FC, PropsWithChildren } from 'react'

const Flex: FC<{ className?: string } & PropsWithChildren> = ({
	children,
	className,
}) => {
	return <div className={`flex flex-wrap gap-2 ${className}`}>{children}</div>
}

export default Flex
