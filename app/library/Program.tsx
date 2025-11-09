import { Person, Program } from '@/db/schema'
import { FC } from 'react'
import Recordings from './Recordings'

const ProgramComponent: FC<{
	selectedProgram: { programs: Program; people: Person | null } | undefined
}> = ({ selectedProgram }) => {
	if (!selectedProgram) return null

	const { programs, people } = selectedProgram
	return (
		<div className='flex flex-col w-full gap-2'>
			<div className='pl-4'>
				<div className='text-2xl font-bold'>{programs.name}</div>
				{programs.description}
				{people?.name && (
					<div className='opacity-30'>передачу ведёт {people.name}</div>
				)}
			</div>
			<Recordings programId={programs.id} />
		</div>
	)
}

export default ProgramComponent
