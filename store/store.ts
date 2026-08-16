import { configureStore } from "@reduxjs/toolkit";

import { superAdminApi } from "./api/super-admin.api";
import { authReducer } from "./slices/auth.slice";
import { loaderReducer } from "./slices/loader.slice";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      loader: loaderReducer,
      [superAdminApi.reducerPath]: superAdminApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(superAdminApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
