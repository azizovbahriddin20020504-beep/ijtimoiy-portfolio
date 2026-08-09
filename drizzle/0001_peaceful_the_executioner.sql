CREATE TABLE `achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`category` varchar(128),
	`title` varchar(255) NOT NULL,
	`date` varchar(32),
	`eventName` varchar(255),
	`result` varchar(255),
	`evidenceUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `achievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `activities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`date` varchar(32) NOT NULL,
	`eventName` varchar(255) NOT NULL,
	`organization` varchar(255),
	`workDone` text,
	`role` varchar(128),
	`hours` decimal(8,2) NOT NULL DEFAULT '0',
	`status` enum('pending','approved','needs_review','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evaluations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`quarter` varchar(32) NOT NULL,
	`activity` int NOT NULL DEFAULT 0,
	`initiative` int NOT NULL DEFAULT 0,
	`reflection` int NOT NULL DEFAULT 0,
	`verification` int NOT NULL DEFAULT 0,
	`documentation` int NOT NULL DEFAULT 0,
	`feedback` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `evaluations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evidence` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`type` varchar(64),
	`url` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `evidence_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `goals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`deadline` varchar(64),
	`status` varchar(64) NOT NULL DEFAULT 'Rejalashtirilmoqda',
	`progress` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `goals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fullName` varchar(255),
	`school` varchar(255),
	`className` varchar(32),
	`academicYear` varchar(32),
	`advisor` varchar(255),
	`interests` text,
	`strengths` text,
	`goalsSummary` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `profiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`role` varchar(128),
	`teamSize` int,
	`duration` varchar(64),
	`outcome` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reflections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`quarter` varchar(32) NOT NULL,
	`benefit` text,
	`challenge` text,
	`skill` text,
	`nextGoal` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reflections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','advisor') NOT NULL DEFAULT 'user';