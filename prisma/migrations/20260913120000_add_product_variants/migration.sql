-- Product variants own price and availability. A single unnamed variant
-- represents a simple product without a visible variant selector.
CREATE UNIQUE INDEX "Product_restaurantId_id_key" ON "Product"("restaurantId", "id");

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT,
    "price" INTEGER NOT NULL,
    "weight" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ProductVariant_price_non_negative" CHECK ("price" >= 0)
);

-- Existing products have no historical price to migrate. Give each one a
-- safe, unavailable default variant so the one-variant invariant is preserved
-- without accidentally publishing a free item. An administrator can set its
-- real price and availability in the product form.
INSERT INTO "ProductVariant" (
    "id",
    "restaurantId",
    "productId",
    "name",
    "price",
    "weight",
    "isAvailable",
    "sortOrder",
    "createdAt",
    "updatedAt"
)
SELECT
    'legacy_variant_' || "id",
    "restaurantId",
    "id",
    NULL,
    0,
    NULL,
    false,
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "Product";

-- CreateIndex
CREATE INDEX "ProductVariant_restaurantId_productId_sortOrder_id_idx" ON "ProductVariant"("restaurantId", "productId", "sortOrder", "id");

-- CreateIndex
CREATE INDEX "ProductVariant_restaurantId_isAvailable_productId_idx" ON "ProductVariant"("restaurantId", "isAvailable", "productId");

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_restaurantId_productId_fkey" FOREIGN KEY ("restaurantId", "productId") REFERENCES "Product"("restaurantId", "id") ON DELETE CASCADE ON UPDATE CASCADE;
