// src/bluetooth/BluetoothService.ts  
import { BleManager, Device } from 'react-native-ble-plx'; 
import requestLocationPermission,{blePermission} from '../../utils/permissionUtils'
import { setDevices, addScanResult, startScanning, stopScanning, setConnectionStatus } from './bluetoothStatus'  
  
type BleManagerState = 'Unknown' | 'Resetting' | 'Unsupported' | 'Unauthorized' | 'PoweredOff' | 'PoweredOn' | undefined; 

type CallbackType = (result: {status:boolean, message: string|object|any[]|undefined|unknown}) => void;


let bleManager:BleManager | null = null
  
const BluetoothApi = {    
    init: async() => {
      try {
            const res = await requestLocationPermission(blePermission);  
            console.log('initialize'); 
            if (res) {    
                bleManager = new BleManager();
            }
        }catch(err) {
            console.log('>>> initialize',err);
        }
  },
  isBluetoothEnabled: async (callback?:CallbackType) => {
    try {  
        const state:BleManagerState = await bleManager?.state();
        console.log('当前蓝牙状态：', state);  
        callback?.({
            status:state === 'PoweredOn',
            message: state
        });
    }catch(err) {
        console.log('>>> isBluetoothEnabled',err);
        callback?.({
            status:false,
            message: err
        });
    }
    
  },
  // 开始扫描蓝牙设备  
  startScanningDevices: async (dispatch: any,callback?: CallbackType) => {  
    dispatch(startScanning());  
    try {  
      const scanner = await bleManager?.startDeviceScan(null, null, (error:Error | null, device:Device|null) => {  
        if (error) {  
          console.error('扫描错误:', error);  
          return;  
        }  
        console.log(device);
        
        // 假设你想把每个扫描到的设备都添加到scanResults中  
        // dispatch(addScanResult({ name: device.name, address: device.id }));  
        // 你也可以考虑将设备添加到devices中，但这取决于你的应用逻辑  
        // dispatch(setDevices([...state.devices, { name: device.name, address: device.id }]));  
      });  
  
      // 注意：这里应该有一个停止扫描的逻辑，比如设置一个超时或者使用组件的卸载函数来停止扫描  
      // 为了示例简单，这里先不添加  
    } catch (error) {  
      console.error('启动扫描失败:', error);  
    }  
  },  
  
  // 停止扫描蓝牙设备  
  stopScanningDevices: async (dispatch: any) => {  
    dispatch(stopScanning());  
    await bleManager?.stopDeviceScan();  
  },  
  
  // 其他蓝牙操作，如连接设备、读取数据等...  
};  
  
export default BluetoothApi;