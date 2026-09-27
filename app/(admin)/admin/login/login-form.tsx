"use client";

import { useEffect, useRef } from "react";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/hooks";
import { Alert } from "@mantine/core";
import { MAX_PASSWORD_LENGTH, USER_EMAIL_MAX_LENGTH } from "@/api-contracts";
import { Button, InputField, PasswordField, Typography } from "@/components/ui";
import { ROUTES } from "@/config/routes";
import { getApiErrorMessage } from "@/store/api/error";
import {
  restaurantAuthApi,
  useLoginRestaurantMutation,
} from "@/store/api/restaurant-auth.api";
import { saveRestaurantToken } from "@/store/auth/restaurant-auth-storage";
import { setRestaurantToken } from "@/store/slices/restaurant-auth.slice";
import {
  restaurantLoginInitialValues,
  restaurantLoginValidationSchema,
} from "./config";

export function RestaurantLoginForm() {
  const router = useRouter();
  const store = useAppStore();
  const [loginRestaurant, { isLoading }] = useLoginRestaurantMutation();
  const activeRequest = useRef<ReturnType<typeof loginRestaurant> | null>(null);

  useEffect(
    () => () => {
      activeRequest.current?.abort();
      activeRequest.current = null;
    },
    []
  );

  return (
    <main className="p-md sm:p-xl grid min-h-dvh place-items-center">
      <section className="border-border bg-background p-lg sm:p-xl w-full max-w-[440px] rounded-2xl border shadow-xl">
        <div className="mb-xl gap-sm grid">
          <Typography variant="h2">Вход в ресторан</Typography>
          <Typography muted>Для владельцев и сотрудников пиццерии</Typography>
        </div>
        <Formik
          initialValues={restaurantLoginInitialValues}
          validationSchema={restaurantLoginValidationSchema}
          onSubmit={async (values, { setStatus }) => {
            const revision = store.getState().restaurantAuth.revision;
            setStatus(undefined);
            const request = loginRestaurant({
              ...values,
              login: values.login.trim(),
            });
            activeRequest.current = request;
            try {
              const { accessToken } = await request.unwrap();
              if (
                activeRequest.current !== request ||
                store.getState().restaurantAuth.revision !== revision
              )
                return;
              saveRestaurantToken(accessToken);
              store.dispatch(restaurantAuthApi.util.resetApiState());
              store.dispatch(setRestaurantToken(accessToken));
              router.replace(ROUTES.ADMIN.ROOT);
            } catch (error) {
              if (
                activeRequest.current !== request ||
                store.getState().restaurantAuth.revision !== revision
              )
                return;
              setStatus(
                getApiErrorMessage(
                  error,
                  "Не удалось выполнить вход. Попробуйте позже."
                )
              );
            } finally {
              if (activeRequest.current === request)
                activeRequest.current = null;
            }
          }}
        >
          {({ isSubmitting, status }) => (
            <Form className="gap-lg grid" noValidate>
              {typeof status === "string" && (
                <Alert color="red" role="alert">
                  {status}
                </Alert>
              )}
              <InputField
                name="login"
                label="Email или телефон"
                placeholder="Email или телефон"
                autoComplete="username"
                required
                maxLength={USER_EMAIL_MAX_LENGTH}
              />
              <PasswordField
                name="password"
                label="Пароль"
                autoComplete="current-password"
                required
                maxLength={MAX_PASSWORD_LENGTH}
              />
              <Button
                type="submit"
                fullWidth
                loading={isSubmitting || isLoading}
              >
                Войти
              </Button>
              <Typography muted variant="bodySm">
                Нет доступа? Обратитесь к владельцу ресторана. Владельцу поможет
                администратор платформы.
              </Typography>
            </Form>
          )}
        </Formik>
      </section>
    </main>
  );
}
