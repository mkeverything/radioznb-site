import HomeButton from '@/components/HomeButton'
import { FC, PropsWithChildren } from 'react'

const Layout: FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className='flex flex-col'>
			<HomeButton />
			<div className='flex'>
				<div className='w-64 h-full max-sm:hidden'></div>
				{children}
			</div>
		</div>
	)
}

export default Layout
