/** Who may use `/weights` and the «Обновить веса» callback. */

export type TelegramUserRef = {
  id: number
  username?: string
  is_bot?: boolean
}

/**
 * `TELEGRAM_WEIGHTS_ADMINS` — comma- or whitespace-separated entries.
 * Purely numeric tokens → user id; anything else → username (optional `@`, case-insensitive).
 *
 * Example: `123456789 @alice bob`
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

const { ids: WEIGHTS_ACCESS_USER_IDS, usernames: WEIGHTS_ACCESS_USERNAMES } =
  parseWeightsAdmins(process.env.TELEGRAM_ADMINS)

let warnedEmptyConfig = false

export function canUseWeightsCommands(from: TelegramUserRef | undefined | null): boolean {
  if (!from || from.is_bot) return false

  const configured =
    WEIGHTS_ACCESS_USER_IDS.size > 0 || WEIGHTS_ACCESS_USERNAMES.size > 0
  if (!configured) {
    if (!warnedEmptyConfig) {
      warnedEmptyConfig = true
      console.warn(
        "[telegram weightsAccess] TELEGRAM_WEIGHTS_ADMINS is empty — /weights is denied for everyone"
      )
    }
    return false
  }

  if (WEIGHTS_ACCESS_USER_IDS.has(from.id)) return true

  const uname = from.username?.toLowerCase()
  if (uname && WEIGHTS_ACCESS_USERNAMES.has(uname)) return true

  return false
}
