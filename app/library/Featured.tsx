"use client"

import { usePlayer } from "@/components/PlayerContext"
import { Program, Recording } from "@/db/types"
import Image from "next/image"
import { FC } from "react"

const Featured: FC<{
  featured?: { recordings: Recording; programs: Program }
}> = ({ featured }) => {
  if (!featured) return null

  const description = featured.recordings.description?.trim()

  const { play } = usePlayer()
  const title = `${featured.programs.name} – ${featured.recordings.episodeTitle}`

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center gap-2 text-xl font-semibold uppercase">
        премьера{" "}
        <Image
          className="size-6"
          src="/assets/podcast.png"
          width={124}
          height={124}
          alt="podcast"
        />
      </div>
      <div
        onClick={() =>
          play({
            title,
            src: featured.recordings.fileUrl,
            isLive: false,
          })
        }
        className="w-full rounded-xl cursor-pointer border border-2 border-white/90 p-4 text-left sm:p-6 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none"
      >
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex min-w-0 flex-col gap-1 sm:gap-1.5">
            <span className="text-sm font-medium uppercase tracking-wide text-white/85 sm:text-base">
              {featured.programs.name}
            </span>
            <span className="text-balance text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
              {featured.recordings.episodeTitle}
            </span>
          </div>
          {description ? (
            <p className="max-w-3xl text-base leading-relaxed text-white/90 sm:text-lg lg:text-xl">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Featured
