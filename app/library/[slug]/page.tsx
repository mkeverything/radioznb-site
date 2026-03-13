"use client"

import { getProgramBySlug } from "@/lib/actions"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { FC, use } from "react"
import Recordings from "./Recordings"

const Page: FC<{ params: Promise<{ slug: string }> }> = ({ params }) => {
  const { slug } = use(params)
  const { data } = useQuery({
    queryKey: ["programById"],
    queryFn: () => getProgramBySlug(slug),
  })

  if (!data) return null

  const { programs, people } = data
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="pl-4">
        <Link
          href="/library"
          className="mb-2 inline-block text-lg opacity-25 hover:underline hover:opacity-100"
        >
          ← все передачи
        </Link>
        <div className="text-3xl font-bold uppercase">{programs.name}</div>
        <span className="text-xl">{programs.description}</span>
        {people?.name && (
          <div className="text-2xl opacity-50">
            передачу ведёт {people.name}
          </div>
        )}
      </div>
      <Recordings programId={programs.id} />
    </div>
  )
}

export default Page
