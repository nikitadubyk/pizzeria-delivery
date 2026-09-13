"use client";

import { IconBuildingStore, IconEdit } from "@tabler/icons-react";
import { Form, Formik, type FormikHelpers } from "formik";

import { Button, Dialog, InputField, SelectField } from "@/components/ui";
import { showSuccessNotification } from "@/components/ui/notification";
import {
  useCreateRestaurantMutation,
  useUpdateRestaurantMutation,
} from "@/store/api/super-admin.api";

import {
  getRestaurantFormInitialValues,
  RESTAURANT_FORM_ID,
  restaurantFormValidationSchema,
  restaurantStatusOptions,
} from "./restaurant-form-dialog.config";
import type {
  RestaurantFormDialogProps,
  RestaurantFormValues,
} from "./restaurant-form-dialog.types";

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
      initialValues={getRestaurantFormInitialValues(restaurant)}
      onSubmit={handleSubmit}
      validationSchema={restaurantFormValidationSchema}
    >
      {({ dirty, isSubmitting, resetForm }) => {
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
                  disabled={!dirty || pending}
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
            preventInitialFocus
            title={isEditing ? "Редактировать ресторан" : "Новый ресторан"}
          >
            <Form className="grid gap-md" id={RESTAURANT_FORM_ID} noValidate>
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
                data={restaurantStatusOptions}
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
