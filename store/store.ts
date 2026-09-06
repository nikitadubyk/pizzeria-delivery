import { configureStore } from "@reduxjs/toolkit";

import { superAdminApi } from "./api/super-admin.api";
import { restaurantAuthApi } from "./api/restaurant-auth.api";
import { restaurantAuthReducer } from "./slices/restaurant-auth.slice";
import { authReducer } from "./slices/auth.slice";
import { loaderReducer } from "./slices/loader.slice";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      restaurantAuth: restaurantAuthReducer,
      [restaurantAuthApi.reducerPath]: restaurantAuthApi.reducer,
      loader: loaderReducer,
      [superAdminApi.reducerPath]: superAdminApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(superAdminApi.middleware, restaurantAuthApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
