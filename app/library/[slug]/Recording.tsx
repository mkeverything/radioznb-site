"use client"

import { Stream } from "@/components/PlayerContext"
import { Program, Recording } from "@/db/types"
import { getRecordingSeasonEpisodeString } from "@/helpers"

export default function RecordingComponent({
  rec,
  play,
}: {
  rec: { recordings: Recording; programs: Program | null }
  play: (props: Stream) => void
}) {
  if (!rec.recordings.fileUrl) return null
  return (
    <button
      key={rec.recordings.id}
      onClick={() => {
        play({
          title: `${rec.programs?.name} – ${rec.recordings.episodeTitle}`,
          src: rec.recordings.fileUrl,
          isLive: false,
        })
      }}
      className="flex w-full min-w-0 flex-col gap-1 text-left text-lg hover:underline sm:flex-row sm:items-end sm:gap-4 sm:text-right sm:text-2xl"
    >
      <span className="shrink-0 text-xs opacity-70 sm:pb-1 sm:text-sm">
        {getRecordingSeasonEpisodeString(rec.recordings)}
      </span>
      <span className="min-w-0 break-words">{rec.recordings.episodeTitle}</span>
    </button>
  )
}
