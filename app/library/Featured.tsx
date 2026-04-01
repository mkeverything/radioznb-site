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
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start">
        <button
          type="button"
          onClick={() =>
            play({
              title,
              src: featured.recordings.fileUrl,
              isLive: false,
            })
          }
          className="relative w-fit shrink-0 cursor-pointer text-left transition-all hover:scale-105"
        >
          <div>
            <div className="absolute inset-0 z-10 flex h-full flex-col justify-between overflow-hidden p-4 uppercase invert sm:p-6">
              <span className="line-clamp-2 pr-6 text-[0.65rem] leading-tight sm:text-base">
                {featured.programs.name}
              </span>
              <span className="line-clamp-3 text-[0.65rem] leading-tight sm:text-base">
                {featured.recordings.episodeTitle}
              </span>
            </div>
            <RecordSquare type="podcast" className="w-28 sm:w-40 lg:w-48" />
          </div>
        </button>
        <span className="min-w-0 flex-1 text-base leading-tight break-words sm:max-w-[50%] sm:text-xl lg:text-2xl">
          <Link href={`/library/${featured.programs.slug}`}>
            {description || fallbackDescription}{" "}
          </Link>
        </span>
      </div>
    </div>
  )
}

export default Featured
