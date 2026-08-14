"use client";

import { cn, interactiveMotionTransitionClassName } from "@/lib/class-names";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

export type CategoryTabItem = {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
};

export type CategoryTabsProps = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children" | "onChange"
> & {
  activeId?: string;
  items: CategoryTabItem[];
  offset?: number;
  onChange?: (id: string) => void;
  sticky?: boolean;
  stickyTop?: number;
};

function getVisibleCategoryId(items: CategoryTabItem[], offset: number) {
  const scrollingElement =
    document.scrollingElement ?? document.documentElement;

  if (
    scrollingElement.scrollTop + window.innerHeight >=
    scrollingElement.scrollHeight - 1
  ) {
    return items.at(-1)?.id;
  }

  const viewportMarker = offset + 1;
  let activeId = items[0]?.id;

  for (const item of items) {
    const element = document.getElementById(item.id);

    if (element && element.getBoundingClientRect().top <= viewportMarker) {
      activeId = item.id;
    }
  }

  return activeId;
}

export function CategoryTabs({
  activeId,
  className,
  items,
  offset = 96,
  onChange,
  sticky = true,
  stickyTop = 0,
  ...props
}: CategoryTabsProps) {
  const [internalActiveId, setInternalActiveId] = useState(
    activeId ?? items[0]?.id,
  );
  const tabsListRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const resolvedActiveId = activeId ?? internalActiveId;

  useEffect(() => {
    const tabsList = tabsListRef.current;
    const activeTab = resolvedActiveId
      ? tabRefs.current[resolvedActiveId]
      : null;

    if (!tabsList || !activeTab) {
      return;
    }

    tabsList.scrollTo({
      behavior: "smooth",
      left:
        activeTab.offsetLeft -
        (tabsList.clientWidth - activeTab.clientWidth) / 2,
    });
  }, [resolvedActiveId]);

  useEffect(() => {
    if (!items.length) {
      return;
    }

    const handleScroll = () => {
      const nextActiveId = getVisibleCategoryId(items, offset);

      if (nextActiveId && nextActiveId !== resolvedActiveId) {
        setInternalActiveId(nextActiveId);
        onChange?.(nextActiveId);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [items, offset, onChange, resolvedActiveId]);

  const handleTabClick = (id: string) => {
    const element = document.getElementById(id);

    setInternalActiveId(id);
    onChange?.(id);

    if (!element) {
      return;
    }

    const scrollingElement =
      document.scrollingElement ?? document.documentElement;
    const currentScrollTop = scrollingElement.scrollTop;
    const top =
      element.getBoundingClientRect().top +
      currentScrollTop -
      Math.max(offset, 0);

    scrollingElement.scrollTo({
      behavior: "smooth",
      top,
    });
  };

  return (
    <nav
      aria-label="Категории меню"
      className={cn(
        "z-20 w-full min-w-0 bg-background/95 py-2 backdrop-blur supports-backdrop-filter:bg-background/85",
        sticky && "sticky",
        className,
      )}
      {...props}
      style={{ ...props.style, top: sticky ? stickyTop : props.style?.top }}
    >
      <div
        className="flex min-w-0 gap-2 overflow-x-auto overscroll-x-contain px-1 py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        ref={tabsListRef}
      >
        {items.map((item) => {
          const isActive = item.id === resolvedActiveId;

          return (
            <button
              key={item.id}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-extrabold leading-none text-text shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-active hover:-translate-y-px hover:border-primary-hover hover:bg-primary-soft hover:text-primary-active active:translate-y-0 active:border-primary-active",
                isActive &&
                  "border-primary bg-primary text-primary-contrast hover:border-primary hover:bg-primary hover:text-primary-contrast",
                interactiveMotionTransitionClassName,
              )}
              onClick={() => handleTabClick(item.id)}
              ref={(node) => {
                tabRefs.current[item.id] = node;
              }}
              type="button"
            >
              {item.icon ? (
                <span aria-hidden="true" className="shrink-0">
                  {item.icon}
                </span>
              ) : null}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
