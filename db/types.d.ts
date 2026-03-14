export type User = InferSelectModel<typeof users>
export type Session = InferSelectModel<typeof sessions>
export type Person = InferSelectModel<typeof people>
export type Program = InferSelectModel<typeof programs>
export type Genre = InferSelectModel<typeof genres>
export type Recording = InferSelectModel<typeof recordings>
export type RecordingGenre = InferSelectModel<typeof recordingGenres>
export type RecordingPerson = InferSelectModel<typeof recordingPeople>

export type UserInsert = InferInsertModel<typeof users>
export type SessionInsert = InferInsertModel<typeof sessions>
export type PersonInsert = InferInsertModel<typeof people>
export type ProgramInsert = InferInsertModel<typeof programs>
export type GenreInsert = InferInsertModel<typeof genres>
export type RecordingInsert = InferInsertModel<typeof recordings>
export type RecordingGenreInsert = InferInsertModel<typeof recordingGenres>
export type RecordingPersonInsert = InferInsertModel<typeof recordingPeople>
