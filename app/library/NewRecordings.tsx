'use client'

import Card from '@/components/Card'
import { usePlayer } from '@/components/PlayerContext'
import { getNewRecordings } from '@/lib/actions'
import { useQuery } from '@tanstack/react-query'

const NewRecordings = () => {
	const { data } = useQuery({
		queryKey: ['newRecordings'],
		queryFn: getNewRecordings,
	})
	const { play } = usePlayer()

	if (!data) return null
	return (
		<div className='grid grid-cols-3 lg:grid-cols-9 md:grid-cols-7 sm:grid-cols-5 w-full gap-2'>
			{data.map((rec) => (
				<button
					key={rec.recordings.id}
					onClick={() => {
						play({
							title: `${rec.programs?.name} – ${rec.recordings.episodeTitle}`,
							src: rec.recordings.fileUrl,
							isLive: false,
						})
					}}
				>
					<Card
						key={rec.recordings.id}
						className='flex flex-col rounded-md text-left gap-1 grow w-full h-full'
					>
						<span className='font-bold text-xs'>{rec.programs.name}</span>
						<span className='line-clamp-4'>{rec.recordings.episodeTitle}</span>
					</Card>
				</button>
			))}
		</div>
	)
}

export default NewRecordings
