"use client";

import { IconEdit, IconUserPlus } from "@tabler/icons-react";
import { Formik, type FormikHelpers } from "formik";

import { MIN_PASSWORD_LENGTH } from "@/api-contracts";
import {
  Button,
  Dialog,
  InputField,
  PasswordField,
  PhoneInputField,
} from "@/components/ui";
import { showSuccessNotification } from "@/components/ui/notification";
import { Details } from "@/components/details";
import {
  useCreateEmployeeMutation,
  useGetEmployeeQuery,
  useUpdateEmployeeMutation,
} from "@/store/api/employees.api";

import {
  getEmployeeFormInitialValues,
  getEmployeeFormValidationSchema,
} from "./config";
import type { EmployeeFormDialogProps, EmployeeFormValues } from "./types";

export function EmployeeFormDialog({
  employeeId,
  onClose,
  onCreated,
  opened,
}: EmployeeFormDialogProps) {
  const [createEmployee, { isLoading: isCreating }] =
    useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating }] =
    useUpdateEmployeeMutation();
  const isEditing = employeeId !== null;
  const query = useGetEmployeeQuery(
    { employeeId: employeeId ?? "" },
    { skip: !employeeId }
  );
  const employee = query.currentData;

  const handleSubmit = async (
    values: EmployeeFormValues,
    { resetForm }: FormikHelpers<EmployeeFormValues>
  ) => {
    const profile = {
      name: values.name.trim(),
      phone: values.phone,
      email: values.email.trim() || null,
    };

    try {
      if (employee) {
        await updateEmployee({
          employeeId: employee.id,
          data: profile,
        }).unwrap();
        showSuccessNotification({ message: "Данные сотрудника обновлены" });
      } else {
        await createEmployee({
          ...profile,
          password: values.password,
        }).unwrap();
        showSuccessNotification({ message: "Сотрудник создан" });
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
      initialValues={getEmployeeFormInitialValues(employee ?? null)}
      onSubmit={handleSubmit}
      validationSchema={getEmployeeFormValidationSchema(isEditing)}
    >
      {({ dirty, handleSubmit, isSubmitting, resetForm }) => {
        const pending =
          isSubmitting ||
          isCreating ||
          isUpdating ||
          query.isLoading ||
          query.isFetching;
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
                  loading={pending}
                  type="submit"
                >
                  {isEditing ? "Сохранить" : "Создать сотрудника"}
                </Button>
              </>
            }
            closeButtonProps={{ disabled: pending }}
            closeOnClickOutside={!pending}
            closeOnEscape={!pending}
            description={
              isEditing
                ? "Измените имя и контакты сотрудника."
                : "Создайте учётную запись сотрудника вашего ресторана."
            }
            icon={
              isEditing ? <IconEdit size={22} /> : <IconUserPlus size={22} />
            }
            formProps={{ onSubmit: handleSubmit }}
            onClose={handleClose}
            opened={opened}
            preventInitialFocus
            title={isEditing ? "Редактировать сотрудника" : "Новый сотрудник"}
          >
            <Details
              className={isEditing ? "min-h-48" : undefined}
              errorMessage="Не удалось загрузить сотрудника"
              query={query}
            >
              {!isEditing || employee ? (
                <div className="gap-md grid">
                  <InputField
                    autoComplete="name"
                    label="Имя"
                    name="name"
                    placeholder="Например, Анна Иванова"
                  />
                  <PhoneInputField label="Телефон" name="phone" />
                  <InputField
                    autoComplete="email"
                    description="Необязательно"
                    label="Email"
                    name="email"
                    placeholder="employee@example.com"
                    type="email"
                  />
                  {!isEditing ? (
                    <PasswordField
                      autoComplete="new-password"
                      description={`Не менее ${MIN_PASSWORD_LENGTH} символов`}
                      label="Пароль"
                      name="password"
                      placeholder="Введите пароль"
                    />
                  ) : null}
                </div>
              ) : null}
            </Details>
          </Dialog>
        );
      }}
    </Formik>
  );
}
