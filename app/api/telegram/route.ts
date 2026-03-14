import { NextRequest, NextResponse } from "next/server"

const BOT_TOKEN = process.env.BOT_TOKEN!
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`
const NOWPLAYING_API = "https://server.radioznb.ru/api/nowplaying/radioznb-live"

async function getNowPlaying() {
  const res = await fetch(NOWPLAYING_API, { next: { revalidate: 0 } })
  if (!res.ok) throw new Error(`api responded with ${res.status}`)
  const data = await res.json()
  return {
    title: data.now_playing?.song?.title || null,
    artist: data.now_playing?.song?.artist || null,
    playlist: data.now_playing?.playlist || null,
  }
}

async function sendReply(chatId: number, messageId: number, text: string) {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      reply_to_message_id: messageId,
      text,
      parse_mode: "HTML",
    }),
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const message = body?.message

  if (!message?.text?.startsWith("/nowplaying")) {
    return NextResponse.json({ ok: true })
  }

  const chatId: number = message.chat.id
  const messageId: number = message.message_id

  try {
    const { title, artist, playlist } = await getNowPlaying()
    const text = generateNowPlayingText(title, artist, playlist)
    await sendReply(chatId, messageId, text)
  } catch (err) {
    console.error("failed to fetch now playing:", err)
    await sendReply(
      chatId,
      messageId,
      "не получилось вытащить информацию с сервера радио знб"
    )
  }

  return NextResponse.json({ ok: true })
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateNowPlayingText(title: string | null, artist: string | null, playlist: string | null): string {
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