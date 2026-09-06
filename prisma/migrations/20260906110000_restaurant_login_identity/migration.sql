ALTER TABLE "User" ADD COLUMN "authVersion" INTEGER NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX "User_staff_email_key" ON "User" (lower("email"))
WHERE "role" IN ('OWNER', 'EMPLOYEE') AND "email" IS NOT NULL;

CREATE UNIQUE INDEX "User_staff_phone_key" ON "User" ("phone")
WHERE "role" IN ('OWNER', 'EMPLOYEE') AND "phone" IS NOT NULL;

CREATE FUNCTION update_user_auth_version() RETURNS trigger AS $$
BEGIN
  IF NEW."password" IS DISTINCT FROM OLD."password"
    OR NEW."role" IS DISTINCT FROM OLD."role"
    OR NEW."restaurantId" IS DISTINCT FROM OLD."restaurantId"
    OR NEW."isActive" IS DISTINCT FROM OLD."isActive" THEN
    NEW."authVersion" := OLD."authVersion" + 1;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "User_auth_version" BEFORE UPDATE ON "User"
FOR EACH ROW EXECUTE FUNCTION update_user_auth_version();
