"use client"

import Controls from "./Controls"
import { usePlayer } from "../PlayerContext"
import ProgressBar from "./ProgressBar"
import VolumeBar from "./VolumeBar"

const PlayerBar = () => {
  const { src } = usePlayer()

  if (!src) return null
  return (
    <div
      className={`fixed right-0 bottom-0 left-0 z-50 m-auto flex w-full justify-center bg-white invert transition-all duration-300 dark:bg-black`}
    >
      <div className="relative flex w-full min-h-8 items-stretch gap-2 px-4 py-2 max-sm:flex-col-reverse sm:min-h-10 sm:items-center sm:gap-3 sm:px-8">
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
