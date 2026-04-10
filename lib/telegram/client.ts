type TelegramApiResponse = { ok: boolean; description?: string }

function telegramApiBaseUrl(): string | null {
  const t = process.env.BOT_TOKEN?.trim()
  return t ? `https://api.telegram.org/bot${t}` : null
}

export type InlineKeyboardMarkup = {
  inline_keyboard: { text: string; callback_data: string }[][]
}

async function sendMessagePayload(payload: Record<string, unknown>): Promise<TelegramApiResponse> {
  const base = telegramApiBaseUrl()
  if (!base) {
    console.error("[telegram] BOT_TOKEN is missing or empty — cannot call sendMessage")
    return { ok: false, description: "BOT_TOKEN missing" }
  }

  const res = await fetch(`${base}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const data = (await res.json()) as TelegramApiResponse
  if (!data.ok) {
    console.error("telegram sendMessage failed:", data.description ?? res.status)
  }
  return data
}

export async function answerCallbackQuery(callbackQueryId: string, text?: string, showAlert = false) {
  const base = telegramApiBaseUrl()
  if (!base) {
    console.error("[telegram] BOT_TOKEN is missing or empty — cannot answerCallbackQuery")
    return
  }
  await fetch(`${base}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      text,
      show_alert: showAlert,
    }),
  })
}

export async function sendChatMessage(chatId: number, text: string, parseMode: "HTML" | undefined = "HTML") {
  const payload: Record<string, unknown> = { chat_id: chatId, text }
  if (parseMode) payload.parse_mode = parseMode
  await sendMessagePayload(payload)
}

/** Sends as a reply thread when possible; falls back to a plain message if that message id does not exist in the chat (e.g. fake curl payloads). */
export async function sendReply(
  chatId: number,
  messageId: number,
  text: string,
  replyMarkup?: InlineKeyboardMarkup
) {
  const basePayload: Record<string, unknown> = {
    chat_id: chatId,
    reply_to_message_id: messageId,
    text,
    parse_mode: "HTML",
  }
  if (replyMarkup) basePayload.reply_markup = replyMarkup

  const withReply = await sendMessagePayload(basePayload)

  if (withReply.ok) return

  const desc = (withReply.description ?? "").toLowerCase()
  const replyBroken =
    desc.includes("reply") ||
    desc.includes("message to be replied") ||
    desc.includes("message identifier")

  if (replyBroken) {
    const plainPayload: Record<string, unknown> = {
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    }
    if (replyMarkup) plainPayload.reply_markup = replyMarkup
    const plain = await sendMessagePayload(plainPayload)
    if (!plain.ok) {
      console.error("telegram sendMessage (no reply_to) also failed:", plain.description)
    }
    return
  }
}
