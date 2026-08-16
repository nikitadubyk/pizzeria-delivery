"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Provider } from "react-redux";

import { setupAxiosInterceptors } from "./api/axios";
import { getStoredUser } from "./auth/auth-storage";
import { setAuthUser } from "./slices/auth.slice";
import { makeStore } from "./store";

type StoreProviderProps = {
  children: ReactNode;
};

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [store] = useState(makeStore);

  useEffect(() => {
    const storedUser = getStoredUser();

    if (storedUser) {
      store.dispatch(setAuthUser(storedUser));
    }

    return setupAxiosInterceptors(store.dispatch);
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
};
