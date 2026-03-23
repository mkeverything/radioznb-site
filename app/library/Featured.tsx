"use client"

import { RecordSquare } from "@/components/Cards"
import { usePlayer } from "@/components/PlayerContext"
import { Program, Recording } from "@/db/types"
import Link from "next/link"
import { FC } from "react"

const Featured: FC<{
  featured?: { recordings: Recording; programs: Program }
}> = ({ featured }) => {
  if (!featured) return null

  const description = featured.recordings.description?.trim()
  const fallbackDescription = `${featured.programs.name} – ${featured.recordings.episodeTitle}`

  const { play } = usePlayer()
  const title = `${featured.programs.name} – ${featured.recordings.episodeTitle}`

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="text-4xl">премьера</div>
      <div className="flex w-full gap-4">
        <button
          type="button"
          onClick={() =>
            play({
              title,
              src: featured.recordings.fileUrl,
              isLive: false,
            })
          }
          className="relative cursor-pointer text-left transition-all hover:scale-105"
        >
          <div>
            <div className="absolute inset-0 z-10 line-clamp-4 flex h-full flex-col items-start justify-between p-6 uppercase invert sm:p-8 sm:text-4xl">
              <span className="pr-4 text-xs sm:text-lg">
                {featured.programs.name}
              </span>
              <span className="text-xs sm:text-lg">
                {featured.recordings.episodeTitle}
              </span>
            </div>
            <RecordSquare type="podcast" className="w-36 sm:w-48" />
          </div>
        </button>
        <span className="max-w-1/2 text-xl text-wrap sm:text-2xl">
          <Link href={`/library/${featured.programs.slug}`}>
            {description || fallbackDescription}{" "}
          </Link>
        </span>
      </div>
    </div>
  )
}

export default Featured
