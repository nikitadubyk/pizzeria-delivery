"use client";

import { IconBuildingStore, IconEdit } from "@tabler/icons-react";
import { Form, Formik, type FormikHelpers } from "formik";
import * as yup from "yup";

import type { RestaurantDto, RestaurantStatus } from "@/api-contracts";
import {
  RESTAURANT_NAME_MAX_LENGTH,
  RESTAURANT_SLUG_MAX_LENGTH,
  RESTAURANT_SLUG_PATTERN,
  RESTAURANT_STATUSES,
} from "@/app/api/restaurants/config";
import {
  Button,
  Dialog,
  InputField,
  SelectField,
} from "@/components/ui";
import { showSuccessNotification } from "@/components/ui/notification";
import {
  useCreateRestaurantMutation,
  useUpdateRestaurantMutation,
} from "@/store/api/super-admin.api";

type RestaurantFormValues = {
  name: string;
  slug: string;
  status: RestaurantStatus;
};

type RestaurantFormDialogProps = {
  onClose: () => void;
  opened: boolean;
  restaurant: RestaurantDto | null;
};

const RESTAURANT_FORM_ID = "restaurant-form";

const statusOptions: { label: string; value: RestaurantStatus }[] = [
  { label: "Активен", value: "ACTIVE" },
  { label: "Приостановлен", value: "SUSPENDED" },
  { label: "В архиве", value: "ARCHIVED" },
];

const restaurantFormValidationSchema: yup.ObjectSchema<RestaurantFormValues> =
  yup.object({
    name: yup
      .string()
      .trim()
      .max(
        RESTAURANT_NAME_MAX_LENGTH,
        "Название не должно превышать " +
          RESTAURANT_NAME_MAX_LENGTH +
          " символов",
      )
      .required("Введите название ресторана"),
    slug: yup
      .string()
      .trim()
      .lowercase()
      .max(
        RESTAURANT_SLUG_MAX_LENGTH,
        "Slug не должен превышать " +
          RESTAURANT_SLUG_MAX_LENGTH +
          " символов",
      )
      .matches(
        RESTAURANT_SLUG_PATTERN,
        "Используйте строчные латинские буквы, цифры и одиночные дефисы",
      )
      .required("Введите slug ресторана"),
    status: yup
      .mixed<RestaurantStatus>()
      .oneOf(RESTAURANT_STATUSES, "Выберите корректный статус")
      .required("Выберите статус"),
  });

const getInitialValues = (
  restaurant: RestaurantDto | null,
): RestaurantFormValues => ({
  name: restaurant?.name ?? "",
  slug: restaurant?.slug ?? "",
  status: restaurant?.status ?? "ACTIVE",
});

export const RestaurantFormDialog = ({
  onClose,
  opened,
  restaurant,
}: RestaurantFormDialogProps) => {
  const [createRestaurant, { isLoading: isCreating }] =
    useCreateRestaurantMutation();
  const [updateRestaurant, { isLoading: isUpdating }] =
    useUpdateRestaurantMutation();
  const isEditing = restaurant !== null;
  const isSaving = isCreating || isUpdating;

  const handleSubmit = async (
    values: RestaurantFormValues,
    { resetForm }: FormikHelpers<RestaurantFormValues>,
  ) => {
    try {
      if (restaurant) {
        await updateRestaurant({
          restaurantId: restaurant.id,
          data: values,
        }).unwrap();
        showSuccessNotification({ message: "Ресторан обновлён" });
      } else {
        await createRestaurant(values).unwrap();
        showSuccessNotification({ message: "Ресторан создан" });
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
      initialValues={getInitialValues(restaurant)}
      onSubmit={handleSubmit}
      validationSchema={restaurantFormValidationSchema}
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
                <Button
                  form={RESTAURANT_FORM_ID}
                  loading={pending}
                  type="submit"
                >
                  {isEditing ? "Сохранить" : "Создать ресторан"}
                </Button>
              </>
            }
            closeButtonProps={{ disabled: pending }}
            closeOnClickOutside={!pending}
            closeOnEscape={!pending}
            description={
              isEditing
                ? "Измените данные ресторана и сохраните изменения."
                : "Заполните данные, чтобы добавить ресторан на платформу."
            }
            icon={
              isEditing ? (
                <IconEdit size={22} />
              ) : (
                <IconBuildingStore size={22} />
              )
            }
            onClose={handleClose}
            opened={opened}
            title={isEditing ? "Редактировать ресторан" : "Новый ресторан"}
          >
            <Form
              className="grid gap-md"
              id={RESTAURANT_FORM_ID}
              noValidate
            >
              <InputField
                autoComplete="organization"
                label="Название"
                name="name"
                placeholder="Например, Pizza House"
              />
              <InputField
                autoComplete="off"
                description="Используется в адресе ресторана"
                label="Slug"
                name="slug"
                placeholder="pizza-house"
              />
              <SelectField
                allowDeselect={false}
                data={statusOptions}
                label="Статус"
                name="status"
              />
            </Form>
          </Dialog>
        );
      }}
    </Formik>
  );
};
