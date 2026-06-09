"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function OfflineOnlineRedirect() {
  const router = useRouter()

  useEffect(() => {
    const goHome = () => router.replace("/")

    if (navigator.onLine) {
      goHome()
      return
    }

    window.addEventListener("online", goHome)
    return () => window.removeEventListener("online", goHome)
  }, [router])

  return null
}
