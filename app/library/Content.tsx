"use client"

import { ProgramCircle } from "@/components/Cards"
import { usePlayer } from "@/components/PlayerContext"
import RadioLoading from "@/components/RadioLoading"
import {
  getFeaturedPodcast,
  getNewRecordings,
  getPrograms,
  getRandomRecording,
} from "@/lib/actions"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Featured from "./Featured"
import NewRecordings from "./NewRecordings"

const PageContent = () => {
  const {
    data: programs,
    isLoading: isLoadingPrograms,
    isError,
  } = useQuery({
    queryKey: ["programs"],
    queryFn: getPrograms,
  })
  const { data: newRecordings, isLoading: isLoadingRecordings } = useQuery({
    queryKey: ["newRecordings"],
    queryFn: getNewRecordings,
  })
  const { data: featured, isLoading: isLoadingFeatured } = useQuery({
    queryKey: ["featuredPodcast"],
    queryFn: getFeaturedPodcast,
  })

  const router = useRouter()
  const { play } = usePlayer()

  const handleShuffle = async () => {
    const random = await getRandomRecording()
    if (random?.recordings) {
      const programName = random.programs?.name
      const title = programName
        ? `${programName} – ${random.recordings.episodeTitle}`
        : random.recordings.episodeTitle

      play({
        src: random.recordings.fileUrl,
        title,
        isLive: false,
      })
    }
  }

  const isLoading =
    isLoadingPrograms || isLoadingRecordings || isLoadingFeatured

  if (isLoading) return <RadioLoading />
  if (isError || !programs || !programs) return <div>error</div>

  return (
    <div className={`flex flex-col gap-4`}>
      <Featured featured={featured} />
      <span className="text-xl font-semibold uppercase">новые выпуски</span>
      <NewRecordings featured={featured} newRecordings={newRecordings} />
      <div className="flex h-fit items-center gap-2">
        <span className="text-xl font-semibold uppercase">все передачи</span>
        <button onClick={handleShuffle} title="random">
          <Image
            src="/assets/shuffle.png"
            alt="shuffle"
            width={24}
            height={24}
            className="size-6"
          />
        </button>
      </div>
      <div className="grid w-full grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
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
