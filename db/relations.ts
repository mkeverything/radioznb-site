import { relations } from "drizzle-orm/relations";
import { programs, recordings, people, genres, recordingGenres, recordingPeople, user, session } from "./schema";

export const recordingsRelations = relations(recordings, ({one, many}) => ({
	program: one(programs, {
		fields: [recordings.programId],
		references: [programs.id]
	}),
	recordingGenres: many(recordingGenres),
	recordingPeople: many(recordingPeople),
}));

export const programsRelations = relations(programs, ({one, many}) => ({
	recordings: many(recordings),
	person: one(people, {
		fields: [programs.hostId],
		references: [people.id]
	}),
}));

export const peopleRelations = relations(people, ({many}) => ({
	programs: many(programs),
	recordingPeople: many(recordingPeople),
}));

export const recordingGenresRelations = relations(recordingGenres, ({one}) => ({
	genre: one(genres, {
		fields: [recordingGenres.genreId],
		references: [genres.id]
	}),
	recording: one(recordings, {
		fields: [recordingGenres.recordingId],
		references: [recordings.id]
	}),
}));

export const genresRelations = relations(genres, ({many}) => ({
	recordingGenres: many(recordingGenres),
}));

export const recordingPeopleRelations = relations(recordingPeople, ({one}) => ({
	person: one(people, {
		fields: [recordingPeople.personId],
		references: [people.id]
	}),
	recording: one(recordings, {
		fields: [recordingPeople.recordingId],
		references: [recordings.id]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	sessions: many(session),
}));