CREATE TABLE `user` (
	`id` int NOT NULL,
	`firstName` text,
	`lastName` text,
	`email` text,
	`role` int,
	`roleOverride` int,
	`isVisitor` boolean,
	`rating` int,
	CONSTRAINT `user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userToken` (
	`id` varchar(21) NOT NULL,
	`user` int,
	CONSTRAINT `userToken_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `userToken` ADD CONSTRAINT `userToken_user_user_id_fk` FOREIGN KEY (`user`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;