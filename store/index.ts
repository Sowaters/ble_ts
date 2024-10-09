import { configureStore } from "@reduxjs/toolkit";
import bleReducer from "./ble/bluetoothSlice";

const store = configureStore({
  reducer: {
    ble: bleReducer,
  }
})
export default store

export type RootState = ReturnType<typeof store.getState>;