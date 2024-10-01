import { BleManager } from "react-native-ble-plx";
import { Buffer } from 'buffer'
import requestLocationPermission,{blePermission} from '../utils/permissionUtils'
import moment from "moment";


export default class BluetoothManager {
    private manager: BleManager|null; 
    private stateListener: any | null ;
    private dispatch: React.Dispatch<any>;

    constructor(dispatch: React.Dispatch<any>) {
        this.manager = null;
        this.stateListener = null;
        this.dispatch = dispatch;
    }
    async initialize(): Promise<void> {
        
        try {
            const res = await requestLocationPermission(blePermission);  
            console.log('initialize'); 
            if (res) {
                
                this.manager = new BleManager();
                this.isBluetoothEnabled()
                this.setupStateChangeListener()
            }
        }catch(err) {
            console.log('>>> initialize',err);
        }
    }
    isBluetoothEnabled():void {
        this.manager?.state().then(state => {
            console.log('当前蓝牙状态：', state);
            if(state === 'PoweredOn') {
                // 蓝牙已打开，可以进行扫描和连接操作
                console.log('蓝牙已打开');
                this.startDeviceScan()
                
            } else {
                // 蓝牙未打开，可以提示用户打开蓝牙
                console.log('蓝牙未打开');
            }
        });
    }
    setupStateChangeListener(): void {
        console.log('BluetoothManager setupStateChangeListener',);
        
       this.stateListener = this.manager?.onStateChange((state:string) => {
            if (state === 'PoweredOn') {
                console.log('Bluetooth is on');
                
            } else {
                console.log('Bluetooth is off');
            }
        });
    }
    startDeviceScan(): void {
        // { allowDuplicates: false } android 是否允许扫描到重复的设备 安卓默认是true，方便记录rssi
        const _this = this;
        this.manager?.startDeviceScan(null, {
            allowDuplicates:false
        }, (error, device) => {
            if (error) {
                console.error('==>',error);
                return;
            }
            if (device?.localName) {
               
                console.log('==>',
                    moment().format('HH:mm:ss.SSS'),
                    device?.rssi,
                    device?.id,
                    device?.localName, 
                    device?.name, 
                    
                    
                    // device?.isConnectable,
                    // device?.manufacturerData,
                    // device?.mtu,device?.mtu,
                    // device?.overflowServiceUUIDs,
                    // device?.rawScanRecord,
                    
                    // device?.serviceData,
                    // device?.serviceUUIDs,
                    // device?.solicitedServiceUUIDs,
                    // device?.txPowerLevel
                );

                // 更新设备数据
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
                
                _this.dispatch({ type: 'SET_DEVICE', payload: deviceData });
            }
            
               
        });
    }
    connectToDevice(deviceId: string): void {
        
        this.manager?.connectToDevice(deviceId);
    }

    cleanUpStateChangeListener():void {
        if (this.stateListener) {
          
            this.stateListener?.remove();
            this.stateListener = null;
        }
    }
}      




// https://github.com/dotintent/react-native-ble-plx


// rssi：接收信号强度指示（Received Signal Strength Indicator），表示设备与扫描设备之间的信号强度。数值越小，信号越弱。

// id：设备的唯一标识符。在 Android 上，这是一个 BluetoothDevice 对象；在 iOS 上，这是一个 NSUUID 对象。

// localName：设备的本地名称。这是设备在广播时使用的名称。

// name：设备的名称。在 Android 上，这是 BluetoothDevice.getName() 的返回值；在 iOS 上，这是 CBPeripheral.name 的返回值。

// isConnectable：设备是否可连接。在 Android 上，这是一个布尔值；在 iOS 上，这是一个 NSNumber 对象。

// manufacturerData：设备的制造商数据。这是一个包含制造商特定数据的 Data 对象。

// mtu：最大传输单元（Maximum Transmission Unit），表示设备支持的最大数据包大小。

// overflowServiceUUIDs：溢出服务 UUID 列表。这是一个包含设备支持的溢出服务 UUID 的数组。

// rawScanRecord：原始扫描记录。这是一个包含设备广播数据的 Data 对象。

// serviceData：服务数据。这是一个包含设备支持的服务数据的字典。

// serviceUUIDs：服务 UUID 列表。这是一个包含设备支持的服务 UUID 的数组。

// solicitedServiceUUIDs：请求的服务 UUID 列表。这是一个包含设备请求的服务 UUID 的数组。

// txPowerLevel：传输功率级别。这是一个表示设备传输功率级别的整数