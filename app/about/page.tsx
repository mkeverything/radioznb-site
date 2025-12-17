import HomeButton from '@/components/HomeButton'
import Image from 'next/image'
import Link from 'next/link'

const Page = async () => {
	const request = await fetch(
		'https://server.radioznb.ru/api/station/radioznb-live',
		{
			headers: {
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_RADIOZNB_API_KEY}`,
			},
		}
	)
	const data = await request.json()

	return (
		<div className='flex flex-col w-full'>
			<HomeButton />
			<div className='flex flex-col items-center'>
				<p className='sm:p-12 p-4 max-w-lg'>{data.description}</p>
				<Link href='https://t.me/radi0ZnB'>
					<Image
						className='size-24 hover:scale-105 transition-all'
						width={166}
						height={150}
						src='/assets/tg.png'
						alt='telegram'
					/>
				</Link>
			</div>
		</div>
	)
}

export default Page
