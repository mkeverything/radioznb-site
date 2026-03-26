import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Нет сети",
  description:
    "Нет подключения к интернету. Подключись к сети и обнови страницу.",
}

export default function OfflinePage() {
  return (
    <main
      className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-6 rounded-lg px-4 py-10 text-center text-neutral-900 shadow-sm dark:bg-white dark:text-neutral-900"
      style={{
        color: "#171717",
        backgroundColor: "#ffffff",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- must work offline without /_next/image */}
      <img
        src="/assets/RADIO.png"
        alt=""
        width={160}
        height={160}
        className="ignore-invert h-auto w-40"
        decoding="async"
      />
      <h1 className="text-xl font-medium">Нет сети</h1>
      <p className="max-w-sm text-sm leading-relaxed opacity-90">
        Подключись к интернету (Wi‑Fi или мобильная сеть), затем обнови страницу
        или вернись на главную, когда связь восстановится.
      </p>
      <Link
        href="/"
        className="text-sm font-medium text-neutral-900 underline underline-offset-4 hover:opacity-80"
        style={{ color: "#171717" }}
      >
        На главную
      </Link>
    </main>
  )
}
