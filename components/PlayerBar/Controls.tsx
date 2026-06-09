import Image from "next/image"
import { stream, usePlayer } from "../PlayerContext"

type ControlsProps = {
  liveOnly?: boolean
}

const Controls = ({ liveOnly = false }: ControlsProps) => {
  const { isPlaying, toggle, isLive, play, livestream } = usePlayer()
  const icon = isPlaying ? "pause" : "play"

  if (liveOnly || isLive) {
    return (
      <button onClick={toggle} className="size-5">
        <Image
          className="h-full w-full"
          width={354}
          height={354}
          src={`/assets/${icon}-sm.png`}
          alt="play"
        />
      </button>
    )
  }

  return (
    <div className="flex shrink-0 items-center gap-2 max-sm:flex-row-reverse sm:gap-2.5">
      <button onClick={toggle} className="size-5">
        <Image
          className="h-full w-full"
          width={354}
          height={354}
          src={`/assets/${icon}-sm.png`}
          alt="play"
        />
      </button>
      {livestream?.is_live && (
        <button
          className="size-8 p-1"
          onClick={() => play(stream)}
          title={`в эфире ${livestream.streamer_name}!`}
        >
          <Image
            className="ignore-invert invert"
            src={"/assets/live-animation.gif"}
            width={107}
            height={107}
            alt="live"
          />
        </button>
      )}
    </div>
  )
}

export default Controls
