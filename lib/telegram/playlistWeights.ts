import {
  azuracastStationNumericId,
  stationPlaylistApiUrl,
  stationPlaylistsApiUrl,
} from "@/lib/radioStation"

export const CALLBACK_UPDATE_WEIGHTS = "upd_pl_wt"

type RawPlaylist = {
  id?: number
  name?: string
  num_songs?: number | string
  weight?: number | string
}

export type PlaylistWeightRow = {
  id: number | null
  name: string
  n: number
  /** Weight stored in AzuraCast (normalized int or null if unknown). */
  currentWeight: number | null
  /** Recalculated target weight in 1–25. */
  newWeight: number
}

function playlistRows(data: unknown): RawPlaylist[] {
  if (Array.isArray(data)) return data
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>
    if (Array.isArray(o.results)) return o.results as RawPlaylist[]
    if (Array.isArray(o.items)) return o.items as RawPlaylist[]
  }
  return []
}

function trackCount(p: RawPlaylist): number {
  const n = p.num_songs
  const v = typeof n === "string" ? Number(n) : n
  return typeof v === "number" && Number.isFinite(v) ? Math.max(0, Math.floor(v)) : 0
}

function apiWeight(w: unknown): number | null {
  const v = typeof w === "string" ? Number(w) : w
  if (typeof v !== "number" || !Number.isFinite(v)) return null
  return Math.round(v)
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function azuracastHeaders(jsonBody: boolean): Headers {
  const headers = new Headers()
  const key = process.env.AZURACAST_API_KEY
  if (key) headers.set("X-API-Key", key)
  if (jsonBody) headers.set("Content-Type", "application/json")
  return headers
}

export async function fetchStationPlaylists(headers?: Headers): Promise<RawPlaylist[]> {
  const res = await fetch(stationPlaylistsApiUrl, {
    next: { revalidate: 0 },
    headers: headers ?? azuracastHeaders(false),
  })
  if (!res.ok) {
    throw new Error(`playlists api responded with ${res.status}`)
  }
  const data = await res.json()
  return playlistRows(data)
}

export function buildPlaylistWeightRows(playlists: RawPlaylist[]): PlaylistWeightRow[] {
  const rows: Omit<PlaylistWeightRow, "newWeight">[] = playlists.map((p) => ({
    id: typeof p.id === "number" && Number.isFinite(p.id) ? p.id : null,
    name: (p.name ?? "").trim() || "—",
    n: trackCount(p),
    currentWeight: apiWeight(p.weight),
  }))

  const maxCount = rows.reduce((m, r) => Math.max(m, r.n), 0)

  return rows.map((r) => {
    let newWeight: number
    if (rows.length === 0 || maxCount === 0) {
      newWeight = 1
    } else {
      const rounded = Math.round((25 * r.n) / maxCount)
      newWeight = Math.min(25, Math.max(1, rounded))
    }
    return { ...r, newWeight }
  })
}

export function anyWeightMismatch(rows: PlaylistWeightRow[]): boolean {
  if (rows.length === 0) return false
  const maxCount = rows.reduce((m, r) => Math.max(m, r.n), 0)
  if (maxCount === 0) return false

  return rows.some((r) => {
    if (r.id == null) return false
    if (r.currentWeight === null) return true
    return r.currentWeight !== r.newWeight
  })
}

export function formatPlaylistWeightsMessage(rows: PlaylistWeightRow[]): string {
  if (rows.length === 0) {
    return "список плейлистов пуст"
  }

  const maxCount = rows.reduce((m, r) => Math.max(m, r.n), 0)
  if (maxCount === 0) {
    return "не удалось посчитать веса: у всех плейлистов 0 треков (или нет поля num_songs)"
  }

  const lines = rows.map((r) => {
    const base = `${escapeHtml(r.name)} — ${r.n} тр., вес <b>${r.newWeight}</b>`
    if (r.currentWeight === null) return base
    if (r.currentWeight !== r.newWeight) {
      return `${base} <i>(сейчас: ${r.currentWeight})</i>`
    }
    return base
  })

  return [`макс. треков в плейлисте: ${maxCount}`, "", ...lines].join("\n")
}

async function readAzuracastError(res: Response): Promise<string> {
  try {
    const t = await res.text()
    if (!t) return ""
    const trimmed = t.trim()
    if (trimmed.length > 400) return `${trimmed.slice(0, 400)}…`
    return trimmed
  } catch {
    return ""
  }
}

async function putPlaylistWeight(playlistId: number, weight: number): Promise<void> {
  const url = stationPlaylistApiUrl(playlistId)

  /**
   * AzuraCast merges the JSON body into the existing row (`OBJECT_TO_POPULATE`).
   * Sending the full GET payload causes NotNormalizableValueException (enums, schedule_items, …).
   * Only `weight` is required to patch the field.
   */
  const putHeaders = azuracastHeaders(true)
  putHeaders.set("Accept", "application/json")
  const key = process.env.AZURACAST_API_KEY
  if (key) putHeaders.set("X-API-Key", key)

  const putRes = await fetch(url, {
    method: "PUT",
    next: { revalidate: 0 },
    headers: putHeaders,
    body: JSON.stringify({ weight }),
  })
  if (!putRes.ok) {
    const detail = await readAzuracastError(putRes)
    throw new Error(
      `PUT playlist ${playlistId} → ${putRes.status}${detail ? `: ${detail}` : ""}`
    )
  }
}

/** Applies recalculated weights to AzuraCast for every playlist where the stored weight differs (or is missing). */
export async function applyRecalculatedWeights(): Promise<string> {
  const playlists = await fetchStationPlaylists()
  const rows = buildPlaylistWeightRows(playlists)
  const maxCount = rows.reduce((m, r) => Math.max(m, r.n), 0)
  if (rows.length === 0) return "список плейлистов пуст"
  if (maxCount === 0) return "расчёт невозможен: у всех плейлистов 0 треков"

  const toUpdate = rows.filter(
    (r) => r.id != null && (r.currentWeight === null || r.currentWeight !== r.newWeight)
  )

  if (toUpdate.length === 0) {
    return "все веса уже совпадают с расчётом, менять нечего"
  }

  const errors: string[] = []
  for (const r of toUpdate) {
    try {
      await putPlaylistWeight(r.id!, r.newWeight)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      errors.push(`${r.name}: ${msg}`)
      console.error("playlist weight update failed:", r.id, e)
    }
  }

  const okCount = toUpdate.length - errors.length
  if (errors.length === 0) {
    return `готово: обновлены веса у <b>${okCount}</b> плейлистов (станция ${escapeHtml(azuracastStationNumericId)})`
  }
  return (
    `обновлено: ${okCount} из ${toUpdate.length}\n` +
    `ошибки:\n${errors.map((l) => escapeHtml(l)).join("\n")}`
  )
}
