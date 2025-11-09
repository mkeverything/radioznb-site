import Image from 'next/image'
import Link from 'next/link'

const HomeButton = () => (
	<Link href='/' className='sticky top-4 left-4 backdrop-blur-xs p-2 size-24'>
		<Image
			src='/assets/logo.png'
			className='size-full'
			height={640}
			width={640}
			alt='logo'
		/>
	</Link>
)

export default HomeButton
