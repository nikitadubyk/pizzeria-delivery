import {
  IconBottle,
  IconBurger,
  IconCake,
  IconChefHat,
  IconPizza,
  IconToolsKitchen2,
} from "@tabler/icons-react";
import type { ReactNode } from "react";

import type { MenuCategoryIcon } from "./config";

const iconSize = 18;

export function formatPrice(value: number): string {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}

export function getCategoryIcon(icon: MenuCategoryIcon): ReactNode {
  const props = { "aria-hidden": true, size: iconSize, stroke: 2.2 } as const;

  switch (icon) {
    case "pizza":
      return <IconPizza {...props} />;
    case "burger":
      return <IconBurger {...props} />;
    case "snack":
      return <IconChefHat {...props} />;
    case "drink":
      return <IconBottle {...props} />;
    case "dessert":
      return <IconCake {...props} />;
    default:
      return <IconToolsKitchen2 {...props} />;
  }
}
