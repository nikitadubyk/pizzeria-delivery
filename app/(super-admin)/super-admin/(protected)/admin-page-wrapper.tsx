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
  <main className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto overscroll-contain p-md md:h-full md:overflow-hidden md:p-xl">
    <div
      className={cn(
        "mx-auto grid min-h-full w-full max-w-7xl gap-lg md:min-h-0 md:flex-1",
        className,
      )}
    >
      {children}
    </div>
  </main>
);
