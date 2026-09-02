-- Enforce the platform invariant that only one global super administrator exists.
-- The migration intentionally fails if duplicate SUPER_ADMIN rows already exist,
-- so operators can resolve them explicitly instead of losing account data.
CREATE UNIQUE INDEX "User_single_super_admin_key"
ON "User" ((1))
WHERE "role" = 'SUPER_ADMIN' AND "restaurantId" IS NULL;
