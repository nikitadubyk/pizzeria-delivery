import { ApiError, HttpStatus } from "@/app/api/common/api-response";
import type { Schema } from "yup";
import { ValidationError } from "yup";

export const validateRequestData = async <T>(
  value: unknown,
  schema: Schema<T>,
  errorStatus = HttpStatus.BAD_REQUEST,
): Promise<T> => {
  try {
    return await schema.validate(value, {
      abortEarly: false,
      stripUnknown: true,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ApiError(error.errors[0] ?? "Некорректные данные", errorStatus);
    }

    throw error;
  }
};

export const validateRequestBody = async <T>(
  request: Request,
  schema: Schema<T>,
): Promise<T> => validateRequestData<T>(await request.json(), schema);

export const validateRouteParams = <T>(
  params: unknown,
  schema: Schema<T>,
): Promise<T> => validateRequestData<T>(params, schema);
