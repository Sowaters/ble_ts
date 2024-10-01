// src/store/bluetoothSlice.ts  
import { createSlice, PayloadAction } from '@reduxjs/toolkit';  
  
// 定义蓝牙设备的类型  
interface BluetoothDevice {  
  name: string;  
  address: string;  
}  
  
// 定义蓝牙状态的类型  
interface BluetoothState {  
  isConnected: boolean;  
  devices: BluetoothDevice[];  
  isScanning: boolean;  
  scanResults: BluetoothDevice[];  
}  
  
const initialState: BluetoothState = {  
  isConnected: false,  
  devices: [],  
  isScanning: false,  
  scanResults: [],  
};  
  
const bluetoothSlice = createSlice({  
  name: 'bluetooth',  
  initialState,  
  reducers: {  
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {  
      state.isConnected = action.payload;  
    },  
    setDevices: (state, action: PayloadAction<BluetoothDevice[]>) => {  
      state.devices = action.payload;  
    },  
    startScanning: (state) => {  
      state.isScanning = true;  
      state.scanResults = []; // Clear previous scan results  
    },  
    stopScanning: (state) => {  
      state.isScanning = false;  
    },  
    addScanResult: (state, action: PayloadAction<BluetoothDevice>) => {  
      state.scanResults.push(action.payload);  
    },  
  },  
});  
  
// 导出 action creators 和 slice reducer  
export const {  
  setConnectionStatus,  
  setDevices,  
  startScanning,  
  stopScanning,  
  addScanResult,  
} = bluetoothSlice.actions;  
  
export default bluetoothSlice.reducer;