import { Recording } from "@/db/types"

export const getRecordingSeasonEpisodeString = (
  recording: Recording,
): string | null => {
  const season = recording.seasonNumber
  const episode = recording.episodeNumber
  const seasonNum =
    season != null && Number.isFinite(Number(season)) ? Number(season) : null
  const episodeNum =
    episode != null && Number.isFinite(Number(episode)) ? Number(episode) : null
  if (seasonNum === null && episodeNum !== null) return `e${episodeNum}`
  if (seasonNum === null || episodeNum === null) return null
  return `s${seasonNum}e${episodeNum}`
}
