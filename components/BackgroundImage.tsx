"use client"

import { usePathname } from "next/navigation"

export const BackgroundImage = () => {
  const pathname = usePathname()
  if (pathname?.startsWith("/~offline")) return null

  return (
    <div
      className={`dark:bg-[url('/assets/bg_animation.gif')] bg-white fixed inset-0 -z-50 bg-cover bg-center`}
    />
  )
}
