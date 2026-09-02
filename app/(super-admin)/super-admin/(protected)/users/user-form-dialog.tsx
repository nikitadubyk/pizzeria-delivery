"use client";

import { IconEdit, IconUserPlus } from "@tabler/icons-react";
import {
  Field,
  Form,
  Formik,
  type FieldProps,
  type FormikHelpers,
} from "formik";
import * as yup from "yup";

import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  RESTAURANT_USER_ROLES,
  USER_EMAIL_MAX_LENGTH,
  USER_NAME_MAX_LENGTH,
  USER_PHONE_PATTERN,
  type RestaurantDto,
  type RestaurantUserDto,
  type RestaurantUserRole,
} from "@/api-contracts";
import {
  Button,
  Dialog,
  InputField,
  PasswordInput,
  PhoneInput,
  SelectField,
  ToggleField,
} from "@/components/ui";
import { showSuccessNotification } from "@/components/ui/notification";
import {
  useCreateRestaurantUserMutation,
  useUpdateRestaurantUserMutation,
} from "@/store/api/super-admin.api";

const USER_FORM_ID = "restaurant-user-form";

type UserFormValues = {
  restaurantId: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  role: RestaurantUserRole;
  isActive: boolean;
};

type UserFormDialogProps = {
  onClose: () => void;
  opened: boolean;
  restaurants: readonly RestaurantDto[];
  user: RestaurantUserDto | null;
};

const roleOptions: { label: string; value: RestaurantUserRole }[] = [
  { label: "Владелец", value: "OWNER" },
  { label: "Сотрудник", value: "EMPLOYEE" },
];

const createUserValidationSchema = (isEditing: boolean) =>
  yup.object({
    restaurantId: yup.string().trim().required("Выберите ресторан"),
    name: yup
      .string()
      .trim()
      .max(
        USER_NAME_MAX_LENGTH,
        `Имя не должно превышать ${USER_NAME_MAX_LENGTH} символов`,
      )
      .required("Введите имя пользователя"),
    phone: yup
      .string()
      .matches(USER_PHONE_PATTERN, "Введите корректный номер телефона")
      .required("Введите телефон"),
    email: yup
      .string()
      .trim()
      .lowercase()
      .email("Введите корректный email")
      .max(
        USER_EMAIL_MAX_LENGTH,
        `Email не должен превышать ${USER_EMAIL_MAX_LENGTH} символов`,
      ),
    password: yup
      .string()
      .max(
        MAX_PASSWORD_LENGTH,
        `Пароль не должен превышать ${MAX_PASSWORD_LENGTH} символов`,
      )
      .test(
        "password-required-or-long-enough",
        `Пароль должен содержать не менее ${MIN_PASSWORD_LENGTH} символов`,
        (value) =>
          isEditing
            ? !value || value.length >= MIN_PASSWORD_LENGTH
            : Boolean(value && value.length >= MIN_PASSWORD_LENGTH),
      ),
    role: yup
      .mixed<RestaurantUserRole>()
      .oneOf(RESTAURANT_USER_ROLES, "Выберите корректную роль")
      .required("Выберите роль"),
    isActive: yup.boolean().required(),
  });

const getInitialValues = (
  user: RestaurantUserDto | null,
  restaurants: readonly RestaurantDto[],
): UserFormValues => ({
  restaurantId: user?.restaurantId ?? restaurants[0]?.id ?? "",
  name: user?.name ?? "",
  phone: user?.phone ?? "",
  email: user?.email ?? "",
  password: "",
  role: user?.role ?? "EMPLOYEE",
  isActive: user?.isActive ?? true,
});

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
  const restaurantOptions = [
    ...restaurants.map((restaurant) => ({
      label: restaurant.name,
      value: restaurant.id,
    })),
    ...(user &&
    !restaurants.some((restaurant) => restaurant.id === user.restaurantId)
      ? [{ label: user.restaurant.name, value: user.restaurantId }]
      : []),
  ];

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
      initialValues={getInitialValues(user, restaurants)}
      onSubmit={handleSubmit}
      validationSchema={createUserValidationSchema(isEditing)}
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
                <Button form={USER_FORM_ID} loading={pending} type="submit">
                  {isEditing ? "Сохранить" : "Создать пользователя"}
                </Button>
              </>
            }
            closeButtonProps={{ disabled: pending }}
            classNames={{ content: "!overflow-hidden" }}
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
            title={
              isEditing ? "Редактировать пользователя" : "Новый пользователь"
            }
          >
            <Form
              className="grid max-h-[calc(100dvh-24rem)] min-h-0 gap-md overflow-y-auto overscroll-contain pr-xs md:max-h-[calc(100dvh-21rem)]"
              id={USER_FORM_ID}
              noValidate
              style={{ scrollbarGutter: "stable" }}
            >
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
              <Field name="password">
                {({ field, meta }: FieldProps<string>) => (
                  <PasswordInput
                    {...field}
                    autoComplete="new-password"
                    description={
                      isEditing
                        ? "Оставьте пустым, чтобы сохранить текущий пароль"
                        : `Не менее ${MIN_PASSWORD_LENGTH} символов`
                    }
                    error={meta.touched ? meta.error : undefined}
                    label={isEditing ? "Новый пароль" : "Пароль"}
                    placeholder={
                      isEditing ? "Не изменять пароль" : "Введите пароль"
                    }
                  />
                )}
              </Field>
              <SelectField
                allowDeselect={false}
                data={roleOptions}
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
