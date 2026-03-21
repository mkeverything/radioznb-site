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
      className="flex gap-4 text-right text-2xl hover:underline"
    >
      <span className="flex items-end pb-1 text-sm">
        {getSeasonEpisode(rec.recordings)}
      </span>
      {rec.recordings.episodeTitle}
    </button>
  )
}

const getSeasonEpisode = (recording: Recording) => {
  if (!recording.episodeNumber) return null
  if (!recording.seasonNumber) return `${recording.episodeNumber}.`
  return `${recording.seasonNumber}.${recording.episodeNumber}.`
}
