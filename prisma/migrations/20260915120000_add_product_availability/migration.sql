-- Product availability is a temporary operational stop-list state. It is
-- independent from publication, which remains an OWNER-managed catalog state.
ALTER TABLE "Product"
ADD COLUMN "isAvailable" BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX "Product_restaurantId_isAvailable_sortOrder_id_idx"
ON "Product"("restaurantId", "isAvailable", "sortOrder", "id");
