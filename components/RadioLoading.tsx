"use client"

import Image from "next/image"
import React from "react"
import { createPortal } from "react-dom"

const RadioLoading = ({ label }: { label?: string }) => {
  return (
    <div className="mt-[25vh] flex size-full grow items-center justify-center gap-3 brightness-200 saturate-0">
      <Image
        src="/assets/live-animation.gif"
        alt="loading"
        width={107}
        height={107}
        className="size-20"
      />
      <span className="text-sm tracking-widest uppercase opacity-70">
        {label}
      </span>
    </div>
  )
}

export default RadioLoading
