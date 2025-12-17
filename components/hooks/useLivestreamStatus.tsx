import { useEffect, useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'

export const useLivestreamStatus = (): Livestream => {
	const [livestream, setLivestream] = useState(undefined)

	const ws = useWebSocket(
		'wss://server.radioznb.ru/api/live/nowplaying/websocket'
	)

	// Send subscription once connected
	useEffect(() => {
		if (ws.readyState === ReadyState.OPEN) {
			ws.sendJsonMessage({
				subs: { 'station:radioznb-live': { recover: true } },
			})
		}
	}, [ws, ws.readyState])

	// Fallback initial fetch
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					'https://server.radioznb.ru/api/nowplaying_static/radioznb-live.json'
				)
				if (!response.ok) throw new Error('Network response was not ok')
				const data = await response.json()
				setLivestream(data.live)
			} catch (err) {
				console.error('Fetch error:', err)
			}
		}
		fetchData()
	}, [])

	// Update livestream from websocket messages
	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const msg = ws.lastJsonMessage as any
		const live = msg?.pub?.data?.np?.live
		if (live && 'is_live' in live) {
			setLivestream((prev) =>
				JSON.stringify(prev) !== JSON.stringify(live) ? live : prev
			)
		}
	}, [ws.lastJsonMessage])

	return livestream
}

export type Livestream =
	| {
			art: string | null
			broadcast_start: number | null
			is_live: boolean
			streamer_name: string
	  }
	| undefined
