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
    <div className="grid w-full grid-cols-2 gap-3 min-[430px]:gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
            <div className="flex size-full min-w-0 flex-col justify-between gap-2 overflow-hidden">
              <span className="flex min-w-0 flex-col gap-1 text-left text-[0.65rem] uppercase sm:text-sm lg:text-sm">
                <span className="line-clamp-2 break-words">
                  {rec.programs.name}
                </span>
                <span className="line-clamp-2 leading-tight break-words opacity-80">
                  {getRecordingSeasonEpisodeString(rec.recordings)}
                </span>
              </span>
              <span className="line-clamp-3 min-w-0 text-right text-[0.65rem] leading-snug font-semibold break-words uppercase sm:text-sm md:text-base lg:text-xs">
                {rec.recordings.episodeTitle}
              </span>
            </div>
          </RecordSquare>
        </button>
      ))}
    </div>
  )
}

export default NewRecordings
