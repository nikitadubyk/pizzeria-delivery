import { createSlice } from "@reduxjs/toolkit";

import type { RootState } from "../store";

type LoaderState = {
  pendingRequests: number;
};

const initialState: LoaderState = {
  pendingRequests: 0,
};

const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.pendingRequests += 1;
    },
    stopLoading: (state) => {
      state.pendingRequests = Math.max(0, state.pendingRequests - 1);
    },
  },
});

export const { startLoading, stopLoading } = loaderSlice.actions;
export const selectIsLoading = (state: RootState) =>
  state.loader.pendingRequests > 0;
export const loaderReducer = loaderSlice.reducer;
