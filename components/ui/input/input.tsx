"use client";

import {
  PasswordInput as MantinePasswordInput,
  TextInput as MantineTextInput,
  type PasswordInputProps,
  type TextInputProps,
} from "@mantine/core";
import { cn, interactiveMotionTransitionClassName } from "@/lib/class-names";

export type AppInputProps = TextInputProps;
export type AppPasswordInputProps = PasswordInputProps;

const inputClassName =
  cn(
    "min-h-11 w-full min-w-0 !cursor-text !border-border !bg-background !text-text hover:!border-primary-hover hover:!bg-primary-soft focus:!border-primary-active focus:!shadow-[0_0_0_2px_var(--app-color-primary-soft)] disabled:!cursor-not-allowed disabled:hover:!border-border disabled:hover:!bg-background",
    interactiveMotionTransitionClassName,
  );
const inputSlotClassNames = {
  error: "!text-danger",
  input: inputClassName,
  label: "font-extrabold leading-snug !text-text",
  root: "w-full min-w-0",
  section: "text-muted",
  wrapper: "w-full min-w-0",
};

export function Input({ className, classNames, ...props }: AppInputProps) {
  const mergedClassNames =
    typeof classNames === "function"
      ? classNames
      : {
          ...classNames,
          error: cn(inputSlotClassNames.error, classNames?.error),
          input: cn(inputSlotClassNames.input, classNames?.input),
          label: cn(inputSlotClassNames.label, classNames?.label),
          root: cn(inputSlotClassNames.root, classNames?.root),
          section: cn(inputSlotClassNames.section, classNames?.section),
          wrapper: cn(inputSlotClassNames.wrapper, classNames?.wrapper),
        };

  return (
    <MantineTextInput
      className={cn("w-full min-w-0", className)}
      classNames={mergedClassNames}
      {...props}
    />
  );
}

export function PasswordInput({
  className,
  classNames,
  ...props
}: AppPasswordInputProps) {
  const mergedClassNames =
    typeof classNames === "function"
      ? classNames
      : {
          ...classNames,
          error: cn(inputSlotClassNames.error, classNames?.error),
          input: cn(inputSlotClassNames.input, classNames?.input),
          label: cn(inputSlotClassNames.label, classNames?.label),
          root: cn(inputSlotClassNames.root, classNames?.root),
          section: cn(inputSlotClassNames.section, classNames?.section),
          visibilityToggle: cn(
            "cursor-pointer hover:bg-primary-soft active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-active",
            interactiveMotionTransitionClassName,
            classNames?.visibilityToggle,
          ),
          wrapper: cn(inputSlotClassNames.wrapper, classNames?.wrapper),
        };

  return (
    <MantinePasswordInput
      className={cn("w-full min-w-0", className)}
      classNames={mergedClassNames}
      {...props}
    />
  );
}
