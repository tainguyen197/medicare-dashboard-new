ALTER TABLE `users` ADD `password_hash` text;--> statement-breakpoint
ALTER TABLE `users` ADD `role` text DEFAULT 'editor' NOT NULL;