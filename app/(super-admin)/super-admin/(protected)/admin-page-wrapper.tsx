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
  <main className="p-md md:p-xl flex min-h-0 w-full flex-1 flex-col overflow-y-auto overscroll-contain md:h-full md:overflow-hidden">
    <div
      className={cn(
        "gap-lg mx-auto grid min-h-full w-full max-w-7xl md:min-h-0 md:flex-1",
        className
      )}
    >
      {children}
    </div>
  </main>
);
