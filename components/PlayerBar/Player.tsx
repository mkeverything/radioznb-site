"use client"

import { usePathname } from "next/navigation"
import Controls from "./Controls"
import { usePlayer } from "../PlayerContext"
import ProgressBar from "./ProgressBar"
import VolumeBar from "./VolumeBar"

const PlayerBar = () => {
  const { src, isLive } = usePlayer()
  const pathname = usePathname()

  if (!src) return null
  if (pathname === "/" && isLive)
    return <VolumeBar className="fixed right-8 bottom-8" />
  return (
    <div
      className={`fixed right-0 bottom-0 left-0 z-50 m-auto flex w-full justify-center bg-white invert transition-all duration-300 dark:bg-black`}
    >
      <div className="sm relative flex h-full w-full items-start p-4 pt-2 max-sm:flex-col-reverse sm:items-center sm:gap-4 sm:px-8">
        <Controls />
        <ProgressBar />
        <VolumeBar />
      </div>
    </div>
  )
}

export const formatTime = (time: number): string => {
  if (isNaN(time) || time < 0) return "00:00"

  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time % 3600) / 60)
  const seconds = Math.floor(time % 60)

  if (hours > 0) {
    return [hours, minutes, seconds]
      .map((v) => String(v).padStart(2, "0"))
      .join(":")
  } else {
    return [minutes, seconds].map((v) => String(v).padStart(2, "0")).join(":")
  }
}

export default PlayerBar
