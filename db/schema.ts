import {
  sqliteTable,
  AnySQLiteColumn,
  uniqueIndex,
  foreignKey,
  check,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

export const recordings = sqliteTable(
  "recordings",
  {
    id: text().primaryKey().notNull(),
    programId: text()
      .notNull()
      .references(() => programs.id),
    episodeTitle: text().notNull(),
    episodeNumber: integer(),
    seasonNumber: integer(),
    description: text(),
    type: text().notNull(),
    releaseDate: integer().notNull(),
    duration: integer().notNull(),
    status: text().notNull(),
    keywords: text(),
    fileUrl: text().notNull(),
    createdAt: integer().notNull(),
  },
  (table) => [
    uniqueIndex("recordings_fileUrl_unique").on(table.fileUrl),
    check(
      "seasonRequiresEpisode",
      sql`("recordings"."seasonNumber" is null or "recordings"."episodeNumber" is not null`,
    ),
  ],
)

export const genres = sqliteTable(
  "genres",
  {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
  },
  (table) => [
    uniqueIndex("genres_name_unique").on(table.name),
    check(
      "seasonRequiresEpisode",
      sql`("recordings"."seasonNumber" is null or "recordings"."episodeNumber" is not null`,
    ),
  ],
)

export const people = sqliteTable(
  "people",
  {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    telegramAccount: text(),
    createdAt: integer().notNull(),
  },
  (table) => [
    uniqueIndex("people_telegramAccount_unique").on(table.telegramAccount),
    uniqueIndex("people_name_unique").on(table.name),
    check(
      "seasonRequiresEpisode",
      sql`("recordings"."seasonNumber" is null or "recordings"."episodeNumber" is not null`,
    ),
  ],
)

export const programs = sqliteTable(
  "programs",
  {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    description: text(),
    hostId: text().references(() => people.id),
    slug: text().notNull(),
    createdAt: integer().notNull(),
  },
  (table) => [
    uniqueIndex("programs_slug_unique").on(table.slug),
    uniqueIndex("programs_name_unique").on(table.name),
    check(
      "seasonRequiresEpisode",
      sql`("recordings"."seasonNumber" is null or "recordings"."episodeNumber" is not null`,
    ),
  ],
)

export const recordingGenres = sqliteTable(
  "recordingGenres",
  {
    recordingId: text()
      .notNull()
      .references(() => recordings.id, { onDelete: "cascade" }),
    genreId: text()
      .notNull()
      .references(() => genres.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({
      columns: [table.recordingId, table.genreId],
      name: "recordingGenres_recordingId_genreId_pk",
    }),
    check(
      "seasonRequiresEpisode",
      sql`("recordings"."seasonNumber" is null or "recordings"."episodeNumber" is not null`,
    ),
  ],
)

export const recordingPeople = sqliteTable(
  "recordingPeople",
  {
    recordingId: text()
      .notNull()
      .references(() => recordings.id, { onDelete: "cascade" }),
    personId: text()
      .notNull()
      .references(() => people.id, { onDelete: "cascade" }),
    role: text().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.recordingId, table.personId],
      name: "recordingPeople_recordingId_personId_pk",
    }),
    check(
      "seasonRequiresEpisode",
      sql`("recordings"."seasonNumber" is null or "recordings"."episodeNumber" is not null`,
    ),
  ],
)

export const session = sqliteTable(
  "session",
  {
    sessionToken: text().primaryKey().notNull(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    expires: integer().notNull(),
  },
  (table) => [
    check(
      "seasonRequiresEpisode",
      sql`("recordings"."seasonNumber" is null or "recordings"."episodeNumber" is not null`,
    ),
  ],
)

export const user = sqliteTable(
  "user",
  {
    id: text().primaryKey().notNull(),
    username: text().notNull(),
    password: text().notNull(),
    role: text().notNull(),
  },
  (table) => [
    check(
      "seasonRequiresEpisode",
      sql`("recordings"."seasonNumber" is null or "recordings"."episodeNumber" is not null`,
    ),
  ],
)

// auth tables
export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  username: text("username").notNull(),
  password: text("password").notNull(),
  role: text("role", { enum: ["admin", "user"] })
    .$onUpdateFn(() => "user")
    .notNull(),
})

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
})
