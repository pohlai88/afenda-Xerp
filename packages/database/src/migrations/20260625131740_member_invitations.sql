CREATE TABLE "member_invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid,
	"email" text NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"consumed_at" timestamp with time zone,
	"user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "member_invitations" ADD CONSTRAINT "member_invitations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_invitations" ADD CONSTRAINT "member_invitations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "member_invitations_token_hash_uidx" ON "member_invitations" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "member_invitations_tenant_id_idx" ON "member_invitations" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "member_invitations_email_idx" ON "member_invitations" USING btree ("email");--> statement-breakpoint
CREATE INDEX "member_invitations_tenant_pending_idx" ON "member_invitations" USING btree ("tenant_id","consumed_at","expires_at");
