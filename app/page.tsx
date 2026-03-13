"use client"

import TapePlayer from "@/components/TapePlayer"
import Image from "next/image"
import Link from "next/link"
import { FC } from "react"

export default function Home() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <Desktop className="max-sm:hidden" />
      <Mobile className="sm:hidden" />
      <div className="fixed inset-0">
        <div className="masked masked-transformed" />
        <Image
          src={"/assets/table.png"}
          className="masked-transformed fixed right-0 bottom-0 left-0 size-full max-w-screen object-cover mix-blend-multiply"
          height={5906}
          width={5906}
          alt="table"
        />
      </div>
    </div>
  )
}

const Desktop: FC<{ className: string }> = ({ className }) => {
  return (
    <div className={`relative flex w-full ${className}`}>
      <Link
        href={"/about"}
        className="absolute top-1/2 left-8 z-15 max-sm:w-1/3"
      >
        <Image
          src={"/assets/about-us.png"}
          className="h-64 w-auto transition hover:scale-105"
          height={5906}
          width={5906}
          alt="about-us"
        />
      </Link>
      <div className="flex w-full justify-center">
        <TapePlayer />
      </div>
      <Link
        href={"/library"}
        className="absolute top-1/4 -right-8 z-15 max-sm:w-1/3"
      >
        <Image
          src={"/assets/tapes.png"}
          className="h-108 w-auto transition hover:scale-105"
          height={5906}
          width={5906}
          alt="tapes"
        />
      </Link>
    </div>
  )
}

const Mobile: FC<{ className: string }> = ({ className }) => {
  return (
    <div className={`relative flex h-full w-full flex-col ${className}`}>
      <div className="absolute inset-x-0 top-12 flex items-start justify-between gap-3 px-4">
        <Link href={"/about"} className="w-[42%] max-w-42.5">
          <Image
            src={"/assets/about-us-mobile.png"}
            className="h-auto w-full transition hover:scale-105"
            height={1816}
            width={2762}
            alt="about-us"
          />
        </Link>
        <Link href={"/library"} className="mt-24 w-[50%] max-w-55">
          <Image
            src={"/assets/tapes-mobile.png"}
            className="h-auto w-full transition hover:scale-105"
            height={3107}
            width={3734}
            alt="tapes"
          />
        </Link>
      </div>
      <div className="absolute bottom-14 -left-[36%] mt-16 flex w-[175%] justify-center">
        <TapePlayer />
      </div>
    </div>
  )
}
