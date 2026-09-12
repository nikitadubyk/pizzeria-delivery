"use client";

import { IconCategoryPlus, IconEdit } from "@tabler/icons-react";
import { Form, Formik, type FormikHelpers } from "formik";
import * as yup from "yup";

import {
  CATEGORY_NAME_MAX_LENGTH,
  CATEGORY_SORT_ORDER_MAX,
  type CategoryDto,
} from "@/api-contracts";
import { Button, Dialog, InputField, ToggleField } from "@/components/ui";
import { showSuccessNotification } from "@/components/ui/notification";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/store/api/categories.api";

type CategoryFormValues = {
  name: string;
  sortOrder: number;
  isPublished: boolean;
};

type CategoryFormDialogProps = {
  category: CategoryDto | null;
  onClose: () => void;
  onCreated: () => void;
  opened: boolean;
};

const CATEGORY_FORM_ID = "category-form";

const getInitialValues = (
  category: CategoryDto | null,
): CategoryFormValues => ({
  name: category?.name ?? "",
  sortOrder: category?.sortOrder ?? 0,
  isPublished: category?.isPublished ?? false,
});

const categoryFormValidationSchema: yup.ObjectSchema<CategoryFormValues> =
  yup.object({
    name: yup
      .string()
      .trim()
      .max(
        CATEGORY_NAME_MAX_LENGTH,
        `Название не должно превышать ${CATEGORY_NAME_MAX_LENGTH} символов`,
      )
      .required("Введите название категории"),
    sortOrder: yup
      .number()
      .typeError("Введите целое число")
      .integer("Порядок должен быть целым числом")
      .min(0, "Порядок не должен быть отрицательным")
      .max(
        CATEGORY_SORT_ORDER_MAX,
        `Порядок не должен превышать ${CATEGORY_SORT_ORDER_MAX}`,
      )
      .required("Введите порядок категории"),
    isPublished: yup.boolean().required("Укажите статус публикации"),
  });

export function CategoryFormDialog({
  category,
  onClose,
  onCreated,
  opened,
}: CategoryFormDialogProps) {
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const isEditing = category !== null;
  const isSaving = isCreating || isUpdating;

  const handleSubmit = async (
    values: CategoryFormValues,
    { resetForm }: FormikHelpers<CategoryFormValues>,
  ) => {
    try {
      const data = {
        name: values.name.trim(),
        sortOrder: Number(values.sortOrder),
        isPublished: values.isPublished,
      };

      if (category) {
        await updateCategory({ categoryId: category.id, data }).unwrap();
        showSuccessNotification({ message: "Категория обновлена" });
      } else {
        await createCategory(data).unwrap();
        showSuccessNotification({ message: "Категория создана" });
        onCreated();
      }

      resetForm();
      onClose();
    } catch {
      // Axios interceptor displays the API error notification.
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={getInitialValues(category)}
      onSubmit={handleSubmit}
      validationSchema={categoryFormValidationSchema}
    >
      {({ isSubmitting, resetForm }) => {
        const pending = isSubmitting || isSaving;
        const handleClose = () => {
          if (pending) return;

          resetForm();
          onClose();
        };

        return (
          <Dialog
            actions={
              <>
                <Button
                  disabled={pending}
                  onClick={handleClose}
                  type="button"
                  variant="secondary"
                >
                  Отменить
                </Button>
                <Button form={CATEGORY_FORM_ID} loading={pending} type="submit">
                  {isEditing ? "Сохранить" : "Создать категорию"}
                </Button>
              </>
            }
            closeButtonProps={{ disabled: pending }}
            closeOnClickOutside={!pending}
            closeOnEscape={!pending}
            description={
              isEditing
                ? "Измените данные категории и сохраните изменения."
                : "Укажите название, положение в меню и видимость категории на витрине."
            }
            icon={
              isEditing ? (
                <IconEdit size={22} />
              ) : (
                <IconCategoryPlus size={22} />
              )
            }
            onClose={handleClose}
            opened={opened}
            preventInitialFocus
            title={isEditing ? "Редактировать категорию" : "Новая категория"}
          >
            <Form className="grid gap-md" id={CATEGORY_FORM_ID} noValidate>
              <InputField
                autoComplete="off"
                label="Название"
                name="name"
                placeholder="Например, Пицца"
              />
              <InputField
                description="Категории с меньшим значением отображаются выше"
                inputMode="numeric"
                label="Порядок"
                min={0}
                name="sortOrder"
                step={1}
                type="number"
              />
              <ToggleField
                description="Опубликованная категория доступна на витрине"
                label="Опубликована"
                name="isPublished"
              />
            </Form>
          </Dialog>
        );
      }}
    </Formik>
  );
}
