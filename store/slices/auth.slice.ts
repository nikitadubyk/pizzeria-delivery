import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { SuperAdminUser } from "../auth/types";
import type { RootState } from "../store";

type AuthState = {
  user: SuperAdminUser | null;
};

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<SuperAdminUser>) => {
      state.user = action.payload;
    },
    clearAuthUser: (state) => {
      state.user = null;
    },
  },
});

export const { clearAuthUser, setAuthUser } = authSlice.actions;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const authReducer = authSlice.reducer;
