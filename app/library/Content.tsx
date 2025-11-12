'use client'

import Card from '@/components/Card'
import { getPrograms } from '@/lib/actions'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import NewRecordings from './NewRecordings'
import FlexContainer from '@/components/FlexContainer'

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
			<span>Недавние выпуски:</span>
			<FlexContainer>
				<NewRecordings />
			</FlexContainer>
			<span>Все передачи:</span>
			<FlexContainer>
				{programs.data?.map(({ programs: { id, name, slug } }) => (
					<button
						key={id}
						onClick={() => router.push(`/library/${slug}`)}
						className={`hover:underline`}
					>
						<Card className='flex items-center font-bold justify-center rounded-full'>{name}</Card>
					</button>
				))}
			</FlexContainer>
		</div>
	)
}

export default PageContent
