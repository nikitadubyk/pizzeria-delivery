import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/class-names";

export type PageContainerProps = ComponentPropsWithoutRef<"div">;

export function PageContainer({ className, ...props }: PageContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-4 sm:px-5 lg:px-6", className)}
      {...props}
    />
  );
}
