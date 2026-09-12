"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/hooks";
import type { RestaurantIdentity } from "@/api-contracts";
import { Details } from "@/components/details";
import { ROUTES } from "@/config/routes";
import { useGetRestaurantMeQuery } from "@/store/api/restaurant-auth.api";
import { clearRestaurantToken } from "@/store/auth/restaurant-auth-storage";
import { syncRestaurantSession } from "@/store/auth/restaurant-session";
import { useAppSelector } from "@/store/hooks";
import {
  selectRestaurantAuth,
  setRestaurantStorageError,
} from "@/store/slices/restaurant-auth.slice";

const RestaurantIdentityContext = createContext<RestaurantIdentity | null>(
  null,
);

export function useRestaurantIdentity(): RestaurantIdentity {
  const identity = useContext(RestaurantIdentityContext);
  if (!identity) throw new Error("RestaurantAuthGuard is required");
  return identity;
}

export function RestaurantAuthGuard({
  children,
  guest = false,
}: {
  children: ReactNode;
  guest?: boolean;
}) {
  const router = useRouter();
  const store = useAppStore();
  const {
    token,
    ready,
    error: storageError,
  } = useAppSelector(selectRestaurantAuth);
  const {
    currentData: user,
    error,
    isError,
    isFetching,
    isUninitialized,
    refetch,
  } = useGetRestaurantMeQuery(undefined, {
    skip: !ready || !token || Boolean(storageError),
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });
  const unauthorized =
    isError && error && "status" in error && error.status === 401;

  useEffect(() => {
    if (!ready || storageError) return;
    if (unauthorized && !isFetching) {
      try {
        clearRestaurantToken();
      } catch {
        store.dispatch(setRestaurantStorageError());
        return;
      }
      syncRestaurantSession(store);
      return;
    }
    if (!token && !guest) router.replace(ROUTES.ADMIN.LOGIN);
    if (token && user && !isError && guest) router.replace(ROUTES.ADMIN.ROOT);
  }, [
    guest,
    isError,
    isFetching,
    ready,
    router,
    storageError,
    store,
    token,
    unauthorized,
    user,
  ]);

  const checking =
    !ready ||
    (!storageError &&
      ((!token && !guest) ||
        Boolean(
          token && (unauthorized || isUninitialized || (!user && !isError)),
        ) ||
        Boolean(guest && token && user && !isError)));

  return (
    <Details
      className="flex min-h-dvh w-full flex-col"
      isLoading={checking}
      isFetching={isFetching}
      isError={Boolean(storageError) || (isError && !unauthorized)}
      errorMessage={storageError ?? "Не удалось проверить вход"}
      loadingLabel="Проверка входа…"
      onRetry={() => (storageError ? syncRestaurantSession(store) : refetch())}
    >
      <RestaurantIdentityContext.Provider value={user ?? null}>
        {children}
      </RestaurantIdentityContext.Provider>
    </Details>
  );
}
