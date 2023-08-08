CREATE TABLE `ticket_labels` (
	`ticket_id` text NOT NULL,
	`label_id` text NOT NULL,
	FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`label_id`) REFERENCES `labels`(`id`) ON UPDATE no action ON DELETE cascade
);

ALTER TABLE users ADD `is_admin` integer DEFAULT false NOT NULL;