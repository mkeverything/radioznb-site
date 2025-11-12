'use client'

import Card from '@/components/Card'
import { getPrograms } from '@/lib/actions'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

const PageContent = () => {
	const {
		data: programs,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['programs'],
		queryFn: getPrograms,
	})

	const router = useRouter()

	if (isLoading) return <div>loading...</div>
	if (isError || !programs || !programs) return <div>error</div>

	return (
		<div className={`flex flex-wrap h-full gap-2 items-start min-w-1/3`}>
			{programs.data?.map(({ programs: { id, name, slug } }) => (
				<button
					key={id}
					onClick={() => router.push(`/library/${slug}`)}
					className={`hover:underline text-left`}
				>
					<Card className='flex items-end'>{name}</Card>
				</button>
			))}
		</div>
	)
}

export default PageContent
