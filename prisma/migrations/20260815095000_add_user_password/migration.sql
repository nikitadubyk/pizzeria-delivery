-- User credentials are required for all back-office accounts.
ALTER TABLE "User" ADD COLUMN "password" TEXT NOT NULL;

-- PostgreSQL treats NULL values as distinct in composite unique constraints,
-- so enforce one global super administrator per email with a partial index.
CREATE UNIQUE INDEX "User_super_admin_email_key"
ON "User" (lower("email"))
WHERE "role" = 'SUPER_ADMIN' AND "restaurantId" IS NULL AND "email" IS NOT NULL;
