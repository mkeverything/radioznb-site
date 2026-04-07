import HomeButton from "@/components/HomeButton"
import { stationRestUrl } from "@/lib/radioStation"
import packageJson from "@/package.json"
import Image from "next/image"
import Link from "next/link"

const Page = async () => {
  const request = await fetch(stationRestUrl, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_RADIOZNB_API_KEY}`,
    },
  })
  const data = await request.json()

  return (
    <div className="flex min-h-screen flex-col">
      <HomeButton />
      <div className="flex flex-1 flex-col items-center">
        <p className="max-w-lg p-4 text-xl text-pretty sm:p-12">
          {data.description}
        </p>
        <Link href="https://t.me/radi0ZnB">
          <Image
            className="size-24 transition-all hover:scale-105"
            width={166}
            height={150}
            src="/assets/tg.png"
            alt="telegram"
          />
        </Link>
      </div>

      <div className="flex flex-col items-end text-right text-xs opacity-10 mb-4">
        <p>{packageJson.version}</p>
        <p>
          <Link
            href="https://mkeverything.ru"
            className="underline underline-offset-2 hover:opacity-100"
            target="_blank"
            rel="noopener noreferrer"
          >
            mkeverything
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Page
