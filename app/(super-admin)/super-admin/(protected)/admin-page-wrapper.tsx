import type { ReactNode } from "react";

import { cn } from "@/lib/class-names";

type AdminPageWrapperProps = {
  children: ReactNode;
  className?: string;
};

export const AdminPageWrapper = ({
  children,
  className,
}: AdminPageWrapperProps) => (
  <main className="flex h-full min-h-0 w-full flex-col overflow-hidden p-md md:p-xl">
    <div
      className={cn(
        "mx-auto grid min-h-0 w-full max-w-7xl flex-1 gap-lg",
        className,
      )}
    >
      {children}
    </div>
  </main>
);
