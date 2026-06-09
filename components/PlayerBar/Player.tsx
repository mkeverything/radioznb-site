"use client"

import { usePathname } from "next/navigation"
import { usePlayer } from "../PlayerContext"
import Controls from "./Controls"
import ProgressBar from "./ProgressBar"
import VolumeBar from "./VolumeBar"

const PlayerBar = () => {
  const pathname = usePathname()
  const { isLive, isPlayerBarVisible, isPlaying, src } = usePlayer()
  const isLibraryRoute = pathname === "/library" || pathname.startsWith("/library/")
  const shouldShow =
    src &&
    (isPlayerBarVisible ||
      (isLive && isPlaying) ||
      (!isLive && isLibraryRoute))

  if (!shouldShow) return null
  return (
    <div
      className={`fixed right-0 bottom-0 left-0 z-50 m-auto flex w-full justify-center overflow-visible bg-white invert dark:bg-black max-sm:pb-[max(0.5rem,env(safe-area-inset-bottom))]`}
    >
      <div className="relative flex h-20 w-full items-center gap-3 overflow-visible px-4 sm:gap-4 sm:px-8">
        <ProgressBar />
        {isLive && (
          <div className="flex shrink-0 self-center sm:hidden">
            <Controls liveOnly />
          </div>
        )}
        {isLive && (
          <VolumeBar className="hidden shrink-0 self-center sm:block" />
        )}
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
