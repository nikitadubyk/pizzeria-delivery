"use client";

import { IconEdit, IconPlus } from "@tabler/icons-react";
import { Formik, type FormikHelpers } from "formik";
import {
  Button,
  Dialog,
  InputField,
  PriceInputField,
  ToggleField,
} from "@/components/ui";
import {
  addonFormValidationSchema,
  getAddonFormInitialValues,
  getAddonRequestData,
} from "./config";
import type { AddonFormDialogProps, AddonFormValues } from "./types";

export function AddonFormDialog({
  addon,
  opened,
  onClose,
  onCreated,
  onSave,
  isSaving,
}: AddonFormDialogProps) {
  const handleSubmit = async (
    values: AddonFormValues,
    { resetForm, setSubmitting }: FormikHelpers<AddonFormValues>
  ) => {
    const saved = await onSave(addon, getAddonRequestData(values));
    if (saved) {
      if (!addon) onCreated();
      resetForm();
      onClose();
    }
    setSubmitting(false);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={getAddonFormInitialValues(addon)}
      onSubmit={handleSubmit}
      validationSchema={addonFormValidationSchema}
    >
      {({ dirty, handleSubmit, isSubmitting, resetForm }) => {
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
                  loading={pending}
                  type="submit"
                >
                  {addon ? "Сохранить" : "Создать добавку"}
                </Button>
              </>
            }
            closeButtonProps={{ disabled: pending }}
            closeOnClickOutside={!pending}
            closeOnEscape={!pending}
            description="Укажите название, цену и доступность платной добавки."
            icon={addon ? <IconEdit size={22} /> : <IconPlus size={22} />}
            formProps={{ onSubmit: handleSubmit }}
            onClose={handleClose}
            opened={opened}
            preventInitialFocus
            title={addon ? "Редактировать добавку" : "Новая добавка"}
          >
            <div className="gap-md grid">
              <InputField
                autoComplete="off"
                disabled={pending}
                label="Название"
                name="name"
                placeholder="Например, Моцарелла"
              />
              <PriceInputField
                disabled={pending}
                label="Цена, ₽"
                name="price"
              />
              <ToggleField
                disabled={pending}
                label="Доступна для заказа"
                name="isAvailable"
              />
            </div>
          </Dialog>
        );
      }}
    </Formik>
  );
}
