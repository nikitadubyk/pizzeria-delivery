-- CreateEnum
CREATE TYPE "RestaurantStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'OWNER', 'EMPLOYEE');

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "RestaurantStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'EMPLOYEE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_slug_key" ON "Restaurant"("slug");

-- CreateIndex
CREATE INDEX "User_restaurantId_idx" ON "User"("restaurantId");

-- CreateIndex
CREATE INDEX "User_restaurantId_phone_idx" ON "User"("restaurantId", "phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_restaurantId_email_key" ON "User"("restaurantId", "email");

-- AddForeignKey
ALTER TABLE "User"
ADD CONSTRAINT "User_role_tenant_phone_check"
CHECK (
  (
    "role" = 'SUPER_ADMIN'
    AND "restaurantId" IS NULL
  )
  OR
  (
    "role" IN ('OWNER', 'EMPLOYEE')
    AND "restaurantId" IS NOT NULL
    AND "phone" IS NOT NULL
    AND btrim("phone") <> ''
  )
);