CREATE TABLE `session` (
	`id` varchar(21) NOT NULL,
	`mentor` int,
	`student` int,
	`type` varchar(21),
	`start` text,
	`end` text,
	CONSTRAINT `session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_mentor_user_id_fk` FOREIGN KEY (`mentor`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_student_user_id_fk` FOREIGN KEY (`student`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_type_sessionType_id_fk` FOREIGN KEY (`type`) REFERENCES `sessionType`(`id`) ON DELETE no action ON UPDATE no action;