import Image from "next/image"
import { FC, HTMLAttributes, PropsWithChildren } from "react"

export const RecordSquare: FC<
  { className?: string; squareVariant?: number } & PropsWithChildren &
    HTMLAttributes<HTMLDivElement>
> = ({ className, children, squareVariant, ...props }) => {
  const src = squareVariant
    ? SQUARES[Math.min(squareVariant, SQUARES.length - 1)]
    : getRandomAsset(SQUARES)
  return (
    <div
      className={`relative aspect-square p-4 text-sm text-wrap whitespace-break-spaces text-black sm:text-[16px] ${className}`}
      {...props}
    >
      <Image
        className="absolute inset-0 z-0"
        src={src}
        width={1215}
        height={1254}
        alt={"square"}
      />
      <div className="drop-shadow-[0_0_1px_white] sm:p-2">{children}</div>
    </div>
  )
}

export const ProgramCircle: FC<
  { className?: string; circleVariant?: number } & PropsWithChildren &
    HTMLAttributes<HTMLDivElement>
> = ({ className, children, circleVariant, ...props }) => {
  const src = circleVariant
    ? CIRCLES[Math.min(circleVariant, CIRCLES.length - 1)]
    : getRandomAsset(CIRCLES)
  return (
    <div
      className={`relative aspect-square size-28 p-2 text-[15px] text-wrap whitespace-break-spaces text-black ${className}`}
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
