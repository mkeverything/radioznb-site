"use client"

import { RecordSquare } from "@/components/Cards"
import { usePlayer } from "@/components/PlayerContext"
import { Program, Recording } from "@/db/schema"
import { FC } from "react"

const NewRecordings: FC<{
  featured?: { recordings: Recording; programs: Program }
  newRecordings?: { recordings: Recording; programs: Program }[]
}> = ({ featured, newRecordings }) => {
  const { play } = usePlayer()

  const featuredId = featured?.recordings.id
  const recordings = newRecordings?.filter(
    (rec) => rec.recordings.id !== featuredId,
  )

  if (!recordings) return null

  return (
    <div className="grid w-full grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
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
            className="flex h-full w-full grow gap-1 rounded-md text-left"
          >
            <div className="flex size-full flex-col justify-between">
              <span className="line-clamp-2 sm:line-clamp-3 md:line-clamp-2 lg:line-clamp-4">
                {rec.recordings.episodeTitle}
              </span>
              <span className="uppercase">{rec.programs.name}</span>
            </div>
          </RecordSquare>
        </button>
      ))}
    </div>
  )
}

export default NewRecordings
