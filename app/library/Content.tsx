'use client'

import { ProgramCircle } from '@/components/Cards'
import { getPrograms } from '@/lib/actions'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import NewRecordings from './NewRecordings'

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
		<div className={`flex flex-col gap-4`}>
			<span className='text-xl font-semibold'>новые выпуски</span>
			<NewRecordings />
			<span className='text-xl font-semibold'>все передачи</span>
			<div className='grid grid-cols-3 lg:grid-cols-7 md:grid-cols-5 sm:grid-cols-4 w-full gap-4'>
				{programs.data?.map(({ programs: { id, name, slug } }) => (
					<button
						key={id}
						onClick={() => router.push(`/library/${slug}`)}
						className={`hover:underline`}
					>
						<ProgramCircle className='flex items-center font-bold justify-center rounded-full'>
							{name}
						</ProgramCircle>
					</button>
				))}
			</div>
		</div>
	)
}

export default PageContent
