-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `genres` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	CONSTRAINT "seasonEpisodeNumberConsistency" CHECK("recordings"."seasonNumber" is not null = "recordings"."episodeNumber" is not null)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `genres_name_unique` ON `genres` (`name`);--> statement-breakpoint
CREATE TABLE `people` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`telegramAccount` text,
	`createdAt` integer NOT NULL,
	CONSTRAINT "seasonEpisodeNumberConsistency" CHECK("recordings"."seasonNumber" is not null = "recordings"."episodeNumber" is not null)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `people_telegramAccount_unique` ON `people` (`telegramAccount`);--> statement-breakpoint
CREATE UNIQUE INDEX `people_name_unique` ON `people` (`name`);--> statement-breakpoint
CREATE TABLE `programs` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`hostId` text,
	`slug` text NOT NULL,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`hostId`) REFERENCES `people`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "seasonEpisodeNumberConsistency" CHECK("recordings"."seasonNumber" is not null = "recordings"."episodeNumber" is not null)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `programs_slug_unique` ON `programs` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `programs_name_unique` ON `programs` (`name`);--> statement-breakpoint
CREATE TABLE `recordingGenres` (
	`recordingId` text NOT NULL,
	`genreId` text NOT NULL,
	PRIMARY KEY(`recordingId`, `genreId`),
	FOREIGN KEY (`genreId`) REFERENCES `genres`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recordingId`) REFERENCES `recordings`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "seasonEpisodeNumberConsistency" CHECK("recordings"."seasonNumber" is not null = "recordings"."episodeNumber" is not null)
);
--> statement-breakpoint
CREATE TABLE `recordingPeople` (
	`recordingId` text NOT NULL,
	`personId` text NOT NULL,
	`role` text NOT NULL,
	PRIMARY KEY(`recordingId`, `personId`),
	FOREIGN KEY (`personId`) REFERENCES `people`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recordingId`) REFERENCES `recordings`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "seasonEpisodeNumberConsistency" CHECK("recordings"."seasonNumber" is not null = "recordings"."episodeNumber" is not null)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`sessionToken` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "seasonEpisodeNumberConsistency" CHECK("recordings"."seasonNumber" is not null = "recordings"."episodeNumber" is not null)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`role` text NOT NULL,
	CONSTRAINT "seasonEpisodeNumberConsistency" CHECK("recordings"."seasonNumber" is not null = "recordings"."episodeNumber" is not null)
);
--> statement-breakpoint
CREATE TABLE `recordings` (
	`id` text PRIMARY KEY NOT NULL,
	`programId` text NOT NULL,
	`episodeTitle` text NOT NULL,
	`episodeNumber` integer,
	`seasonNumber` integer,
	`description` text,
	`type` text NOT NULL,
	`releaseDate` integer NOT NULL,
	`duration` integer NOT NULL,
	`status` text NOT NULL,
	`keywords` text,
	`fileUrl` text NOT NULL,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`programId`) REFERENCES `programs`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "seasonEpisodeNumberConsistency" CHECK("recordings"."seasonNumber" is not null = "recordings"."episodeNumber" is not null)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `recordings_fileUrl_unique` ON `recordings` (`fileUrl`);
*/