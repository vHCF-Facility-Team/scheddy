CREATE TABLE `mentor` (
	`id` int NOT NULL,
	`firstName` text,
	`lastName` text,
	`email` text,
	`role` int,
	`roleOverride` int,
	`isVisitor` boolean,
	`rating` int,
	`mentorAvailability` text,
	`allowedSessionTypes` text,
	`timezone` text,
	CONSTRAINT `mentor_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `student` (
	`id` int NOT NULL,
	`firstName` text,
	`lastName` text,
	`email` text,
	`role` int,
	`roleOverride` int,
	`isVisitor` boolean,
	`rating` int,
	`mentorAvailability` text,
	`allowedSessionTypes` text,
	`timezone` text,
	CONSTRAINT `student_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `session` DROP COLUMN `end`;