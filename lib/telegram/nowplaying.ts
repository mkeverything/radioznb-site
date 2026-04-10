import { nowplayingApiUrl } from "@/lib/radioStation"

export async function getNowPlaying() {
  const res = await fetch(nowplayingApiUrl, { next: { revalidate: 0 } })
  if (!res.ok) throw new Error(`api responded with ${res.status}`)
  const data = await res.json()
  return {
    title: data.now_playing?.song?.title || null,
    artist: data.now_playing?.song?.artist || null,
    playlist: data.now_playing?.playlist || null,
  }
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateNowPlayingText(
  title: string | null,
  artist: string | null,
  playlist: string | null
): string {
  const hasTrack = title || artist
  const hasPlaylist = !!playlist

  if (!hasTrack && !hasPlaylist) return generateNoInfo()
  if (hasTrack && hasPlaylist) return generateFull(title, artist, playlist!)
  if (hasTrack) return generateTrackOnly(title, artist)
  return generatePlaylistOnly(playlist!)
}

function generateNoInfo(): string {
  return pick([
    "сейчас ничего не играет, или данные недоступны",
    "информация о треке пока недоступна",
    "не удалось получить данные о текущем треке",
    "то ли эфир молчит, то ли данные не пришли",
    "нет данных о том, что сейчас играет",
    "трек неизвестен, данные не получены",
    "информация о треке не пришла",
    "данные о текущем треке отсутствуют",
    "не знаю, что сейчас в эфире",
  ])
}

function generateTrackOnly(title: string | null, artist: string | null): string {
  const track = formatTrack(title, artist)
  return pick([
    `сейчас играет ${track}`,
    `на радио знб играет ${track}`,
    `в эфире ${track}`,
    `сейчас в эфире ${track}`,
    `играет ${track}`,
    `${track} — сейчас на радио знб`,
    `в данный момент играет ${track}`,
    `${track} — это то, что сейчас в эфире`,
    `на волнах знб: ${track}`,
    `эфир: ${track}`,
  ])
}

function generatePlaylistOnly(playlist: string): string {
  return pick([
    `сейчас играет плейлист "${playlist}"`,
    `в эфире плейлист "${playlist}"`,
    `на радио знб идёт "${playlist}"`,
    `играет "${playlist}"`,
    `сейчас в эфире "${playlist}"`,
    `плейлист "${playlist}" — сейчас на радио знб`,
    `эфир: плейлист "${playlist}"`,
    `на волнах знб: "${playlist}"`,
    `вы слушаете плейлист "${playlist}"`,
  ])
}

function generateFull(title: string | null, artist: string | null, playlist: string): string {
  const track = formatTrack(title, artist)
  return pick([
    `сейчас играет "${playlist}". трек ${track}`,
    `играет ${track}. плейлист "${playlist}"`,
    `на радио знб играет ${track}`,
    `в эфире "${playlist}"! песня ${track}`,
    `сейчас в эфире ${track}. плейлист "${playlist}"`,
    `на радио знб играет "${playlist}". песня ${track}`,
    `сейчас в эфире ${track} из плейлиста "${playlist}"`,
    `${track}. плейлист "${playlist}"`,
    `эфир: ${track} — из "${playlist}"`,
    `на волнах знб: ${track}. плейлист "${playlist}"`,
  ])
}

function formatTrack(title: string | null, artist: string | null): string {
  if (title && artist) return `<b>${artist}</b> — ${title}`
  if (artist) return `<b>${artist}</b>`
  if (title) return title
  return "неизвестный трек"
}
