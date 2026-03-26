/** AzuraCast public origin (no trailing slash). */
export const AZURACAST_ORIGIN = "https://server.radioznb.ru" as const
const PROD = true

const wsOrigin = AZURACAST_ORIGIN.replace(/^https/, "wss")
export const nowplayingWebSocketUrl = `${wsOrigin}/api/live/nowplaying/websocket`

/**
 * Station shortcode — single switch between `radioznb-live` and `radioznb-soundchecks`.
 * Override per deploy: `NEXT_PUBLIC_RADIOZNB_STATION_SHORTCODE=radioznb-live`
 */
export const STATION_SHORTCODE = PROD ? "radioznb-live" : "radioznb-soundchecks"

export const listenUrl = `${AZURACAST_ORIGIN}/listen/${STATION_SHORTCODE}/radio.mp3`
export const nowplayingStaticUrl = `${AZURACAST_ORIGIN}/api/nowplaying_static/${STATION_SHORTCODE}.json`
export const nowplayingApiUrl = `${AZURACAST_ORIGIN}/api/nowplaying/${STATION_SHORTCODE}`
export const stationRestUrl = `${AZURACAST_ORIGIN}/api/station/${STATION_SHORTCODE}`

/** WebSocket subscription key for Centrifugo / now-playing feed. */
export const wsStationChannel = `station:${STATION_SHORTCODE}`
