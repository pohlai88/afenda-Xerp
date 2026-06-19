ALTER TABLE "user" RENAME TO "auth_user";--> statement-breakpoint
ALTER TABLE "session" RENAME TO "auth_session";--> statement-breakpoint
ALTER TABLE "account" RENAME TO "auth_account";--> statement-breakpoint
ALTER TABLE "verification" RENAME TO "auth_verification";--> statement-breakpoint
ALTER TABLE "auth_user" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "auth_user" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "auth_session" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "auth_session" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "auth_account" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "auth_account" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
UPDATE "auth_verification" SET "created_at" = now() WHERE "created_at" IS NULL;--> statement-breakpoint
UPDATE "auth_verification" SET "updated_at" = now() WHERE "updated_at" IS NULL;--> statement-breakpoint
ALTER TABLE "auth_verification" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "auth_verification" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "auth_verification" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "auth_verification" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
CREATE INDEX "auth_session_user_id_idx" ON "auth_session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "auth_account_user_id_idx" ON "auth_account" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "auth_account_provider_account_unique" ON "auth_account" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE INDEX "auth_verification_identifier_idx" ON "auth_verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "auth_verification_expires_at_idx" ON "auth_verification" USING btree ("expires_at");--> statement-breakpoint
CREATE TABLE "auth_identity_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auth_user_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"provider_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "auth_identity_links" ADD CONSTRAINT "auth_identity_links_auth_user_id_auth_user_id_fk" FOREIGN KEY ("auth_user_id") REFERENCES "public"."auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_identity_links" ADD CONSTRAINT "auth_identity_links_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "auth_identity_links_auth_user_provider_unique" ON "auth_identity_links" USING btree ("auth_user_id","provider_id");--> statement-breakpoint
CREATE INDEX "auth_identity_links_auth_user_id_idx" ON "auth_identity_links" USING btree ("auth_user_id");--> statement-breakpoint
CREATE INDEX "auth_identity_links_user_id_idx" ON "auth_identity_links" USING btree ("user_id");
