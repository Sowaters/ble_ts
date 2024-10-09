import { BleManager, Device } from 'react-native-ble-plx'; 
import requestLocationPermission,{blePermission} from '../../utils/permissionUtils'
import { setDevices, addScanResult, startScanning, stopScanning, setConnectionStatus } from './bluetoothSlice'  
import { Dispatch } from 'redux';
import { Buffer } from 'buffer';

type BleManagerState = 'Unknown' | 'Resetting' | 'Unsupported' | 'Unauthorized' | 'PoweredOff' | 'PoweredOn' | undefined; 

type CallbackType = (result: {status:boolean, message?: string|object|any[]|undefined|unknown}) => void;


let bleManager:BleManager | null = null
  
const BluetoothApi = {    
  init: async(successcallback:CallbackType, failurecallback?:CallbackType) => {
      try {
            const res = await requestLocationPermission(blePermission);  
            console.log('initialize',res); 
            if (res) {    
                bleManager = new BleManager();
                
                successcallback({
                    status:true
                })
            }
            return ({
              status:false
          });
        }catch(err) {
            console.log('>>> initialize',err);
            failurecallback?.({
                status:false,
                message:err
            });
            
        }
  },
  isBluetoothEnabled: async (successcallback:CallbackType,failurecallback?:CallbackType) => {
    try {  
        const state:BleManagerState = await bleManager?.state();
        console.log('当前蓝牙状态：', state);  
        successcallback({
            status:state === 'PoweredOn',
            message: state
        });
    }catch(err) {
        console.log('>>> isBluetoothEnabled',err);
        failurecallback?.({
            status:false,
            message: err
        });
    }
    
  },
  listenBleStateChange: (successcallback:CallbackType,failurecallback?:CallbackType) => {
    try {
      bleManager?.onStateChange((state: BleManagerState) => {
        // console.log('蓝牙状态改变：', state);
        successcallback({
          status:state === 'PoweredOn',
          message: state
        })
        
      })
    }catch(err) {
      console.log('>>> listenBleStateChange',err);
      failurecallback?.({
        status:false,
        message: err
      })
    }
    
  },
  enableBluetooth: async () => {
    try {
      const res = await bleManager?.enable()
    }catch(err) {
      console.log('>>> enableBluetooth',err);
      
    }
  },
  // 开始扫描蓝牙设备  
  startScanningDevices: (dispatch:Dispatch) => { 
    dispatch(startScanning());  
    try {  
        bleManager?.startDeviceScan(null, null, (error:Error | null, device:Device|null) => {  
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
      });  
    } catch (error) {  
      console.error('启动扫描失败:', error);  
    }  
  },    
  // 停止扫描蓝牙设备  
  stopScanningDevices: async (dispatch: any) => {  
    dispatch(stopScanning());  
    await bleManager?.stopDeviceScan();  
  },  
  connectToDevice: async ( deviceId: string,callback?:CallbackType) => {
    try {  
      const res = await bleManager?.connectToDevice(deviceId);  
      // console.log(res);
      // return res;
      callback?.({
        status: true,
        message: deviceId,
      });
    } catch (error) {  
      console.error('连接设备失败:', error);
    }  
  },
  discoverAllServicesAndCharacteristicsForDevice: async (deviceId: string,successcallback:CallbackType,failcallback?:CallbackType) => {

    
    try {
      const res = await bleManager?.discoverAllServicesAndCharacteristicsForDevice(deviceId);
      successcallback({
        status: true,
        message: deviceId,
      })
      
    } catch (error) {
      
      failcallback?.({
        status: false,
        message: deviceId,
      })
    }
  },
  findAllServices:async (deviceId: string,successcallback:CallbackType,failcallback?:CallbackType) => {
    try {
      const services = await bleManager?.servicesForDevice(deviceId);

      const formatServices = services?.map(item => ({id: item.id,deviceID:item.deviceID,uuid:item.uuid, isPrimary:item.isPrimary}));


      successcallback({
        status: true,
        message: formatServices,
      })
    } catch (error) {
      console.log('发现服务和特征失败:', error);
      failcallback?.({
        status: false,
        message: [],
      })
    }
  },
  findCharacteristics:async (deviceId: string,serviceId:string,successcallback:CallbackType,failcallback?:CallbackType) => {
    try {
      const characteristics = await bleManager?.characteristicsForDevice(deviceId, serviceId);
      const formatCharacteristics = characteristics?.map(item => ({
        id: item.id,
        serviceID:item.serviceID,
        deviceID:item.deviceID,
        serviceUUID:item.serviceUUID,
        uuid:item.uuid, 
        isIndicatable:item.isIndicatable,
        isNotifiable:item.isNotifiable,
        isNotifying:item.isNotifying,
        isReadable:item.isReadable,
        isWritableWithResponse:item.isWritableWithResponse,
        isWritableWithoutResponse:item.isWritableWithoutResponse,
        isReadSelected:false,
        isWriteSelected:false
      }));
      
      successcallback({
        status: true,
        message: formatCharacteristics,
      })
    } catch (error) {
      console.log('发现服务和特征失败:', error);  
      failcallback?.({
        status: false,
        message: error,
      })
    }  
  },
  notify:  (deviceId: string, serviceId: string, characteristicId: string, successcallback: CallbackType, failcallback?: CallbackType) => {

     
    try {
          bleManager?.monitorCharacteristicForDevice(deviceId, serviceId, characteristicId,(error,characteristic)=>{
          if(error){
            failcallback?.({
              status: false,
              message: error,
            })
          }else{
            if(characteristic?.value){
              let resData = Buffer.from(characteristic.value, 'base64').toString('hex')
              console.log('接收的数据==>',resData);
              successcallback({
                status: true,
                message: resData,
              })
            }
            
          }
        },'Qsid');
       
      } catch (error) {
        
      }
  },
  writeOutData: async (deviceId: string, serviceId: string, characteristicId: string, data: string, successcallback: CallbackType, failcallback?: CallbackType) => {
    const sendVal = Buffer.from(data, 'hex').toString('base64');  
    try {
      await bleManager?.writeCharacteristicWithoutResponseForDevice(deviceId, serviceId, characteristicId, sendVal);
      successcallback({
        status: true,
        message: '写入成功',
      }); 
    } catch (error) {
      failcallback?.({
        status: false,
        message: '写入失败',
      });
    }
  },
  writeData: async (deviceId: string, serviceId: string, characteristicId: string, data: string, successcallback: CallbackType, failcallback?: CallbackType) => {
    const sendVal = Buffer.from(data, 'hex').toString('base64');
    try {
      await bleManager?.writeCharacteristicWithResponseForDevice(deviceId, serviceId, characteristicId, sendVal);
      successcallback({
        status: true,
        message: '写入成功',
      });
    } catch (error) {
      failcallback?.({
        status: false,
        message: '写入失败',
      });
    }     
  },
  asciiToHex(asciiString: string): string {  
      let hexString = '';  
      for (let i = 0; i < asciiString.length; i++) {  
          let asciiCode = asciiString.charCodeAt(i);  
          let hexPair = asciiCode.toString(16).toUpperCase();  
          // 确保每个字符都是两个字符宽，不足则补0  
          hexPair = hexPair.length === 1 ? '0' + hexPair : hexPair;  
          hexString += hexPair;  
      }  
      return hexString;  
  } 
};  
  
export default BluetoothApi;