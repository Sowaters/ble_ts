// 导入configureStore函数和bleReducer
import { configureStore } from "@reduxjs/toolkit";
import bleReducer from "./ble/bluetoothSlice";


// 创建store，并将bleReducer作为reducer
const store = configureStore({
  reducer: {
    ble: bleReducer,
  }
})


// 导出store
export default store

// 定义RootState类型，用于获取store中的状态
export type RootState = ReturnType<typeof store.getState>;