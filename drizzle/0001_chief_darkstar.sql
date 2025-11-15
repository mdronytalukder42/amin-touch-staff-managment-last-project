CREATE TABLE `income_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`userName` varchar(255) NOT NULL,
	`date` varchar(10) NOT NULL,
	`time` varchar(8) NOT NULL,
	`type` enum('Income Add','Income Minus','Income Payment','OTP Add','OTP Minus','OTP Payment') NOT NULL,
	`amount` int NOT NULL,
	`description` text NOT NULL,
	`recipient` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `income_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ticket_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`userName` varchar(255) NOT NULL,
	`issueDate` varchar(10) NOT NULL,
	`passengerName` varchar(255) NOT NULL,
	`pnr` varchar(50) NOT NULL,
	`tripType` enum('1 Way','Return') NOT NULL,
	`flightName` varchar(255) NOT NULL,
	`from` varchar(255) NOT NULL,
	`to` varchar(255) NOT NULL,
	`departureDate` varchar(10) NOT NULL,
	`arrivalDate` varchar(10) NOT NULL,
	`returnDate` varchar(10),
	`fromIssuer` varchar(255) NOT NULL,
	`bdNumber` varchar(50),
	`qrNumber` varchar(50),
	`ticketCopyUrl` text,
	`ticketCopyFileName` varchar(255),
	`status` enum('Pending','Confirmed','Cancelled') NOT NULL DEFAULT 'Pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ticket_entries_id` PRIMARY KEY(`id`)
);
