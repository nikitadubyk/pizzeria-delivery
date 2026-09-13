"use client";

import { IconEdit, IconUserPlus } from "@tabler/icons-react";
import {
  Field,
  Form,
  Formik,
  type FieldProps,
  type FormikHelpers,
} from "formik";

import { MIN_PASSWORD_LENGTH } from "@/api-contracts";
import {
  Button,
  Dialog,
  InputField,
  PasswordField,
  PhoneInput,
  SelectField,
  ToggleField,
} from "@/components/ui";
import { showSuccessNotification } from "@/components/ui/notification";
import {
  useCreateRestaurantUserMutation,
  useUpdateRestaurantUserMutation,
} from "@/store/api/super-admin.api";

import {
  getRestaurantOptions,
  getUserFormInitialValues,
  getUserFormValidationSchema,
  USER_FORM_ID,
  userRoleOptions,
} from "./config";
import type { UserFormDialogProps, UserFormValues } from "./types";

export const UserFormDialog = ({
  onClose,
  opened,
  restaurants,
  user,
}: UserFormDialogProps) => {
  const [createUser, { isLoading: isCreating }] =
    useCreateRestaurantUserMutation();
  const [updateUser, { isLoading: isUpdating }] =
    useUpdateRestaurantUserMutation();
  const isEditing = user !== null;
  const isSaving = isCreating || isUpdating;
  const restaurantOptions = getRestaurantOptions(user, restaurants);

  const handleSubmit = async (
    values: UserFormValues,
    { resetForm }: FormikHelpers<UserFormValues>,
  ) => {
    const data = {
      restaurantId: values.restaurantId,
      name: values.name,
      phone: values.phone,
      email: values.email || null,
      role: values.role,
      isActive: values.isActive,
    };

    try {
      if (user) {
        await updateUser({
          userId: user.id,
          data: {
            ...data,
            ...(values.password ? { password: values.password } : {}),
          },
        }).unwrap();
        showSuccessNotification({ message: "Пользователь обновлён" });
      } else {
        await createUser({ ...data, password: values.password }).unwrap();
        showSuccessNotification({ message: "Пользователь создан" });
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
      initialValues={getUserFormInitialValues(user, restaurants)}
      onSubmit={handleSubmit}
      validationSchema={getUserFormValidationSchema(isEditing)}
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
                  form={USER_FORM_ID}
                  loading={pending}
                  type="submit"
                >
                  {isEditing ? "Сохранить" : "Создать пользователя"}
                </Button>
              </>
            }
            closeButtonProps={{ disabled: pending }}
            closeOnClickOutside={!pending}
            closeOnEscape={!pending}
            description={
              isEditing
                ? "Измените данные пользователя ресторана и сохраните изменения."
                : "Добавьте владельца или сотрудника и назначьте ему ресторан."
            }
            icon={
              isEditing ? <IconEdit size={22} /> : <IconUserPlus size={22} />
            }
            onClose={handleClose}
            opened={opened}
            preventInitialFocus
            title={
              isEditing ? "Редактировать пользователя" : "Новый пользователь"
            }
          >
            <Form className="grid gap-md" id={USER_FORM_ID} noValidate>
              <SelectField
                allowDeselect={false}
                data={restaurantOptions}
                label="Ресторан"
                name="restaurantId"
                placeholder="Выберите ресторан"
                searchable
              />
              <InputField
                autoComplete="name"
                label="Имя"
                name="name"
                placeholder="Например, Анна Иванова"
              />
              <Field name="phone">
                {({ field, form, meta }: FieldProps<string>) => (
                  <PhoneInput
                    error={meta.touched ? meta.error : undefined}
                    label="Телефон"
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={(value) =>
                      void form.setFieldValue(field.name, value ?? "")
                    }
                    value={field.value}
                  />
                )}
              </Field>
              <InputField
                autoComplete="email"
                description="Необязательно"
                label="Email"
                name="email"
                placeholder="user@example.com"
                type="email"
              />
              <PasswordField
                name="password"
                autoComplete="new-password"
                description={
                  isEditing
                    ? "Оставьте пустым, чтобы сохранить текущий пароль"
                    : `Не менее ${MIN_PASSWORD_LENGTH} символов`
                }
                label={isEditing ? "Новый пароль" : "Пароль"}
                placeholder={
                  isEditing ? "Не изменять пароль" : "Введите пароль"
                }
              />
              <SelectField
                allowDeselect={false}
                data={userRoleOptions}
                label="Роль"
                name="role"
              />
              <ToggleField
                description="Неактивный пользователь не сможет войти в панель ресторана"
                label="Активный пользователь"
                name="isActive"
              />
            </Form>
          </Dialog>
        );
      }}
    </Formik>
  );
};
