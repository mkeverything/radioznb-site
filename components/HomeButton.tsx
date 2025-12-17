import Image from 'next/image'
import Link from 'next/link'

const HomeButton = () => (
	<Link href='/' className='sticky top-4 left-4 size-20 max-sm:bg-black aspect-square'>
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
