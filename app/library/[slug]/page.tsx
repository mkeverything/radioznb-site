'use client'

import { getProgramBySlug } from '@/lib/actions'
import { useQuery } from '@tanstack/react-query'
import { FC, use } from 'react'
import Recordings from './Recordings'

const Page: FC<{ params: Promise<{ slug: string }> }> = ({ params }) => {
	const { slug } = use(params)
	const { data } = useQuery({
		queryKey: ['programById'],
		queryFn: () => getProgramBySlug(slug),
	})

	if (!data) return null

	const { programs, people } = data
	return (
		<div className='flex flex-col w-full gap-2'>
			<div className='pl-4'>
				<div className='text-3xl font-bold'>{programs.name}</div>
				{programs.description}
				{people?.name && (
					<div className='opacity-30 text-xl'>передачу ведёт {people.name}</div>
				)}
			</div>
			<Recordings programId={programs.id} />
		</div>
	)
}

export default Page
