ALTER TYPE "public"."membership_scope" ADD VALUE IF NOT EXISTS 'entity_group';--> statement-breakpoint
ALTER TABLE "memberships" ADD COLUMN "entity_group_id" uuid;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_entity_group_id_entity_groups_id_fk" FOREIGN KEY ("entity_group_id") REFERENCES "public"."entity_groups"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "memberships_entity_group_id_idx" ON "memberships" USING btree ("entity_group_id");--> statement-breakpoint
CREATE UNIQUE INDEX "memberships_entity_group_scope_unique" ON "memberships" USING btree ("user_id","tenant_id","entity_group_id","role_id") WHERE "scope_type" = 'entity_group';
