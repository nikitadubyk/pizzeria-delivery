"use client";

import { Tabs as MantineTabs, type TabsProps } from "@mantine/core";
import { cn, interactiveMotionTransitionClassName } from "@/lib/class-names";
import type { ReactNode } from "react";

export type TabItem = {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  content?: ReactNode;
};

export type AppTabsProps = Omit<TabsProps, "children"> & {
  items: TabItem[];
};

export function Tabs({ items, defaultValue, ...props }: AppTabsProps) {
  return (
    <MantineTabs defaultValue={defaultValue ?? items[0]?.value} {...props}>
      <MantineTabs.List className="gap-2 border-none">
        {items.map((item) => (
          <MantineTabs.Tab
            key={item.value}
            value={item.value}
            leftSection={item.icon}
            className={cn(
              "border-border text-text focus-visible:outline-primary-active hover:border-primary-hover hover:bg-primary-soft active:border-primary-active data-[active]:border-primary data-[active]:bg-primary-soft data-[active]:text-primary-active cursor-pointer rounded-full border px-4 py-2 font-bold hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:translate-y-0",
              interactiveMotionTransitionClassName
            )}
          >
            {item.label}
          </MantineTabs.Tab>
        ))}
      </MantineTabs.List>
      {items.map((item) => (
        <MantineTabs.Panel key={item.value} value={item.value} pt="md">
          {item.content}
        </MantineTabs.Panel>
      ))}
    </MantineTabs>
  );
}
