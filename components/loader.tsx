"use client";

import { cn } from "@/lib/class-names";
import { Loader as OverlayLoader } from "./ui/loader";

export type LoaderProps = {
  className?: string;
  label?: string;
};

export function Loader({ className, label = "Загрузка…" }: LoaderProps) {
  return (
    <div
      className={cn("relative grid h-full min-h-40 w-full flex-1 place-items-center", className)}
      role="status"
      aria-label={label}
    >
      <OverlayLoader
        visible
        aria-hidden="true"
        role="presentation"
        overlayProps={{ backgroundOpacity: 0, blur: 0 }}
        zIndex={1}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
