"use client"

import Image from "next/image"
import LiveIndicator from "./LiveIndicator"
import { stream, usePlayer } from "./PlayerContext"
import WaveAnimation from "./Waves"
import useArchiveStream from "./hooks/useArchiveRecord"

const TapePlayer = () => {
  const { setSrc, isPlaying, isLive, setIsLive, play, pause, readyState } =
    usePlayer()
  const isPlayingLive = isPlaying && isLive
  const isPlayingArchive = isPlaying && !isLive
  const { src } = useArchiveStream()

  const onClick = () => {
    if (isPlayingLive && readyState < 3) {
      void play(stream)
      return
    }
    if (isPlaying && readyState < 3) return
    if (isPlayingLive) {
      pause()
      setSrc(src)
      setIsLive(false)
    } else play(stream)
  }

  return (
    <div
      className="relative min-w-md sm:w-2xl"
      onDragStart={(e) => e.preventDefault()}
    >
      <WaveAnimation />
      <div className="relative h-full w-full">
        <button
          onClick={onClick}
          className="peer absolute z-100 m-auto h-[80%] w-[60%] cursor-pointer max-sm:inset-0 sm:top-20 sm:left-44 sm:h-[20%] sm:w-[15%]"
        />
        <Image
          className="relative inset-0 z-10"
          src="/assets/tape-player/main.png"
          alt="player"
          width={1366}
          height={768}
          loading="eager"
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
          loading="eager"
        />
        <Image
          className="absolute inset-0 -z-20 origin-bottom duration-100 peer-hover:scale-[1.01] peer-focus:scale-[1.01]"
          src={`/assets/tape-player/fm-${isPlayingLive ? "on" : "off"}.png`}
          alt="fm"
          width={1366}
          height={768}
          loading="eager"
        />
        <LiveIndicator />
        <Image
          className={`absolute bottom-[33%] left-[42.5%] z-10 size-5 ${isPlayingArchive && "animate-spin"}`}
          src={"/assets/tape-player/gear-l.png"}
          width={1366}
          height={768}
          alt="gear-l"
          loading="eager"
        />
        <Image
          className={`absolute right-[41.5%] bottom-[33%] z-10 size-5 ${isPlayingArchive && "animate-spin"}`}
          src={"/assets/tape-player/gear-r.png"}
          width={1366}
          height={768}
          alt="gear-r"
          loading="eager"
        />
      </div>
    </div>
  )
}

export default TapePlayer
