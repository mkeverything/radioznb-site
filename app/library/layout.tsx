import HomeButton from '@/components/HomeButton'
import { FC, PropsWithChildren } from 'react'

const Layout: FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className='flex gap-16'>
			<HomeButton />
			{children}
		</div>
	)
}

export default Layout
