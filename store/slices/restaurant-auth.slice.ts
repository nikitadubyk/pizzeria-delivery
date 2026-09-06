import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

type RestaurantAuthState = {
  token: string | null;
  ready: boolean;
  error: string | null;
  revision: number;
};

const initialState: RestaurantAuthState = {
  token: null,
  ready: false,
  error: null,
  revision: 0,
};

const restaurantAuthSlice = createSlice({
  name: "restaurantAuth",
  initialState,
  reducers: {
    setRestaurantToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      state.ready = true;
      state.error = null;
      state.revision += 1;
    },
    setRestaurantStorageError(state) {
      state.token = null;
      state.ready = true;
      state.error = "Не удалось получить доступ к хранилищу браузера";
      state.revision += 1;
    },
  },
});

export const { setRestaurantToken, setRestaurantStorageError } = restaurantAuthSlice.actions;
export const selectRestaurantAuth = (state: RootState) => state.restaurantAuth;
export const restaurantAuthReducer = restaurantAuthSlice.reducer;
