import type { AppStore } from "../store";
import { restaurantAuthApi } from "../api/restaurant-auth.api";
import { setRestaurantStorageError, setRestaurantToken } from "../slices/restaurant-auth.slice";
import { getRestaurantToken } from "./restaurant-auth-storage";

export function syncRestaurantSession(store: AppStore): void {
  for (const request of store.dispatch(restaurantAuthApi.util.getRunningQueriesThunk())) request.abort();
  for (const request of store.dispatch(restaurantAuthApi.util.getRunningMutationsThunk())) request.abort();
  store.dispatch(restaurantAuthApi.util.resetApiState());
  try {
    store.dispatch(setRestaurantToken(getRestaurantToken()));
  } catch {
    store.dispatch(setRestaurantStorageError());
  }
}
