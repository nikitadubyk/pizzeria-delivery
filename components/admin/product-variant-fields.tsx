"use client";

import { IconPlus, IconTrash } from "@tabler/icons-react";
import { FieldArray, useFormikContext } from "formik";

import {
  PRODUCT_VARIANT_NAME_MAX_LENGTH,
  PRODUCT_VARIANT_WEIGHT_MAX_LENGTH,
  PRODUCT_VARIANTS_MAX_COUNT,
} from "@/api-contracts";
import { Button, InputField, ToggleField, Typography } from "@/components/ui";

import { createEmptyProductVariant } from "./product-form-page.config";
import type { ProductFormValues } from "./product-form-page.types";

type ProductVariantFieldsProps = {
  disabled: boolean;
};

export function ProductVariantFields({ disabled }: ProductVariantFieldsProps) {
  const { errors, values } = useFormikContext<ProductFormValues>();

  return (
    <div className="grid gap-md border-t border-border pt-lg">
      <div>
        <Typography variant="h3">Варианты продукта</Typography>
        <Typography muted variant="bodySm">
          Варианты можно не добавлять. Для простой фиксированной цены добавьте
          один вариант без названия.
        </Typography>
      </div>

      <FieldArray name="variants">
        {({ push, remove }) => (
          <div className="grid gap-md">
            {values.variants.map((variant, index) => (
              <div
                className="grid gap-md rounded-lg border border-border bg-surface p-md lg:grid-cols-2 lg:items-start xl:grid-cols-[minmax(10rem,1fr)_minmax(9rem,0.7fr)_minmax(10rem,1fr)_auto]"
                key={variant.id ?? `new-${index}`}
              >
                <InputField
                  autoComplete="off"
                  disabled={disabled}
                  label="Название варианта"
                  maxLength={PRODUCT_VARIANT_NAME_MAX_LENGTH}
                  name={`variants.${index}.name`}
                  placeholder="Например, 30 см"
                />
                <InputField
                  disabled={disabled}
                  inputMode="decimal"
                  label="Цена, ₽"
                  min={0}
                  name={`variants.${index}.price`}
                  step={0.01}
                  type="number"
                />
                <InputField
                  autoComplete="off"
                  disabled={disabled}
                  label="Вес / объём"
                  maxLength={PRODUCT_VARIANT_WEIGHT_MAX_LENGTH}
                  name={`variants.${index}.weight`}
                  placeholder="Например, 520 г или 500 мл"
                />
                <div className="mt-sm flex flex-col gap-sm lg:col-span-2 lg:flex-row lg:items-center lg:justify-between xl:col-span-1 xl:mt-lg xl:items-start xl:justify-start">
                  <ToggleField
                    className="mt-2"
                    disabled={disabled}
                    label="Доступен"
                    name={`variants.${index}.isAvailable`}
                  />
                  <Button
                    aria-label={`Удалить вариант ${index + 1}`}
                    className="w-full min-[769px]:!w-11 min-[769px]:!px-0"
                    disabled={disabled}
                    onClick={() => remove(index)}
                    type="button"
                    variant="danger"
                  >
                    <span className="inline-flex items-center justify-center gap-xs">
                      <IconTrash aria-hidden="true" size={18} />
                      <span className="min-[769px]:sr-only">Удалить</span>
                    </span>
                  </Button>
                </div>
              </div>
            ))}

            {typeof errors.variants === "string" ? (
              <Typography
                className="!text-danger"
                role="alert"
                variant="caption"
              >
                {errors.variants}
              </Typography>
            ) : null}

            <Button
              className="justify-self-start"
              disabled={
                disabled || values.variants.length >= PRODUCT_VARIANTS_MAX_COUNT
              }
              leftSection={<IconPlus aria-hidden="true" size={18} />}
              onClick={() => push(createEmptyProductVariant())}
              type="button"
              variant="secondary"
            >
              Добавить вариант
            </Button>
          </div>
        )}
      </FieldArray>
    </div>
  );
}
