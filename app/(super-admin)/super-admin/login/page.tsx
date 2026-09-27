"use client";

import { IconPizza } from "@tabler/icons-react";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";

import { Button, InputField, PasswordField, Typography } from "@/components/ui";
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
} from "./config";
import type { SuperAdminLoginFormValues } from "./types";

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
    <main className="p-md sm:p-xl grid min-h-screen w-full place-items-center">
      <section className="border-border bg-background p-lg sm:p-xl w-full max-w-[440px] rounded-2xl border shadow-xl">
        <div className="mb-xl gap-sm grid justify-items-center text-center">
          <span className="bg-primary-soft text-primary grid size-14 place-items-center rounded-full">
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
            <Form className="gap-lg grid" noValidate>
              <InputField
                name="email"
                autoComplete="email"
                label="Email"
                placeholder="admin@example.com"
                type="email"
              />

              <PasswordField
                name="password"
                autoComplete="current-password"
                label="Пароль"
                placeholder="Введите пароль"
              />

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
