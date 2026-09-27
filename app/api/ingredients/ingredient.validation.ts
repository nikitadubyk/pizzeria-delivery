import {
  INGREDIENT_LIST_DEFAULT_LIMIT,
  INGREDIENT_LIST_MAX_LIMIT,
  INGREDIENT_NAME_MAX_LENGTH,
} from "@/api-contracts";
import { createSearchPaginationSchema } from "@/app/api/common/list-query";
import * as yup from "yup";

const nameSchema = yup
  .string()
  .trim()
  .max(
    INGREDIENT_NAME_MAX_LENGTH,
    `Название не должно превышать ${INGREDIENT_NAME_MAX_LENGTH} символов`
  )
  .required("Название ингредиента обязательно");

export const ingredientListQuerySchema = createSearchPaginationSchema({
  defaultLimit: INGREDIENT_LIST_DEFAULT_LIMIT,
  maxLimit: INGREDIENT_LIST_MAX_LIMIT,
});
export const ingredientPathParamsSchema = yup.object({
  ingredientId: yup
    .string()
    .trim()
    .required("Идентификатор ингредиента обязателен"),
});
export const createIngredientRequestSchema = yup.object({ name: nameSchema });
export const updateIngredientRequestSchema = yup
  .object({ name: nameSchema.optional() })
  .test(
    "at-least-one-field",
    "Передайте хотя бы одно поле для обновления",
    (value) => value.name !== undefined
  );
