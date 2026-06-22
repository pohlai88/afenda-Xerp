ALTER TYPE "public"."organization_type" ADD VALUE IF NOT EXISTS 'site';--> statement-breakpoint
ALTER TYPE "public"."organization_type" ADD VALUE IF NOT EXISTS 'farm';--> statement-breakpoint
ALTER TYPE "public"."organization_type" ADD VALUE IF NOT EXISTS 'factory';--> statement-breakpoint
ALTER TYPE "public"."organization_type" ADD VALUE IF NOT EXISTS 'warehouse';--> statement-breakpoint
ALTER TYPE "public"."organization_type" ADD VALUE IF NOT EXISTS 'retail_outlet';--> statement-breakpoint
ALTER TYPE "public"."organization_type" ADD VALUE IF NOT EXISTS 'cost_center';--> statement-breakpoint
ALTER TYPE "public"."organization_type" ADD VALUE IF NOT EXISTS 'shared_service';--> statement-breakpoint
ALTER TYPE "public"."organization_type" ADD VALUE IF NOT EXISTS 'operating_unit';--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "effective_from" date;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "effective_to" date;
