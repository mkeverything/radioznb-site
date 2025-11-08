import { getRecordings } from '@/lib/actions'
import { useQuery } from '@tanstack/react-query'
import { getLocalStorageContext, Stream } from '../PlayerContext'

const useRandomArchiveStream = (): Stream => {
	const storedContext = getLocalStorageContext('archive-context')

	const { data: randomRec } = useQuery({
		queryKey: ['recordings', 'random'],
		enabled: !storedContext?.src,
		queryFn: async () => {
			const allRecs = await getRecordings()
			if (!allRecs.success || !allRecs.data?.length) return undefined

			const randomIndex = Math.floor(Math.random() * allRecs.data.length)
			return allRecs.data[randomIndex]
		},
	})

	const src = storedContext?.src || randomRec?.fileUrl || ''
	const title = storedContext?.title || randomRec?.episodeTitle || ''
	const timecode = storedContext?.timecode

	return { src, title, isLive: false, timecode }
}

export default useRandomArchiveStream
