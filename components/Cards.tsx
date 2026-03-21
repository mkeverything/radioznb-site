import Image from "next/image"
import { FC, HTMLAttributes, PropsWithChildren, useMemo } from "react"

export const RecordSquare: FC<
  {
    className?: string
    squareVariant?: number
    type?: "live" | "podcast"
  } & PropsWithChildren &
    HTMLAttributes<HTMLDivElement>
> = ({ className, children, squareVariant, type, ...props }) => {
  const src = useMemo(
    () =>
      squareVariant
        ? SQUARES[Math.min(squareVariant, SQUARES.length - 1)]
        : getRandomAsset(SQUARES),
    [squareVariant],
  )
  return (
    <div
      className={`relative flex aspect-square max-sm:p-6 p-12 lg:p-6 text-xs text-wrap whitespace-break-spaces text-black sm:text-sm md:text-base ${className}`}
      {...props}
    >
      <Image
        className="absolute inset-0 z-0"
        src={src}
        width={553}
        height={516}
        alt={"square"}
      />
      {type === "podcast" && (
        <Image
          className="absolute top-2 right-2 z-20 m-4 size-4 mix-blend-difference sm:size-6"
          src="/assets/podcast.png"
          width={124}
          height={124}
          alt="podcast"
        />
      )}
      <div className="flex size-full drop-shadow-[0_0_1px_white]">
        {children}
      </div>
    </div>
  )
}

export const ProgramCircle: FC<
  { className?: string; circleVariant?: number } & PropsWithChildren &
    HTMLAttributes<HTMLDivElement>
> = ({ className, children, circleVariant, ...props }) => {
  const src = useMemo(
    () =>
      circleVariant
        ? CIRCLES[Math.min(circleVariant, CIRCLES.length - 1)]
        : getRandomAsset(CIRCLES),
    [circleVariant],
  )
  return (
    <div
      className={`relative aspect-square size-28 p-2 text-wrap whitespace-break-spaces text-black sm:size-32 sm:text-lg ${className}`}
      {...props}
    >
      <Image
        className="absolute inset-0 z-0"
        src={src}
        width={1215}
        height={1254}
        alt={"circle"}
      />
      <div className="absolute inset-0 z-10 m-auto flex size-fit h-fit items-center justify-center px-2 drop-shadow-[0_0_0.75px_rgba(0,0,0,0)]">
        {children}
      </div>
    </div>
  )
}

const getRandomAsset = (assets: string[]) =>
  assets[Math.floor(Math.random() * assets.length)]

const SQUARES = [
  "/assets/square-1.png",
  "/assets/square-2.png",
  "/assets/square-3.png",
  "/assets/square-4.png",
]

const CIRCLES = [
  "/assets/circle-1.png",
  "/assets/circle-2.png",
  "/assets/circle-3.png",
]
