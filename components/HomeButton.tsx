"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

const HomeButton = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    )

    const el = document.createElement("div")
    el.style.position = "absolute"
    el.style.top = "20px"
    el.style.height = "1px"

    document.body.prepend(el)
    observer.observe(el)

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div className="pointer-events-none h-20 shrink-0" aria-hidden />
      <Link
        href="/"
        className={`fixed top-4 left-4 z-50 flex size-20 items-center justify-center rounded-2xl transition-colors duration-500 sm:left-8 ${
          scrolled ? "bg-stone-900" : "bg-transparent"
        }`}
      >
        <Image
          src="/assets/logo.png"
          className={`size-full ${scrolled ? "invert" : ""}`}
          height={640}
          width={640}
          alt="logo"
        />
      </Link>
    </>
  )
}

export default HomeButton
