ALTER TABLE "Restaurant"
ADD COLUMN "deliveryPrice" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Restaurant"
ADD CONSTRAINT "Restaurant_deliveryPrice_nonnegative_check"
CHECK ("deliveryPrice" >= 0);
