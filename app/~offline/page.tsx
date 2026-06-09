import { OfflineOnlineRedirect } from "./OfflineOnlineRedirect"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Нет сети",
  description: "Нет подключения к интернету.",
}

export default function OfflinePage() {
  return (
    <>
      <OfflineOnlineRedirect />
      <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-4 px-4 py-10 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element -- must work offline without /_next/image */}
        <img
          src="/assets/logo.png"
          alt="радио зимы не будет"
          width={160}
          height={160}
          className="ignore-invert h-auto w-40"
          decoding="async"
        />
        <p className="text-sm opacity-70">Нет подключения к интернету</p>
      </main>
    </>
  )
}
