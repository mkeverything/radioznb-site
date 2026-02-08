"use client"

import Image from "next/image"
import LiveIndicator from "./LiveIndicator"
import { stream, usePlayer } from "./PlayerContext"
import WaveAnimation from "./Waves"
import useArchiveStream from "./hooks/useArchiveRecord"

const TapePlayer = () => {
  const {
    setSrc,
    isPlaying: playing,
    isLive,
    setIsLive,
    play,
    pause,
  } = usePlayer()
  const isPlayingLive = playing && isLive
  const isPlayingArchive = playing && !isLive
  const { src } = useArchiveStream()

  const onClick = () => {
    if (isPlayingLive) {
      pause()
      setSrc(src)
      setIsLive(false)
    } else play(stream)
  }

  return (
    <div
      className="relative w-xl sm:w-2xl"
      onDragStart={(e) => e.preventDefault()}
    >
      <WaveAnimation />
      <div className="relative h-full w-full">
        <div
          onClick={onClick}
          className="absolute inset-0 z-100 m-auto h-[80%] w-[60%] cursor-pointer"
        />
        <Image
          className="relative inset-0 z-10"
          src="/assets/tape-player/main.png"
          alt="player"
          width={1366}
          height={768}
          priority
        />
        <div className="absolute top-[17%] left-[26.5%] h-9 w-2.5 bg-white" />
        <div className="absolute top-[27%] right-[28%] h-2 w-16 bg-white" />
        <div className="absolute top-[24%] right-[28%] h-5 w-2 bg-white" />
        <Image
          className={`absolute top-0 -z-10 origin-[70%_28%] -rotate-12 transition-transform duration-700 ease-in-out max-sm:scale-x-75 ${isPlayingLive && "rotate-12"}`}
          src={"/assets/tape-player/antenna.png"}
          width={1366}
          height={768}
          alt="antenna"
        />
        <Image
          className="absolute inset-0 -z-20"
          src={`/assets/tape-player/fm-${isPlayingLive ? "on" : "off"}.png`}
          alt="fm"
          width={1366}
          height={768}
        />
        <LiveIndicator />
        <Image
          className={`absolute bottom-[33%] left-[42.5%] size-5 ${isPlayingArchive && "animate-spin"}`}
          src={"/assets/tape-player/gear-l.png"}
          width={1366}
          height={768}
          alt="gear-l"
        />
        <Image
          className={`absolute right-[41.5%] bottom-[33%] z-10 size-5 ${isPlayingArchive && "animate-spin"}`}
          src={"/assets/tape-player/gear-r.png"}
          width={1366}
          height={768}
          alt="gear-r"
        />
      </div>
    </div>
  )
}

export default TapePlayer
