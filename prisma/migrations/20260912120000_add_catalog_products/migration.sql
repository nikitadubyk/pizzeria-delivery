-- A composite key lets Product enforce that its category belongs to the same restaurant.
CREATE UNIQUE INDEX "Category_restaurantId_id_key" ON "Category"("restaurantId", "id");

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "baseComposition" TEXT,
    "imageUrl" TEXT,
    "imageKey" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_restaurantId_categoryId_sortOrder_id_idx" ON "Product"("restaurantId", "categoryId", "sortOrder", "id");

-- CreateIndex
CREATE INDEX "Product_restaurantId_isPublished_sortOrder_id_idx" ON "Product"("restaurantId", "isPublished", "sortOrder", "id");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_restaurantId_categoryId_fkey" FOREIGN KEY ("restaurantId", "categoryId") REFERENCES "Category"("restaurantId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
