"use client";

import { useAppSelector } from "@/store/hooks";
import { selectIsLoading } from "@/store/slices/loader.slice";

import { Loader } from "./ui/loader";

export const AppLoader = () => {
  const visible = useAppSelector(selectIsLoading);

  return <Loader fullscreen visible={visible} />;
};
