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
		<div className='flex flex-wrap gap-2'>
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
						className='flex flex-col rounded-md justify-end items-start text-left'
					>
						<span className='font-bold'>{rec.programs.name}</span>
						<span>{rec.recordings.episodeTitle}</span>
					</Card>
				</button>
			))}
		</div>
	)
}

export default NewRecordings
