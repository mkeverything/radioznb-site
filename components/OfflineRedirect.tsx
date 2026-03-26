"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

/**
 * When the SW serves a precached `/`, navigation does not "fail", so Serwist never
 * falls back to `/~offline` — users see an empty white home screen offline.
 * Send them to the offline page on mount (cold open / flight mode).
 */
export function OfflineRedirect() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (pathname !== "/") return
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      router.replace("/~offline")
    }
  }, [pathname, router])

  return null
}
