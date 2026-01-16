import { RecordSquare } from '@/components/Cards'
import Link from 'next/link'
import { FC } from 'react'

const Featured: FC = () => {
	return (
		<div className='w-full'>
			<div className='text-4xl'>премьера</div>
			<div className='flex w-full'>
				<Link href='/'>
					<div className='relative hover:scale-105 transition-all'>
						<span className='sm:text-4xl text-2xl absolute h-full inset-0 flex items-center p-4 break-all line-clamp-4 uppercase invert z-10'>
							название в четыре константинополя
						</span>
						<RecordSquare className='w-42 sm:w-64'></RecordSquare>
					</div>
				</Link>
				<span className='text-wrap break-all sm:text-2xl text-xl max-w-1/2'>
					это не очень длинное однако какое-никакое описание этой премьерной
					передачи. или подкаста. или репортажа. или микстейпа. или чего ещё
					похлеще
				</span>
			</div>
		</div>
	)
}

export default Featured
