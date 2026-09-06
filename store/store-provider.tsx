"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";

import { setupAxiosInterceptors } from "./api/axios";
import { getStoredUser } from "./auth/auth-storage";
import { setAuthUser } from "./slices/auth.slice";
import { makeStore } from "./store";
import { syncRestaurantSession } from "./auth/restaurant-session";
import { RESTAURANT_TOKEN_KEY } from "./auth/restaurant-auth-storage";

type StoreProviderProps = {
  children: ReactNode;
};

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [store] = useState(makeStore);

  useEffect(() => {
    const unsubscribe = setupListeners(store.dispatch);
    syncRestaurantSession(store);
    const onStorage = (event: StorageEvent) => {
      if (event.key === RESTAURANT_TOKEN_KEY || event.key === null) syncRestaurantSession(store);
    };
    window.addEventListener("storage", onStorage);
    return () => {
      unsubscribe();
      window.removeEventListener("storage", onStorage);
    };
  }, [store]);

  useEffect(() => {
    const storedUser = getStoredUser();

    if (storedUser) {
      store.dispatch(setAuthUser(storedUser));
    }

    return setupAxiosInterceptors(store.dispatch);
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
};
