export type ProductVariantFormValues = {
  id?: string;
  name: string;
  price: number;
  weight: string;
  isAvailable: boolean;
};

export type ProductFormValues = {
  categoryId: string;
  name: string;
  description: string;
  baseComposition: string;
  sortOrder: number;
  isPublished: boolean;
  image: File | null;
  removeImage: boolean;
  variants: ProductVariantFormValues[];
};

export type ProductFormPageProps = {
  productId?: string;
};
