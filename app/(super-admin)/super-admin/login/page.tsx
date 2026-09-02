"use client";

import { IconPizza } from "@tabler/icons-react";
import { Field, Form, Formik, type FieldProps } from "formik";
import { useRouter } from "next/navigation";

import { Button, Input, PasswordInput, Typography } from "@/components/ui";
import { showSuccessNotification } from "@/components/ui/notification";
import { ROUTES } from "@/config/routes";
import { advanceAuthSessionRevision } from "@/store/api/axios";
import {
  superAdminApi,
  useLoginSuperAdminMutation,
} from "@/store/api/super-admin.api";
import { saveAuthSession } from "@/store/auth/auth-storage";
import { useAppDispatch } from "@/store/hooks";
import { setAuthUser } from "@/store/slices/auth.slice";

import {
  superAdminLoginInitialValues,
  superAdminLoginValidationSchema,
  type SuperAdminLoginFormValues,
} from "./config";

const SuperAdminLoginPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loginSuperAdmin, { isLoading }] = useLoginSuperAdminMutation();

  const handleSubmit = async (values: SuperAdminLoginFormValues) => {
    try {
      const result = await loginSuperAdmin(values).unwrap();
      advanceAuthSessionRevision();
      saveAuthSession(result);
      dispatch(superAdminApi.util.resetApiState());
      dispatch(setAuthUser(result.user));
      showSuccessNotification({
        message: "Добро пожаловать в панель управления",
      });
      router.replace(ROUTES.SUPER_ADMIN.RESTAURANTS);
    } catch {
      // Axios interceptor displays the API error notification.
    }
  };

  return (
    <main className="grid min-h-screen w-full place-items-center p-md sm:p-xl">
      <section className="w-full max-w-[440px] rounded-2xl border border-border bg-background p-lg shadow-xl sm:p-xl">
        <div className="mb-xl grid justify-items-center gap-sm text-center">
          <span className="grid size-14 place-items-center rounded-full bg-primary-soft text-primary">
            <IconPizza aria-hidden="true" size={30} />
          </span>
          <Typography variant="h2">Вход для Super Admin</Typography>
          <Typography muted variant="bodySm">
            Введите данные глобального администратора платформы
          </Typography>
        </div>

        <Formik
          initialValues={superAdminLoginInitialValues}
          onSubmit={handleSubmit}
          validationSchema={superAdminLoginValidationSchema}
        >
          {({ isSubmitting }) => (
            <Form className="grid gap-lg" noValidate>
              <Field name="email">
                {({ field, meta }: FieldProps<string>) => (
                  <Input
                    {...field}
                    autoComplete="email"
                    error={meta.touched ? meta.error : undefined}
                    label="Email"
                    placeholder="admin@example.com"
                    type="email"
                  />
                )}
              </Field>

              <Field name="password">
                {({ field, meta }: FieldProps<string>) => (
                  <PasswordInput
                    {...field}
                    autoComplete="current-password"
                    error={meta.touched ? meta.error : undefined}
                    label="Пароль"
                    placeholder="Введите пароль"
                  />
                )}
              </Field>

              <Button
                fullWidth
                loading={isSubmitting || isLoading}
                type="submit"
              >
                Войти
              </Button>
            </Form>
          )}
        </Formik>
      </section>
    </main>
  );
};

export default SuperAdminLoginPage;
