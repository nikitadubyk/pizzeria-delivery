import type { ProductDto, ProductVariantDto } from "@/api-contracts";

export type ProductPageProps = {
  params: Promise<{ productId: string }>;
};

export type ProductDetailsPageProps = {
  productId: string;
};

export type DetailFieldProps = {
  label: string;
  value: string | number | null;
};

export type ProductVariantProps = {
  variant: ProductVariantDto;
};

export type ProductContentProps = {
  product: ProductDto;
};
