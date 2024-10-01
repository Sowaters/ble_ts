import { configureStore } from "@reduxjs/toolkit";
import bleReducer from "./ble/bluetoothSlice";

export default configureStore({
  reducer: {
    ble: bleReducer,
  }
})