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
  <main className="h-full min-h-0 w-full p-md md:p-xl">
    <div
      className={cn(
        "mx-auto grid h-full min-h-0 w-full max-w-7xl gap-lg",
        className,
      )}
    >
      {children}
    </div>
  </main>
);
