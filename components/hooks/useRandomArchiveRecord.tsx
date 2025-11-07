import { getRecordings } from '@/lib/actions'
import { useQuery } from '@tanstack/react-query'
import { Stream } from '../PlayerContext'

const useRandomArchiveStream = (): Stream => {
	const { data: randomRec } = useQuery({
		queryKey: ['recordings', 'random'],
		queryFn: async () => {
			const allRecs = await getRecordings()
			if (allRecs.success && allRecs.data && allRecs.data.length > 0) {
				const index = Math.floor(Math.random() * allRecs.data.length)
				return allRecs.data[index]
			}
			return undefined
		},
	})

	return {
		src: randomRec ? randomRec.fileUrl : '',
		title: randomRec ? randomRec.episodeTitle : '',
    isLive: false
	}
}

export default useRandomArchiveStream
