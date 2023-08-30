CREATE TABLE `attachments` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`blob` blob NOT NULL
);

CREATE TABLE `ticket_attachments` (
	`ticket_id` text NOT NULL,
	`attachment_id` text NOT NULL,
	FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`attachment_id`) REFERENCES `attachments`(`id`) ON UPDATE no action ON DELETE no action
);

/*
 SQLite does not support "Dropping foreign key" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/
/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/