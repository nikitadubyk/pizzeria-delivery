import type { FieldMetaProps } from "formik";

export const controlError = <Value>(
  meta: FieldMetaProps<Value>,
): string | undefined => (meta.touched ? meta.error : undefined);
