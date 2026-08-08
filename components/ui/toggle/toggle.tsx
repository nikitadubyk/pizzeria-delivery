"use client";

import { Switch as MantineSwitch, type SwitchProps } from "@mantine/core";
import {
  cn,
  interactiveMotionTransitionClassName,
  interactiveTransitionClassName,
} from "@/lib/class-names";

const toggleRootClassName = cn(
  "group/toggle cursor-pointer hover:text-primary-hover hover:[&_.mantine-Switch-description]:!text-primary-hover hover:[&_.mantine-Switch-label]:!text-primary-hover hover:[&_.mantine-Switch-track]:!bg-surface-muted has-[input:checked]:hover:[&_.mantine-Switch-track]:!bg-primary-hover has-[input:disabled]:cursor-not-allowed has-[input:disabled]:hover:text-text has-[input:disabled]:hover:[&_.mantine-Switch-description]:!text-muted has-[input:disabled]:hover:[&_.mantine-Switch-label]:!text-text has-[input:disabled]:hover:[&_.mantine-Switch-track]:!bg-[var(--switch-bg)]",
  interactiveTransitionClassName,
);
const toggleSlotClassNames = {
  body: "!cursor-pointer group-has-[input:disabled]/toggle:!cursor-not-allowed",
  description: cn(
    "!cursor-pointer select-none !text-muted group-hover/toggle:!text-primary-hover group-has-[input:disabled]/toggle:!cursor-not-allowed group-has-[input:disabled]/toggle:!text-muted group-has-[input:disabled]/toggle:group-hover/toggle:!text-muted",
    interactiveTransitionClassName,
  ),
  input: "!cursor-pointer disabled:!cursor-not-allowed",
  label: cn(
    "!cursor-pointer select-none group-hover/toggle:!text-primary-hover group-has-[input:disabled]/toggle:!cursor-not-allowed group-has-[input:disabled]/toggle:group-hover/toggle:!text-text",
    interactiveTransitionClassName,
  ),
  labelWrapper:
    "!cursor-pointer group-has-[input:disabled]/toggle:!cursor-not-allowed",
  thumb: cn(
    "group-active/toggle:scale-95 group-has-[input:disabled]/toggle:group-active/toggle:scale-100",
    interactiveMotionTransitionClassName,
  ),
  track: cn(
    "!cursor-pointer group-hover/toggle:!bg-surface-muted group-has-[input:checked]/toggle:group-hover/toggle:!bg-primary-hover group-has-[input:disabled]/toggle:!cursor-not-allowed group-has-[input:disabled]/toggle:group-hover/toggle:!bg-[var(--switch-bg)]",
    interactiveTransitionClassName,
  ),
  trackLabel: "",
};

export function Toggle({ className, classNames, ...props }: SwitchProps) {
  const mergedClassNames =
    typeof classNames === "function"
      ? classNames
      : {
          ...classNames,
          body: cn(toggleSlotClassNames.body, classNames?.body),
          description: cn(
            toggleSlotClassNames.description,
            classNames?.description,
          ),
          input: cn(toggleSlotClassNames.input, classNames?.input),
          label: cn(toggleSlotClassNames.label, classNames?.label),
          labelWrapper: cn(
            toggleSlotClassNames.labelWrapper,
            classNames?.labelWrapper,
          ),
          thumb: cn(toggleSlotClassNames.thumb, classNames?.thumb),
          track: cn(toggleSlotClassNames.track, classNames?.track),
          trackLabel: cn(
            toggleSlotClassNames.trackLabel,
            classNames?.trackLabel,
          ),
        };

  return (
    <MantineSwitch
      className={cn(toggleRootClassName, className)}
      classNames={mergedClassNames}
      size="md"
      {...props}
    />
  );
}
