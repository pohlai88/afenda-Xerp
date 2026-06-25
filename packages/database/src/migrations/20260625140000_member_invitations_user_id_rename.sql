-- Repair: early Slice 11 handoff used platform_user_id; schema uses userIdRef() → user_id.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'member_invitations'
      AND column_name = 'platform_user_id'
  ) THEN
    ALTER TABLE "member_invitations" RENAME COLUMN "platform_user_id" TO "user_id";
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'member_invitations_platform_user_id_users_id_fk'
  ) THEN
    ALTER TABLE "member_invitations"
      RENAME CONSTRAINT "member_invitations_platform_user_id_users_id_fk"
      TO "member_invitations_user_id_users_id_fk";
  END IF;
END $$;
