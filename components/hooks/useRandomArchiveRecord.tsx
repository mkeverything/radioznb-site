import { getRecordings } from '@/lib/actions'
import { useQuery } from '@tanstack/react-query'
import { getLocalStorageContext, Stream } from '../PlayerContext'

const useRandomArchiveStream = (): Stream => {
	const local = getLocalStorageContext('archive-context')

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
		enabled: !local,
	})

	return {
		src: local ? local.src : randomRec?.fileUrl || '',
		title: local ? local.title : randomRec?.episodeTitle || '',
		isLive: false,
		timecode: local?.timecode,
	}
}

export default useRandomArchiveStream
