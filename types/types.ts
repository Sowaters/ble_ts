interface ButtonStyle {
    bwrapStyle?: string,
    textStyle?: string,
    title: string
}
interface BleDeviceProps {
    uuid: string,
    name: string,
    rssi: number,
    properties: string
}
// 定义蓝牙设备的类型  
interface BluetoothDevice {  
    name: string|null;  
    id: string; 
    [key:string]:any
  }  
    
// 定义蓝牙状态的类型  
interface BluetoothState {  
isConnected: boolean;  
devices: BluetoothDevice[];  
isScanning: boolean;  
scanResults: BluetoothDevice[];  
} 


export {
    ButtonStyle,
    BluetoothDevice,
    BluetoothState,
    BleDeviceProps
}