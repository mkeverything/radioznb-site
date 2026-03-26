import HomeButton from "@/components/HomeButton"
import { stationRestUrl } from "@/lib/radioStation"
import Image from "next/image"
import Link from "next/link"

const Page = async () => {
  const request = await fetch(
    stationRestUrl,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_RADIOZNB_API_KEY}`,
      },
    },
  )
  const data = await request.json()

  return (
    <div className="flex w-full flex-col">
      <HomeButton />
      <div className="flex flex-col items-center">
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
    </div>
  )
}

export default Page
