"use client";

import { IconDeviceFloppy, IconTruckDelivery } from "@tabler/icons-react";
import { Form, Formik, type FormikHelpers } from "formik";

import { RestaurantPermissionPage } from "@/components/admin/restaurant-permission-gate";
import { Details } from "@/components/details";
import { Button, PriceInputField, Typography } from "@/components/ui";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/components/ui/notification";
import { RESTAURANT_PERMISSION as P } from "@/lib/auth/restaurant-permissions";
import { getApiErrorMessage } from "@/store/api/error";
import {
  useGetRestaurantSettingsQuery,
  useUpdateRestaurantSettingsMutation,
} from "@/store/api/restaurant-settings.api";

import {
  getRestaurantSettingsFormInitialValues,
  getRestaurantSettingsRequest,
  restaurantSettingsFormValidationSchema,
} from "./config";
import type { RestaurantSettingsFormValues } from "./types";

export default function SettingsPage() {
  const {
    data: settings,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetRestaurantSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] =
    useUpdateRestaurantSettingsMutation();

  const handleSubmit = async (
    values: RestaurantSettingsFormValues,
    helpers: FormikHelpers<RestaurantSettingsFormValues>
  ) => {
    try {
      const updatedSettings = await updateSettings(
        getRestaurantSettingsRequest(values)
      ).unwrap();

      helpers.resetForm({
        values: getRestaurantSettingsFormInitialValues(updatedSettings),
      });
      showSuccessNotification({ message: "Цена доставки сохранена" });
    } catch (error) {
      showErrorNotification({
        message: getApiErrorMessage(
          error,
          "Не удалось сохранить цену доставки"
        ),
      });
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <RestaurantPermissionPage permission={P.SETTINGS_MANAGE}>
      <section className="gap-lg grid w-full content-start">
        <div>
          <Typography muted variant="eyebrow">
            Управление рестораном
          </Typography>
          <Typography className="!text-2xl sm:!text-4xl" variant="h1">
            Настройки
          </Typography>
        </div>

        <Details
          className="min-h-72 w-full"
          errorMessage="Не удалось загрузить настройки"
          isError={isError}
          isFetching={isFetching}
          isLoading={isLoading}
          onRetry={refetch}
        >
          {settings ? (
            <Formik
              enableReinitialize
              initialValues={getRestaurantSettingsFormInitialValues(settings)}
              onSubmit={handleSubmit}
              validationSchema={restaurantSettingsFormValidationSchema}
            >
              {({ dirty, isSubmitting }) => {
                const pending = isSubmitting || isSaving;

                return (
                  <Form
                    className="gap-lg border-border bg-background p-md sm:p-lg grid w-full rounded-xl border"
                    noValidate
                  >
                    <div className="gap-md flex items-start">
                      <div className="bg-primary-soft text-primary-active grid size-11 shrink-0 place-items-center rounded-xl">
                        <IconTruckDelivery aria-hidden="true" size={24} />
                      </div>
                      <div className="gap-xs grid">
                        <Typography variant="h3">Доставка</Typography>
                        <Typography muted variant="bodySm">
                          Укажите фиксированную стоимость доставки. Значение 0 ₽
                          означает бесплатную доставку.
                        </Typography>
                      </div>
                    </div>

                    <PriceInputField
                      autoComplete="off"
                      disabled={pending}
                      label="Цена доставки, ₽"
                      name="deliveryPrice"
                      placeholder="Например, 300"
                    />

                    <div className="border-border pt-md flex justify-end border-t">
                      <Button
                        disabled={!dirty || pending}
                        leftSection={
                          <IconDeviceFloppy aria-hidden="true" size={18} />
                        }
                        loading={pending}
                        type="submit"
                      >
                        Сохранить
                      </Button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          ) : null}
        </Details>
      </section>
    </RestaurantPermissionPage>
  );
}
