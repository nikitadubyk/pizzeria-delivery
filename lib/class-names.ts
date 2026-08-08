import { twMerge } from "tailwind-merge";

export const interactiveTransitionClassName =
  "transition-[background-color,border-color,color,box-shadow,opacity] duration-200 ease-out motion-reduce:transition-none";

export const interactiveMotionTransitionClassName =
  "transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-200 ease-out motion-reduce:transition-none";

export function cn(...classNames: Array<false | null | string | undefined>) {
  return twMerge(classNames.filter(Boolean).join(" "));
}
