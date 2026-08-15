import { parseDigit, templateFormatter, templateParser } from "input-format";
import { cn, interactiveMotionTransitionClassName } from "@/lib/class-names";

import { PhoneInputValue } from "./types";

export const phoneInputRootClassName = cn(
  "h-11 w-full min-w-0 rounded-xl border border-border bg-background px-3 text-md text-text outline-none placeholder:text-muted hover:border-primary-hover hover:bg-primary-soft focus:border-primary-active focus:shadow-[0_0_0_2px_var(--app-color-primary-soft)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-border disabled:hover:bg-background",
  interactiveMotionTransitionClassName,
);

export const wrapperClassNames = {
  description: "!mb-3 text-sm leading-snug !text-muted",
  error: "!text-danger",
  label: "mb-1 font-extrabold leading-snug !text-text",
  root: "w-full min-w-0",
};

export const russianPhoneTemplate = "+7 (xxx) xxx-xx-xx";
export const formatRussianPhone = templateFormatter(russianPhoneTemplate);
export const parseRussianPhone = templateParser(
  russianPhoneTemplate,
  (character, value) => {
    const digit = parseDigit(character);

    if (value.length === 0 && (digit === "7" || digit === "8")) {
      return undefined;
    }

    return digit;
  },
);

export function getRussianNationalNumber(value?: PhoneInputValue | string) {
  const digits = value?.replace(/\D/g, "") ?? "";
  const nationalDigits =
    digits.startsWith("7") || digits.startsWith("8") ? digits.slice(1) : digits;

  return nationalDigits.slice(0, 10);
}
