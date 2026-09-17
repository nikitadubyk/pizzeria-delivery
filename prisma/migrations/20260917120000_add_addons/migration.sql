CREATE TABLE "Addon" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Addon_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Addon_price_positive" CHECK ("price" > 0)
);

CREATE UNIQUE INDEX "Addon_restaurantId_id_key" ON "Addon"("restaurantId", "id");
CREATE INDEX "Addon_restaurantId_name_id_idx" ON "Addon"("restaurantId", "name", "id");
CREATE INDEX "Addon_restaurantId_isAvailable_id_idx" ON "Addon"("restaurantId", "isAvailable", "id");

ALTER TABLE "Addon" ADD CONSTRAINT "Addon_restaurantId_fkey"
FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
