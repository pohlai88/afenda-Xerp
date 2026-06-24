ALTER TYPE "public"."membership_scope" ADD VALUE IF NOT EXISTS 'team';--> statement-breakpoint
ALTER TABLE "memberships" ADD COLUMN "team_id" uuid;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "memberships_team_id_idx" ON "memberships" USING btree ("team_id");--> statement-breakpoint
CREATE UNIQUE INDEX "memberships_team_scope_unique" ON "memberships" USING btree ("user_id","tenant_id","team_id","role_id") WHERE "scope_type" = 'team';
