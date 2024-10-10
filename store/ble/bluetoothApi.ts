import { BleManager, Device } from 'react-native-ble-plx'; 
import requestLocationPermission,{blePermission} from '../../utils/permissionUtils'
import { setDevices, addScanResult, startScanning, stopScanning, setConnectionStatus } from './bluetoothSlice'  
import { Dispatch } from 'redux';
import { Buffer } from 'buffer';

// 定义蓝牙状态类型
type BleManagerState = 'Unknown' | 'Resetting' | 'Unsupported' | 'Unauthorized' | 'PoweredOff' | 'PoweredOn' | undefined; 

// 定义回调函数类型
type CallbackType = (result: {status:boolean, message?: string|object|any[]|undefined|unknown,err?:any}) => void;


// 初始化蓝牙管理器
let bleManager:BleManager | null = null
  
const BluetoothApi = { 
  /**
   *  ** 初始化蓝牙管理器
   *  @param successcallback
   *  @param failurecallback
   * 
   **/   
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
  /**
   * 检查蓝牙是否已启用
   * @param successcallback 
   * @param failurecallback 
   */
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
  /**
   * 监听蓝牙状态变化
   *  @param successcallback
   *  @param failurecallback
   */
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
  /**
   * 启用蓝牙
   * 
   */
  enableBluetooth: async () => {
    try {
      const res = await bleManager?.enable()
    }catch(err) {
      console.log('>>> enableBluetooth',err);
      
    }
  },
  /**
   * 开始扫描蓝牙设备
   * @param dispatch redux dispatch
   */
  startScanningDevices: (dispatch:Dispatch) => { 
    dispatch(startScanning());  
    try {  
        bleManager?.startDeviceScan(null, null, (error:Error | null, device:Device|null) => {  
        if (error) {  
          // console.error('扫描错误:', error);  
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
      // console.error('启动扫描失败:', error);  
    }  
  },    
  /**
   * 停止扫描蓝牙设备
   *  @param dispatch redux dispatch
   */
  stopScanningDevices: async (dispatch: Dispatch) => {  
    dispatch(stopScanning());  
    await bleManager?.stopDeviceScan();  
  },  
  /**
   * 连接蓝牙设备
   * @param deviceId 蓝牙设备id
   * @param dispatch redux dispatch
   * @param callback 连接成功回调
   * @param failcallback 连接失败回调
   * 
   */
  connectToDevice: async ( deviceId: string,callback?:CallbackType,failcallback?:CallbackType) => {
    try {  
      const res = await bleManager?.connectToDevice(deviceId,{
        autoConnect:false
      }); 
      // console.log(res);
      console.log('连接设备成功:', deviceId);
      callback?.({
        status: true,
        message: deviceId,
      });
    } catch (error) {  
      console.log('连接设备失败:', error);
      failcallback?.({
        status: false,
        message: error,
      })
    }  
  },
  /**
   * 发现蓝牙设备的服务和特征
   * @param deviceId  蓝牙设备id
   * @param successcallback 
   * @param failcallback 
   */
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
  /**
   * 发现蓝牙设备的服务
   * @param deviceId  蓝牙设备id
   * @param successcallback
   *  @param failcallback
   */
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
  /**
   *  发现蓝牙设备的特征
   * @param deviceId 蓝牙设备id
   * @param serviceId   蓝牙服务id
   * @param successcallback 
   * @param failcallback 
   */
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
  /**
   * 监听蓝牙设备数据
   * @param deviceId          蓝牙设备id
   * @param serviceId         蓝牙服务id           
   * @param characteristicId  蓝牙特征id
   * @param successcallback 
   * @param failcallback 
   */
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
  /**
   * 写入数据  无响应
   * @param deviceId           蓝牙设备id
   * @param serviceId          蓝牙服务id
   * @param characteristicId   蓝牙设备id          
   * @param data               发送的数据     
   * @param successcallback 
   * @param failcallback 
   */
  writeOutData: async (deviceId: string, serviceId: string, characteristicId: string, data: string, successcallback: CallbackType, failcallback?: CallbackType) => {
    const sendVal = Buffer.from(data, 'hex').toString('base64');  
    try {
      await bleManager?.writeCharacteristicWithoutResponseForDevice(deviceId, serviceId, characteristicId, sendVal);
      successcallback({
        status: true,
        message: '写入成功',
      }); 
    } catch (error) {
      console.log('out写入失败', error);
      
      failcallback?.({
        status: false,
        message: '写入失败',
      });
    }
  },
  
  /**
   *  写入数据  有响应
   * @param deviceId           蓝牙设备id
   * @param serviceId          蓝牙服务id
   * @param characteristicId   蓝牙设备id          
   * @param data               发送的数据   
   * @param successcallback 
   * @param failcallback 
   */
  writeData: async (deviceId: string, serviceId: string, characteristicId: string, data: string, successcallback: CallbackType, failcallback?: CallbackType) => {
    const sendVal = Buffer.from(data, 'hex').toString('base64');
    try {
      await bleManager?.writeCharacteristicWithResponseForDevice(deviceId, serviceId, characteristicId, sendVal);
      successcallback({
        status: true,
        message: '写入成功',
      });
    } catch (error) {
      console.log('写入失败', error);
      
      failcallback?.({
        status: false,
        message: '写入失败',
      });
    }     
  },
  /**
   * 设置蓝牙设备的MTU
   * @param deviceId        蓝牙设备id
   * @param mtu             MTU值
   * @param successcallback 
   * @param failcallback 
   */
  setMTU: async (deviceId: string, mtu: number, successcallback: CallbackType, failcallback?: CallbackType) => {
    try {
      await bleManager?.requestMTUForDevice(deviceId, mtu);
      successcallback({
        status: true,
        message: '设置MTU成功',
      });
    } catch{
      failcallback?.({
        status: false,
        message: '设置MTU失败',
      });
    }
  },
  /**
   * 断开蓝牙设备连接
   * @param deviceId 蓝牙设备id
   * @param successcallback 
   * @param failcallback 
   */
  disConnect: async (deviceId: string, successcallback: CallbackType, failcallback?: CallbackType) => {
    try {
      await bleManager?.cancelDeviceConnection(deviceId);
      successcallback({
        status: true,
        message: '断开连接成功',
      });
    }catch {
      failcallback?.({
        status: false,
        message: '断开连接失败',
      });
    }
  },
  /**
   * 监听蓝牙设备断开连接
   * @param deviceId 蓝牙设备id
   * @param successcallback 
   * @param failcallback 
   */
  listenConnected: (deviceId: string,successcallback: CallbackType, failcallback?: CallbackType) => {
    try {
      bleManager?.onDeviceDisconnected(deviceId,(device,error)=>{
        successcallback({
          status: true,
          message: device,
          err: error,
        })
      });
    } catch {
      failcallback?.({
        status: false,
        message: '监听断开连接失败',
      });
    }
  },
  /**
   * ASCII转Hex
   * @param asciiString ASCII字符串
   * @returns
   */
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
  },
  /**
   * Hex转ASCII
   * @param hex 
   * @returns 
   */
  hexToAscii(hex: string): string {  
      // 确保输入的hex字符串长度为偶数，如果不是，则进行填充  
      if (hex.length % 2 !== 0) {  
          return "";
      }  
    
      let asciiString = "";  
      for (let i = 0; i < hex.length; i += 2) {  
          // 从hex字符串中提取每两个字符作为一个字节  
          const byteString = hex.slice(i, i + 2);  
          // 将字节字符串转换为数字（基数为16）  
          const byte = parseInt(byteString, 16);  
          // 将数字转换为对应的ASCII字符并添加到结果字符串中  
          const asciiChar = String.fromCharCode(byte);  
          asciiString += asciiChar;  
      }  
      return asciiString;  
  }   
};  
  
export default BluetoothApi;