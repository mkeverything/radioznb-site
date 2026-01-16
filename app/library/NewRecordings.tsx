'use client'

import { RecordSquare } from '@/components/Cards'
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
		<div className='grid grid-cols-3 lg:grid-cols-7 md:grid-cols-5 sm:grid-cols-4 w-full gap-2'>
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
					<RecordSquare
						key={rec.recordings.id}
						className='flex flex-col rounded-md justify-end text-left gap-1 grow w-full h-full'
					>
						<span className='line-clamp-4'>{rec.recordings.episodeTitle}</span>
						<span className='font-bold uppercase'>{rec.programs.name}</span>
					</RecordSquare>
				</button>
			))}
		</div>
	)
}

export default NewRecordings
