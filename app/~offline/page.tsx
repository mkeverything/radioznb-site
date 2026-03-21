import Link from "next/link"

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-md flex-col justify-center gap-6 text-center">
      <h1 className="text-xl font-medium">Нет сети</h1>
      <p className="text-sm opacity-80">
        Подключись к интернету и обнови страницу — или открой то, что уже было
        сохранено.
      </p>
      <Link
        href="/"
        className="text-sm underline underline-offset-4 hover:opacity-80"
      >
        На главную
      </Link>
    </main>
  )
}
