"use client";

import {
  Textarea as MantineTextarea,
  type TextareaProps,
} from "@mantine/core";
import { cn, interactiveMotionTransitionClassName } from "@/lib/class-names";

const textareaClassName =
  cn(
    "hover:border-primary-hover focus:border-primary-active focus:ring-2 focus:ring-primary-soft focus:ring-offset-0 disabled:cursor-not-allowed",
    interactiveMotionTransitionClassName,
  );

export function Textarea({ classNames, ...props }: TextareaProps) {
  const mergedClassNames =
    typeof classNames === "function"
      ? classNames
      : {
          ...classNames,
          input: cn(textareaClassName, classNames?.input),
        };

  return <MantineTextarea classNames={mergedClassNames} minRows={4} {...props} />;
}
