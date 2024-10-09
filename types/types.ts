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
    isConnected: boolean
    devices: BluetoothDevice[]
    isScanning: boolean
    scanResults: BluetoothDevice[],
    readParams: {
        serviceUUID: string,
        characteristicUUID: string,
    },
    writeParams:{
        serviceUUID: string,
        isWriteWithoutResponse: boolean,
        characteristicUUID: string, 
    }
} 


interface AddMsgProps {
    msg:string,
    type:'recv'|'send'|'Status'|'sendFail',
    timestr?:string
}
interface MsgProps extends AddMsgProps {
    timestr:string
}

interface RadioProps {
    send:number
    recv:number
    isLoop:number
}

export {
    ButtonStyle,
    BluetoothDevice,
    BluetoothState,
    BleDeviceProps,
    MsgProps,
    AddMsgProps,
    RadioProps
}