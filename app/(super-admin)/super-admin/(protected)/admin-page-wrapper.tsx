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
  <main className="w-full p-lg sm:p-xl">
    <div className={cn("mx-auto grid w-full max-w-7xl gap-lg", className)}>
      {children}
    </div>
  </main>
);
