import { BleManager, Device } from 'react-native-ble-plx'; 
import requestLocationPermission,{blePermission} from '../../utils/permissionUtils'
import { setDevices, addScanResult, startScanning, stopScanning, setConnectionStatus } from './bluetoothSlice'  
  
type BleManagerState = 'Unknown' | 'Resetting' | 'Unsupported' | 'Unauthorized' | 'PoweredOff' | 'PoweredOn' | undefined; 

type CallbackType = (result: {status:boolean, message?: string|object|any[]|undefined|unknown}) => void;


let bleManager:BleManager | null = null
  
const BluetoothApi = {    
  init: async(callback?:CallbackType) => {
      try {
            const res = await requestLocationPermission(blePermission);  
            console.log('initialize',res); 
            if (res) {    
                bleManager = new BleManager();
                callback?.({
                    status:true
                });
            }
            callback?.({
              status:false
          });
        }catch(err) {
            console.log('>>> initialize',err);
            callback?.({
              status:false,
              message:err
          });
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
        if (device) {
          
        
        const deviceData = {
            id: device.id,
            name: device.name,
            rssi: device.rssi,
            localName: device.localName,
            manufacturerData: device.manufacturerData,
            serviceData: device.serviceData,
            serviceUUIDs: device.serviceUUIDs,
            solicitedServiceUUIDs: device.solicitedServiceUUIDs,
            overflowServiceUUIDs: device.overflowServiceUUIDs,
            txPowerLevel: device.txPowerLevel,
            isConnectable: device.isConnectable,
            mtu: device.mtu,
            rawScanRecord: device.rawScanRecord,
        };
        
        dispatch(addScanResult(deviceData));  
      }
        
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