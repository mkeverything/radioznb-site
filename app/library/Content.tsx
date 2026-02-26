"use client"

import { ProgramCircle } from "@/components/Cards"
import { getPrograms, getRandomRecording } from "@/lib/actions"
import { usePlayer } from "@/components/PlayerContext"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import NewRecordings from "./NewRecordings"
import Featured from "./Featured"
import Image from "next/image"

const PageContent = () => {
  const {
    data: programs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["programs"],
    queryFn: getPrograms,
  })

  const router = useRouter()
  const { play } = usePlayer()

  const handleShuffle = async () => {
    const random = await getRandomRecording()
    if (random?.recordings) {
      play({
        src: random.recordings.fileUrl,
        title: random.recordings.episodeTitle,
        isLive: false,
      })
    }
  }

  if (isLoading) return <div>loading...</div>
  if (isError || !programs || !programs) return <div>error</div>

  return (
    <div className={`flex flex-col gap-4`}>
      <Featured />
      <span className="text-xl font-semibold">новые выпуски</span>
      <NewRecordings />
      <div className="flex items-center gap-2">
        <span className="text-xl font-semibold">все передачи</span>
        <button onClick={handleShuffle} title="random">
          <Image
            src="/assets/shuffle.png"
            alt="shuffle"
            width={24}
            height={24}
            className="size-5"
          />
        </button>
      </div>
      <div className="grid w-full grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
        {programs.data?.map(({ programs: { id, name, slug } }) => (
          <button
            key={id}
            onClick={() => router.push(`/library/${slug}`)}
            className={`hover:underline`}
          >
            <ProgramCircle className="flex items-center justify-center rounded-full font-bold">
              {name}
            </ProgramCircle>
          </button>
        ))}
      </div>
    </div>
  )
}

export default PageContent
