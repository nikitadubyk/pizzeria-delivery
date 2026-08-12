"use client";

import {
  Modal as MantineModal,
  type ModalProps as MantineModalProps,
} from "@mantine/core";
import { cn, interactiveMotionTransitionClassName } from "@/lib/class-names";
import type { ReactNode } from "react";

export type AppDialogTone =
  | "primary"
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "failed"
  | "neutral";

export type AppDialogProps = Omit<
  MantineModalProps,
  "children" | "title"
> & {
  actions?: ReactNode;
  children?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  title?: ReactNode;
  tone?: AppDialogTone;
  withAccent?: boolean;
};

const toneClassNames: Record<
  AppDialogTone,
  {
    accent: string;
    icon: string;
  }
> = {
  danger: {
    accent: "bg-danger",
    icon: "border-danger-soft bg-danger-soft text-danger-active",
  },
  failed: {
    accent: "bg-failed",
    icon: "border-failed-soft bg-failed-soft text-failed-active",
  },
  info: {
    accent: "bg-info",
    icon: "border-info-soft bg-info-soft text-info-active",
  },
  neutral: {
    accent: "bg-secondary",
    icon: "border-secondary-soft bg-secondary-soft text-secondary-active",
  },
  primary: {
    accent: "bg-primary",
    icon: "border-primary-soft bg-primary-soft text-primary-active",
  },
  success: {
    accent: "bg-success",
    icon: "border-success-soft bg-success-soft text-success-active",
  },
  warning: {
    accent: "bg-warning",
    icon: "border-warning-soft bg-warning-soft text-warning-active",
  },
};

const dialogSlotClassNames = {
  body: "!px-5 !pb-5 !pt-0 sm:!px-6 sm:!pb-6",
  close: cn(
    "!cursor-pointer !rounded-full !text-muted hover:!bg-primary-soft hover:!text-primary-active active:!scale-95 focus-visible:!outline focus-visible:!outline-2 focus-visible:!outline-offset-2 focus-visible:!outline-primary-active",
    interactiveMotionTransitionClassName,
  ),
  content:
    "!overflow-hidden !border !border-border !bg-background !text-text shadow-[0_24px_60px_rgb(36_25_17_/_18%)]",
  header:
    "!items-start !gap-sm !border-b !border-border !bg-background !px-5 !py-4 sm:!px-6",
  title: "!min-w-0 !text-lg !font-extrabold !leading-snug !text-text",
};

export function Dialog({
  actions,
  children,
  className,
  classNames,
  closeButtonProps,
  description,
  icon,
  overlayProps,
  title,
  tone = "primary",
  withAccent = true,
  ...props
}: AppDialogProps) {
  const mergedClassNames =
    typeof classNames === "function"
      ? classNames
      : {
          ...classNames,
          body: cn(dialogSlotClassNames.body, classNames?.body),
          close: cn(dialogSlotClassNames.close, classNames?.close),
          content: cn(dialogSlotClassNames.content, classNames?.content),
          header: cn(dialogSlotClassNames.header, classNames?.header),
          title: cn(dialogSlotClassNames.title, classNames?.title),
        };

  const renderedTitle = title ? (
    <span className="flex min-w-0 items-center gap-sm">
      {icon ? (
        <span
          aria-hidden="true"
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-full border",
            toneClassNames[tone].icon,
          )}
        >
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 truncate">{title}</span>
    </span>
  ) : undefined;

  return (
    <MantineModal
      centered
      className={className}
      classNames={mergedClassNames}
      closeButtonProps={{
        "aria-label": "Закрыть диалог",
        ...closeButtonProps,
      }}
      overlayProps={{
        backgroundOpacity: 0.42,
        blur: 4,
        ...overlayProps,
      }}
      radius="xl"
      size="md"
      title={renderedTitle}
      {...props}
    >
      {withAccent ? (
        <div
          aria-hidden="true"
          className={cn("-mx-5 mb-5 h-1 sm:-mx-6", toneClassNames[tone].accent)}
        />
      ) : null}

      <div className="grid min-w-0 gap-md">
        {description ? (
          <p className="m-0 text-sm leading-snug text-muted">{description}</p>
        ) : null}

        {children ? <div className="min-w-0 text-text">{children}</div> : null}

        {actions ? (
          <div className="flex flex-col-reverse gap-2 border-t border-border pt-md [&>*]:max-w-full sm:flex-row sm:flex-wrap sm:justify-end">
            {actions}
          </div>
        ) : null}
      </div>
    </MantineModal>
  );
}
