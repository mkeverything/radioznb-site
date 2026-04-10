import {
  answerCallbackQuery,
  sendChatMessage,
  sendReply,
  type InlineKeyboardMarkup,
} from "@/lib/telegram/client"
import { generateNowPlayingText, getNowPlaying } from "@/lib/telegram/nowplaying"
import {
  CALLBACK_UPDATE_WEIGHTS,
  anyWeightMismatch,
  applyRecalculatedWeights,
  buildPlaylistWeightRows,
  fetchStationPlaylists,
  formatPlaylistWeightsMessage,
} from "@/lib/telegram/playlistWeights"
import { canUseWeightsCommands } from "@/lib/telegram/weightsAccess"
import { NextRequest, NextResponse } from "next/server"

type TgUser = { id: number; username?: string; is_bot?: boolean }

function firstCommand(text: string | undefined): string | null {
  if (!text) return null
  const trimmed = text.trim()
  if (!trimmed.startsWith("/")) return null
  const first = trimmed.split(/\s+/)[0] ?? ""
  const cmd = first.split("@")[0]
  return cmd.toLowerCase()
}

function weightsInlineKeyboard(): InlineKeyboardMarkup {
  return {
    inline_keyboard: [[{ text: "Обновить веса", callback_data: CALLBACK_UPDATE_WEIGHTS }]],
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const callback = body?.callback_query as
    | {
        id: string
        data?: string
        from?: TgUser
        message?: { chat?: { id: number }; message_id?: number }
      }
    | undefined

  if (callback?.id) {
    if (callback.data === CALLBACK_UPDATE_WEIGHTS) {
      if (!canUseWeightsCommands(callback.from)) {
        await answerCallbackQuery(callback.id, "Нет доступа к обновлению весов.", true)
        return NextResponse.json({ ok: true })
      }
      const chatId = callback.message?.chat?.id
      await answerCallbackQuery(callback.id, "Обновляю…")
      if (chatId != null) {
        try {
          const summary = await applyRecalculatedWeights()
          await sendChatMessage(chatId, summary)
        } catch (err) {
          console.error("apply playlist weights:", err)
          await sendChatMessage(
            chatId,
            "не получилось обновить веса в AzuraCast (сеть или API-ключ)"
          )
        }
      }
    } else {
      await answerCallbackQuery(callback.id)
    }
    return NextResponse.json({ ok: true })
  }

  const message = body?.message
  const cmd = firstCommand(message?.text)

  if (cmd === "/nowplaying") {
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

  if (cmd === "/weights") {
    const chatId: number = message.chat.id
    const messageId: number = message.message_id
    const from = message.from as TgUser | undefined

    if (!canUseWeightsCommands(from)) {
      await sendReply(chatId, messageId, "нет доступа к команде /weights")
      return NextResponse.json({ ok: true })
    }

    try {
      const playlists = await fetchStationPlaylists()
      const rows = buildPlaylistWeightRows(playlists)
      const text = formatPlaylistWeightsMessage(rows)
      const keyboard = anyWeightMismatch(rows) ? weightsInlineKeyboard() : undefined
      await sendReply(chatId, messageId, text, keyboard)
    } catch (err) {
      console.error("failed to fetch playlist weights:", err)
      await sendReply(
        chatId,
        messageId,
        "не получилось загрузить плейлисты с AzuraCast (нужен API-ключ в окружении?)"
      )
    }

    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ ok: true })
}
