CREATE TABLE `sessionType` (
	`id` varchar(21) NOT NULL,
	`name` text,
	`category` text,
	`length` int,
	CONSTRAINT `sessionType_id` PRIMARY KEY(`id`)
);
