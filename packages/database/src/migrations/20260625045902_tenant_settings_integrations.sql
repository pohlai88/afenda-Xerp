ALTER TABLE "tenant_settings" ADD COLUMN "integrations" jsonb DEFAULT '{}'::jsonb NOT NULL;
