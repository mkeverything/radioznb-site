'use client'

import { usePlayer } from '@/components/PlayerContext'
import { FC, PropsWithChildren } from 'react'
import { getPublishedRecordingsByProgramId } from '@/lib/actions'
import { useQuery } from '@tanstack/react-query'
import RecordingComponent from './Recording'

const Recordings: FC<{ programId: string }> = ({ programId }) => {
	const { data: recordings } = useQuery({
		queryKey: ['recordings', programId],
		queryFn: async () => {
			const recs = await getPublishedRecordingsByProgramId(programId)
			return recs
		},
	})
	const { play } = usePlayer()

	if (!recordings) return null
	const sorted = recordings
		?.slice()
		.sort(
			(a, b) => b.recordings.addedAt.valueOf() - a.recordings.addedAt.valueOf()
		)

	if (!sorted)
		return (
			<Container className='h-16 w-full animate-pulse opacity-50'>
				загрузка...
			</Container>
		)
	if (!sorted.length) return null

	return (
		<Container>
			{sorted.map((rec) => (
				<RecordingComponent key={rec.recordings.id} rec={rec} play={play} />
			))}
		</Container>
	)
}

const Container: FC<PropsWithChildren & { className?: string }> = ({
	children,
	className,
}) => (
	<div
		className={`flex flex-col items-start bg-stone-700/50 text-white p-4 w-full ${className}`}
	>
		{children}
	</div>
)

export default Recordings
