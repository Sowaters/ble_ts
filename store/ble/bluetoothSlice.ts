import { createSlice, PayloadAction } from '@reduxjs/toolkit';  

import {BluetoothDevice,BluetoothState} from '../../types/types'
  
const initialState: BluetoothState = {  
  isConnected: false,  
  devices: [],  
  isScanning: false,  
  scanResults: [], 
  readParams: {
    serviceUUID: '',
    characteristicUUID: '',
  },
  writeParams:{
    serviceUUID: '',
    isWriteWithoutResponse:true,
    characteristicUUID: '', 
  }
};  
  
const bluetoothSlice = createSlice({  
  name: 'bluetooth',  
  initialState,  
  reducers: {  
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {  
      state.isConnected = action.payload;  
    },  
    setReadParms: (state, action: PayloadAction<{serviceUUID: string, characteristicUUID: string}>) => {
      state.readParams.serviceUUID = action.payload.serviceUUID;
      state.readParams.characteristicUUID = action.payload.characteristicUUID;
    },
    setWriteParms: (state, action: PayloadAction<{serviceUUID: string, characteristicUUID: string, isWriteWithoutResponse: boolean}>) => {
      state.writeParams.serviceUUID = action.payload.serviceUUID;
      state.writeParams.characteristicUUID = action.payload.characteristicUUID;
      state.writeParams.isWriteWithoutResponse = action.payload.isWriteWithoutResponse;
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
      const newDevice = action.payload;
      const existingDeviceIndex = state.scanResults.findIndex((device) => device.id === newDevice.id);
      // console.log(existingDeviceIndex,newDevice.id);
      
      if (existingDeviceIndex === -1) {
        state.scanResults.push(newDevice);
      }else{
        state.scanResults[existingDeviceIndex] = {  

          ...state.scanResults[existingDeviceIndex],  
    
          rssi: newDevice.rssi,  
    
        };
      }

    },  
  },  
});  

const bleReducer = bluetoothSlice.reducer;
  
// 导出 action creators 和 slice reducer  
export const {  
  setConnectionStatus,  
  setDevices,  
  startScanning,  
  stopScanning,  
  addScanResult,
  setReadParms,  
  setWriteParms,
} = bluetoothSlice.actions;  
  
export default bleReducer;