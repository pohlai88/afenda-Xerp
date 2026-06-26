CREATE TABLE "api_idempotency_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scope_key" varchar(512) NOT NULL,
	"status_code" integer NOT NULL,
	"response_data" jsonb NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "api_rate_limit_buckets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bucket_key" varchar(512) NOT NULL,
	"window_start" timestamp with time zone NOT NULL,
	"request_count" integer DEFAULT 1 NOT NULL,
	"window_seconds" integer NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "api_idempotency_records_scope_key_uidx" ON "api_idempotency_records" USING btree ("scope_key");--> statement-breakpoint
CREATE INDEX "api_idempotency_records_expires_at_idx" ON "api_idempotency_records" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "api_rate_limit_buckets_bucket_key_uidx" ON "api_rate_limit_buckets" USING btree ("bucket_key");