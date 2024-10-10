import { createSlice, PayloadAction } from '@reduxjs/toolkit';  

import {BluetoothDevice,BluetoothState} from '../../types/types'
/**
 * 
 */ 
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
    // 设置连接状态
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {  
      state.isConnected = action.payload;  
      if(!action.payload){
        // 断开连接时，清空读写参数
        state.readParams = {
          serviceUUID: '',
          characteristicUUID: '',
        },
        state.writeParams = {
          serviceUUID: '',
          isWriteWithoutResponse:true,
          characteristicUUID: '', 
        }
      }
    },  
    // 设置读参数
    setReadParms: (state, action: PayloadAction<{serviceUUID: string, characteristicUUID: string}>) => {
      state.readParams.serviceUUID = action.payload.serviceUUID;
      state.readParams.characteristicUUID = action.payload.characteristicUUID;
    },
    // 设置写参数
    setWriteParms: (state, action: PayloadAction<{serviceUUID: string, characteristicUUID: string, isWriteWithoutResponse: boolean}>) => {
      state.writeParams.serviceUUID = action.payload.serviceUUID;
      state.writeParams.characteristicUUID = action.payload.characteristicUUID;
      state.writeParams.isWriteWithoutResponse = action.payload.isWriteWithoutResponse;
      
    },
    // 设置设备列表
    setDevices: (state, action: PayloadAction<BluetoothDevice[]>) => {       
      state.devices = action.payload; 
    },  
    // 开始扫描
    startScanning: (state) => {  
      state.isScanning = true;  
      state.scanResults = []; // 清空之前的扫描结果  
    },  
    // 停止扫描
    stopScanning: (state) => {  
      state.isScanning = false;  
    },  
    // 添加扫描结果
    addScanResult: (state, action: PayloadAction<BluetoothDevice>) => {  
      const newDevice = action.payload;
      const existingDeviceIndex = state.scanResults.findIndex((device) => device.id === newDevice.id);
      
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