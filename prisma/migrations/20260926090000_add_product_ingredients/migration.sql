CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProductRemovableIngredient" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductRemovableIngredient_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProductAddon" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "addonId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductAddon_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Ingredient_restaurantId_id_key" ON "Ingredient"("restaurantId", "id");
CREATE INDEX "Ingredient_restaurantId_name_id_idx" ON "Ingredient"("restaurantId", "name", "id");
CREATE UNIQUE INDEX "ProductRemovableIngredient_restaurantId_productId_ingredientId_key"
  ON "ProductRemovableIngredient"("restaurantId", "productId", "ingredientId");
CREATE INDEX "ProductRemovableIngredient_restaurantId_productId_id_idx"
  ON "ProductRemovableIngredient"("restaurantId", "productId", "id");
CREATE INDEX "ProductRemovableIngredient_restaurantId_ingredientId_id_idx"
  ON "ProductRemovableIngredient"("restaurantId", "ingredientId", "id");
CREATE UNIQUE INDEX "ProductAddon_restaurantId_productId_addonId_key"
  ON "ProductAddon"("restaurantId", "productId", "addonId");
CREATE INDEX "ProductAddon_restaurantId_productId_id_idx"
  ON "ProductAddon"("restaurantId", "productId", "id");
CREATE INDEX "ProductAddon_restaurantId_addonId_id_idx"
  ON "ProductAddon"("restaurantId", "addonId", "id");

ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_restaurantId_fkey"
  FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductRemovableIngredient" ADD CONSTRAINT "ProductRemovableIngredient_restaurantId_fkey"
  FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductRemovableIngredient" ADD CONSTRAINT "ProductRemovableIngredient_restaurantId_productId_fkey"
  FOREIGN KEY ("restaurantId", "productId") REFERENCES "Product"("restaurantId", "id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductRemovableIngredient" ADD CONSTRAINT "ProductRemovableIngredient_restaurantId_ingredientId_fkey"
  FOREIGN KEY ("restaurantId", "ingredientId") REFERENCES "Ingredient"("restaurantId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProductAddon" ADD CONSTRAINT "ProductAddon_restaurantId_fkey"
  FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductAddon" ADD CONSTRAINT "ProductAddon_restaurantId_productId_fkey"
  FOREIGN KEY ("restaurantId", "productId") REFERENCES "Product"("restaurantId", "id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductAddon" ADD CONSTRAINT "ProductAddon_restaurantId_addonId_fkey"
  FOREIGN KEY ("restaurantId", "addonId") REFERENCES "Addon"("restaurantId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
