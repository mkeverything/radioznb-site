'use client'

import HomeButton from '@/components/HomeButton'
import { getPrograms } from '@/lib/actions'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Program from './Program'

const PageContent = () => {
	const {
		data: programs,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['programs'],
		queryFn: getPrograms,
	})
	const searchParams = useSearchParams()
	const router = useRouter()
	const slug = searchParams.get('program')

	if (isLoading) return <div>loading...</div>
	if (isError || !programs || !programs) return <div>error</div>

	const selectedProgram = programs.data?.find((p) => p.programs.slug === slug)

	const handleSearch = (slug: string) => {
		const params = new URLSearchParams(searchParams.toString())
		params.set('program', slug)
		router.push(`?${params.toString()}`)
	}

	return (
		<div className='flex flex-col gap-4'>
			<HomeButton />
			<div className='flex gap-4'>
				<Link
					href={'/library'}
					className={`sm:hidden flex select-none text-4xl items-center text-center justify-center size-16 ${selectedProgram ? 'block' : 'hidden'}`}
				>
					{'◀'}
				</Link>
				<div
					className={`flex flex-col gap-2 items-start min-w-1/3 ${selectedProgram ? 'max-sm:hidden' : ''}`}
				>
					<div className={`flex flex-col gap-2 items-start min-w-1/3`}>
						{programs.data?.map(({ programs: { id, name, slug } }) => (
							<button
								key={id}
								onClick={() => handleSearch(slug!)}
								className={`hover:underline text-left ${
									selectedProgram?.programs.id === id
										? 'underline font-semibold'
										: ''
								}`}
							>
								{name}
							</button>
						))}
					</div>
				</div>
				<Program selectedProgram={selectedProgram} />
			</div>
		</div>
	)
}

export default PageContent
