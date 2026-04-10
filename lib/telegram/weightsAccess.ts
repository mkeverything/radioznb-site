/** Who may use `/weights` and the «Обновить веса» callback. */

export type TelegramUserRef = {
  id: number
  username?: string
  is_bot?: boolean
}

/**
 * Comma- or whitespace-separated entries (optional `@`).
 * Purely numeric tokens → user id; anything else → username (case-insensitive).
 *
 * Env (use either or both, merged):
 * - `TELEGRAM_WEIGHTS_ADMINS`
 * - `TELEGRAM_ADMINS`
 *
 * Example: `123456789 @alice bob`
 *
 * Note: если у человека в Telegram **нет @username**, по имени в списке он **не** совпадёт — добавьте его **числовой id**.
 */
function parseWeightsAdmins(raw: string | undefined): {
  ids: Set<number>
  usernames: Set<string>
} {
  const ids = new Set<number>()
  const usernames = new Set<string>()
  if (!raw?.trim()) return { ids, usernames }
  for (const part of raw.split(/[\s,]+/).map((p) => p.trim()).filter(Boolean)) {
    const t = part.replace(/^@/, "")
    if (/^\d+$/.test(t)) {
      ids.add(Number(t))
    } else if (t.length > 0) {
      usernames.add(t.toLowerCase())
    }
  }
  return { ids, usernames }
}

function mergedAdminsRaw(): string {
  return [process.env.TELEGRAM_WEIGHTS_ADMINS, process.env.TELEGRAM_ADMINS]
    .filter(Boolean)
    .join(" ")
    .trim()
}

let warnedEmptyConfig = false

export function canUseWeightsCommands(from: TelegramUserRef | undefined | null): boolean {
  if (!from || from.is_bot) return false

  const { ids: allowIds, usernames: allowNames } = parseWeightsAdmins(mergedAdminsRaw() || undefined)
  const configured = allowIds.size > 0 || allowNames.size > 0
  if (!configured) {
    if (!warnedEmptyConfig) {
      warnedEmptyConfig = true
      console.warn(
        "[telegram weightsAccess] TELEGRAM_WEIGHTS_ADMINS / TELEGRAM_ADMINS empty — /weights denied for everyone"
      )
    }
    return false
  }

  if (allowIds.has(from.id)) return true

  const uname = from.username?.toLowerCase()
  if (uname && allowNames.has(uname)) return true

  return false
}
