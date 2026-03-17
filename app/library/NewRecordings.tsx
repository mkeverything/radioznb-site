"use client"

import { RecordSquare } from "@/components/Cards"
import { usePlayer } from "@/components/PlayerContext"
import { Program, Recording } from "@/db/types"
import { getRecordingSeasonEpisodeString } from "@/helpers"
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
    <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {recordings.map((rec) => (
        <button
          key={rec.recordings.id}
          className="group w-full text-left focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none"
          onClick={() => {
            play({
              title: `${rec.programs?.name} – ${rec.recordings.episodeTitle}`,
              src: rec.recordings.fileUrl,
              isLive: false,
            })
          }}
        >
          <RecordSquare type={rec.recordings.type} className="flex">
            <div className="flex size-full flex-col justify-between gap-2">
              <span className="line-clamp-2 text-left text-xs leading-snug font-semibold uppercase sm:text-sm md:text-base">
                {rec.recordings.episodeTitle}
              </span>
              <span className="mt-auto flex flex-col gap-0.5 text-right text-sm lowercase sm:text-base">
                <span className="h-full truncate">{rec.programs.name}</span>
                <span className="leading-tight">
                  {getRecordingSeasonEpisodeString(rec.recordings)}
                </span>
              </span>
            </div>
          </RecordSquare>
        </button>
      ))}
    </div>
  )
}

export default NewRecordings
