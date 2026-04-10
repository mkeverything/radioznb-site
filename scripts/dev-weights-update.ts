/**
 * Dev helper: preview or apply AzuraCast playlist weights (same logic as Telegram /weights + «Обновить веса»).
 *
 *   bun run dev:weights              — fetch, show current → calculated, no PUT
 *   bun run dev:weights -- --apply   — write weights via API (needs AZURACAST_API_KEY)
 */
import { config } from "dotenv"
import { resolve } from "node:path"

config({ path: resolve(process.cwd(), ".env") })
config({ path: resolve(process.cwd(), ".env.local"), override: true })

import {
  anyWeightMismatch,
  applyRecalculatedWeights,
  buildPlaylistWeightRows,
  fetchStationPlaylists,
} from "@/lib/telegram/playlistWeights"

const apply = process.argv.includes("--apply")

async function main() {
  if (!apply) {
    const playlists = await fetchStationPlaylists()
    const rows = buildPlaylistWeightRows(playlists)
    const maxCount = rows.reduce((m, r) => Math.max(m, r.n), 0)

    if (rows.length === 0) {
      console.log("список плейлистов пуст")
      process.exit(0)
    }

    if (maxCount === 0) {
      console.log("нет треков (maxCount=0), расчёт весов невозможен")
      process.exit(1)
    }

    console.log(`макс. треков в плейлисте: ${maxCount}\n`)
    for (const r of rows) {
      const cur = r.currentWeight == null ? "?" : String(r.currentWeight)
      const mark = r.currentWeight != null && r.currentWeight !== r.newWeight ? " ≠" : ""
      const idPart = r.id != null ? `id=${r.id}` : "no id"
      console.log(`[${idPart}] ${r.name}: ${r.n} тр. | AzuraCast ${cur} → расчёт ${r.newWeight}${mark}`)
    }
    console.log("")
    console.log(
      anyWeightMismatch(rows)
        ? "Есть отличия от AzuraCast. Чтобы записать: bun run dev:weights -- --apply"
        : "Все веса совпадают с расчётом."
    )
    return
  }

  const summary = await applyRecalculatedWeights()
  // strip simple HTML tags for terminal readability
  console.log(summary.replace(/<\/?b>/g, "").replace(/<\/?i>/g, ""))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
