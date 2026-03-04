"use client"

import { RecordSquare } from "@/components/Cards"
import { usePlayer } from "@/components/PlayerContext"
import { getFeaturedPodcast, getNewRecordings } from "@/lib/actions"
import { useQuery } from "@tanstack/react-query"

const NewRecordings = () => {
  const { data } = useQuery({
    queryKey: ["newRecordings"],
    queryFn: getNewRecordings,
  })
  const { data: featured } = useQuery({
    queryKey: ["featuredPodcast"],
    queryFn: getFeaturedPodcast,
  })
  const { play } = usePlayer()

  const featuredId = featured?.recordings.id
  const recordings = data?.filter((rec) => rec.recordings.id !== featuredId)

  if (!recordings?.length) return null
  return (
    <div className="grid w-full grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
      {recordings.map((rec) => (
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
            type={rec.recordings.type}
            className="flex h-full w-full grow flex-col justify-end gap-1 rounded-md text-left"
          >
            <span className="line-clamp-2">{rec.recordings.episodeTitle}</span>
            <span className="font-bold uppercase">{rec.programs.name}</span>
          </RecordSquare>
        </button>
      ))}
    </div>
  )
}

export default NewRecordings
