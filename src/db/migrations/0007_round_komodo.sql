ALTER TABLE "user" ADD COLUMN "banned" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "banReason" varchar(500);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "banExpires" timestamp;