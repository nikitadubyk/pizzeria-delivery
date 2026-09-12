"use client";

import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconPizza,
} from "@tabler/icons-react";
import { Form, Formik, type FormikHelpers } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as yup from "yup";

import {
  PRODUCT_BASE_COMPOSITION_MAX_LENGTH,
  PRODUCT_DESCRIPTION_MAX_LENGTH,
  PRODUCT_NAME_MAX_LENGTH,
  PRODUCT_SORT_ORDER_MAX,
  type CreateProductRequest,
  type ProductDto,
} from "@/api-contracts";
import { Details } from "@/components/details";
import { ImageDropzone } from "@/components/image-dropzone";
import {
  Button,
  EmptyState,
  InputField,
  SelectField,
  TextareaField,
  ToggleField,
  Typography,
} from "@/components/ui";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/components/ui/notification";
import { ROUTES } from "@/config/routes";
import { useProductImageSave } from "@/hooks/use-product-image-save";
import { useGetCategoryOptionsQuery } from "@/store/api/categories.api";
import {
  useCreateProductMutation,
  useGetProductQuery,
  useUpdateProductMutation,
} from "@/store/api/products.api";

type ProductFormValues = {
  categoryId: string;
  name: string;
  description: string;
  baseComposition: string;
  sortOrder: number;
  isPublished: boolean;
  image: File | null;
  removeImage: boolean;
};

type ProductFormPageProps = {
  productId?: string;
};

const PRODUCT_FORM_ID = "product-form";

const getProductInitialValues = (
  product: ProductDto | null,
  defaultCategoryId = "",
): ProductFormValues => ({
  categoryId: product?.categoryId ?? defaultCategoryId,
  name: product?.name ?? "",
  description: product?.description ?? "",
  baseComposition: product?.baseComposition ?? "",
  sortOrder: product?.sortOrder ?? 0,
  isPublished: product?.isPublished ?? false,
  image: null,
  removeImage: false,
});

const productFormValidationSchema: yup.ObjectSchema<ProductFormValues> =
  yup.object({
    categoryId: yup.string().trim().required("Выберите категорию"),
    name: yup
      .string()
      .trim()
      .max(
        PRODUCT_NAME_MAX_LENGTH,
        `Название не должно превышать ${PRODUCT_NAME_MAX_LENGTH} символов`,
      )
      .required("Введите название продукта"),
    description: yup
      .string()
      .trim()
      .max(
        PRODUCT_DESCRIPTION_MAX_LENGTH,
        `Описание не должно превышать ${PRODUCT_DESCRIPTION_MAX_LENGTH} символов`,
      )
      .ensure(),
    baseComposition: yup
      .string()
      .trim()
      .max(
        PRODUCT_BASE_COMPOSITION_MAX_LENGTH,
        `Состав не должен превышать ${PRODUCT_BASE_COMPOSITION_MAX_LENGTH} символов`,
      )
      .ensure(),
    sortOrder: yup
      .number()
      .typeError("Введите целое число")
      .integer("Порядок должен быть целым числом")
      .min(0, "Порядок не должен быть отрицательным")
      .max(
        PRODUCT_SORT_ORDER_MAX,
        `Порядок не должен превышать ${PRODUCT_SORT_ORDER_MAX}`,
      )
      .required("Введите порядок продукта"),
    isPublished: yup.boolean().required("Укажите статус публикации"),
    image: yup
      .mixed<File>()
      .nullable()
      .defined("Выберите изображение или оставьте поле пустым"),
    removeImage: yup
      .boolean()
      .required("Укажите, нужно ли удалить изображение"),
  });

export function ProductFormPage({ productId }: ProductFormPageProps) {
  const router = useRouter();
  const isEditing = productId !== undefined;
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const { isSavingImage, saveProductImage, uploadProgress, uploadStage } =
    useProductImageSave();
  const {
    data: product,
    isError: isProductError,
    isFetching: isProductFetching,
    isLoading: isProductLoading,
    refetch: refetchProduct,
  } = useGetProductQuery(
    { productId: productId ?? "" },
    { skip: productId === undefined },
  );
  const {
    data: categoriesData,
    isError: isCategoriesError,
    isFetching: isCategoriesFetching,
    isLoading: isCategoriesLoading,
    refetch: refetchCategories,
  } = useGetCategoryOptionsQuery();
  const categories = categoriesData ?? [];
  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));
  const isLoading = isCategoriesLoading || (isEditing && isProductLoading);
  const isFetching = isCategoriesFetching || (isEditing && isProductFetching);
  const isError = isCategoriesError || (isEditing && isProductError);
  const isSaving = isCreating || isUpdating || isSavingImage;

  const handleSubmit = async (
    values: ProductFormValues,
    helpers: FormikHelpers<ProductFormValues>,
  ) => {
    let savedProduct: ProductDto | null = null;
    const data: CreateProductRequest = {
      categoryId: values.categoryId,
      name: values.name.trim(),
      description: values.description.trim() || null,
      baseComposition: values.baseComposition.trim() || null,
      sortOrder: Number(values.sortOrder),
      isPublished: values.isPublished,
    };

    try {
      savedProduct = product
        ? await updateProduct({ productId: product.id, data }).unwrap()
        : await createProduct(data).unwrap();

      await saveProductImage({
        currentImageUrl: product?.imageUrl,
        image: values.image,
        productId: savedProduct.id,
        removeImage: values.removeImage,
      });

      showSuccessNotification({
        message: product ? "Продукт обновлён" : "Продукт создан",
      });
      helpers.resetForm();
      router.push(ROUTES.ADMIN.MENU);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Не удалось сохранить продукт";

      showErrorNotification({
        message:
          !product && savedProduct
            ? `Продукт создан без изображения. ${errorMessage}`
            : errorMessage,
      });

      if (!product && savedProduct) {
        router.replace(ROUTES.ADMIN.menuEditProduct(savedProduct.id));
      }
    } finally {
      helpers.setSubmitting(false);
    }
  };

  const retry = () => {
    if (isCategoriesError) void refetchCategories();
    if (isEditing && isProductError) void refetchProduct();
  };

  return (
    <section className="grid content-start gap-lg">
      <div className="flex flex-wrap items-end justify-between gap-md">
        <div>
          <Typography muted variant="eyebrow">
            Управление меню
          </Typography>
          <Typography className="!text-2xl sm:!text-4xl" variant="h1">
            {isEditing ? "Редактировать продукт" : "Новый продукт"}
          </Typography>
        </div>
        <Button
          disabled={isSaving}
          leftSection={<IconArrowLeft aria-hidden="true" size={18} />}
          onClick={() => router.push(ROUTES.ADMIN.MENU)}
          type="button"
          variant="secondary"
        >
          К списку
        </Button>
      </div>

      <Details
        className="min-h-96 md:min-h-[32rem]"
        errorMessage="Не удалось загрузить данные формы"
        isError={isError}
        isFetching={isFetching}
        isLoading={isLoading}
        onRetry={retry}
      >
        {categories.length === 0 ? (
          <EmptyState
            action={
              <Button component={Link} href={ROUTES.ADMIN.CATEGORIES}>
                Создать категорию
              </Button>
            }
            icon={<IconPizza size={32} />}
            title="Сначала добавьте категорию"
            description="Каждый продукт должен относиться к категории меню."
          />
        ) : (
          <Formik
            enableReinitialize
            initialValues={getProductInitialValues(
              product ?? null,
              categories[0]?.id,
            )}
            onSubmit={handleSubmit}
            validationSchema={productFormValidationSchema}
          >
            {({ isSubmitting, setFieldValue, values }) => {
              const pending = isSubmitting || isSaving;

              return (
                <Form
                  className="grid gap-lg rounded-xl border border-border bg-background p-md sm:p-lg"
                  id={PRODUCT_FORM_ID}
                  noValidate
                >
                  <div className="grid gap-xl lg:grid-cols-[minmax(0,1fr)_minmax(20rem,26rem)]">
                    <div className="grid content-start gap-md">
                      <InputField
                        autoComplete="off"
                        disabled={pending}
                        label="Название"
                        name="name"
                        placeholder="Например, Маргарита"
                      />
                      <SelectField
                        allowDeselect={false}
                        data={categoryOptions}
                        disabled={pending}
                        searchable
                        label="Категория"
                        name="categoryId"
                        placeholder="Выберите категорию"
                      />
                      <TextareaField
                        autosize
                        disabled={pending}
                        label="Описание"
                        maxRows={8}
                        minRows={3}
                        name="description"
                        placeholder="Короткое описание для меню"
                      />
                      <TextareaField
                        autosize
                        disabled={pending}
                        label="Базовый состав"
                        maxRows={8}
                        minRows={3}
                        name="baseComposition"
                        placeholder="Например, тесто, томатный соус, моцарелла"
                      />
                      <InputField
                        description="Продукты с меньшим значением отображаются выше"
                        disabled={pending}
                        inputMode="numeric"
                        label="Порядок"
                        min={0}
                        name="sortOrder"
                        step={1}
                        type="number"
                      />
                      <ToggleField
                        description="Опубликованный продукт доступен на витрине"
                        disabled={pending}
                        label="Опубликован"
                        name="isPublished"
                      />
                    </div>

                    <div className="grid content-start gap-sm">
                      <ImageDropzone
                        currentImageUrl={
                          values.removeImage ? null : product?.imageUrl
                        }
                        disabled={pending}
                        label={
                          product?.imageUrl
                            ? "Изображение продукта"
                            : "Изображение"
                        }
                        loading={uploadStage !== null}
                        onChange={(file) => {
                          void setFieldValue("image", file);
                          if (file) void setFieldValue("removeImage", false);
                        }}
                        onRemoveCurrentImage={
                          product?.imageUrl
                            ? () => {
                                void setFieldValue("image", null);
                                void setFieldValue("removeImage", true);
                              }
                            : undefined
                        }
                        value={values.image}
                      />
                      {uploadStage ? (
                        <Typography muted variant="caption">
                          {uploadStage}: {Math.round(uploadProgress)}%
                        </Typography>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-col-reverse gap-sm border-t border-border pt-md sm:flex-row sm:justify-end">
                    <Button
                      disabled={pending}
                      onClick={() => router.push(ROUTES.ADMIN.MENU)}
                      type="button"
                      variant="secondary"
                    >
                      Отменить
                    </Button>
                    <Button
                      leftSection={
                        <IconDeviceFloppy aria-hidden="true" size={18} />
                      }
                      loading={pending}
                      type="submit"
                    >
                      {isEditing ? "Сохранить продукт" : "Создать продукт"}
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        )}
      </Details>
    </section>
  );
}
