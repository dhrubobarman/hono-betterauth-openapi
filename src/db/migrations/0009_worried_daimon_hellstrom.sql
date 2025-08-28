CREATE TABLE "two_factor" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"secret" varchar(100) NOT NULL,
	"backup_codes" varchar(255) NOT NULL,
	"user_id" varchar(36) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "two_factor_enabled" boolean;--> statement-breakpoint
ALTER TABLE "two_factor" ADD CONSTRAINT "two_factor_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;