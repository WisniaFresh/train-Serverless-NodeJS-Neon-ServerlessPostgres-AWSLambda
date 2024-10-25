ALTER TABLE "leads" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "leads" DROP COLUMN IF EXISTS "description";