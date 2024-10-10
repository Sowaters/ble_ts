
/** 
 *  定义按钮样式的接口  ButtonStyle
 *  bwrapStyle?: string, 按钮外层样式
 *  textStyle?: string, 按钮文字样式
 *  title: string  按钮标题
 */
interface ButtonStyle {
    bwrapStyle?: string, 
    textStyle?: string, 
    title: string 
}
/** 
 *  定义蓝牙设备的属性接口 BleDeviceProps
 *  uuid: string,  蓝牙设备的UUID
 *  name: string,  蓝牙设备的名称
 *  rssi: number,  蓝牙设备的信号强度
 *  properties: string  蓝牙设备的属性
 */
interface BleDeviceProps {
    uuid: string, 
    name: string, 
    rssi: number, 
    properties: string 
}
/**
 *  定义蓝牙设备的属性接口 BluetoothDevice
 *  id: string,  蓝牙设备的UUID
 *  name: string,  蓝牙设备的名称
 *  [otherProps: string]: any // 其他属性
 */
interface BluetoothDevice {  
    name: string|null; 
    id: string; 
    [key:string]:any 
  }  
/**
 *  定义蓝牙状态的属性接口 BluetoothState
 *  isConnected: boolean,  是否已连接
 *  devices: BluetoothDevice[],  蓝牙设备列表  考虑多连使用数组
 *  isScanning: boolean,  是否正在扫描
 *  scanResults: BluetoothDevice[],  扫描结果
 *  readParams: {
 *      serviceUUID: string,  读取服务的UUID    
 *      characteristicUUID: string,  读取特征的UUID
 *  }
 *  writeParams: {
 *      serviceUUID: string,  写入服务的UUID
 *      characteristicUUID: string,  写入特征的UUID
 *      isWriteWithoutResponse: boolean,  是否无响应写入
 *  }    
 */
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
/**
 * 定义添加消息的属性接口 AddMsgProps
 * msg: string,  消息内容
 * type: 'recv' | 'send' | 'Status' | 'sendFail',  消息类型
 * timestr?: string,  时间字符串
 */
interface AddMsgProps {
    msg:string, 
    type:'recv'|'send'|'Status'|'sendFail',
    timestr?:string
}
/**
 * 定义消息的属性接口 MsgProps
 * msg: string,  消息内容
 * type: 'recv' | 'send' | 'Status' | 'sendFail',  消息类型
 * timestr: string,  时间字符串
 */
interface MsgProps extends AddMsgProps {
    timestr:string 
}

/**
 * 定义蓝牙设备的属性接口 RadioProps
 * send: number,  蓝牙设备名称  1 hex 2str
 * recv: number,  蓝牙设备地址  1 hex 2str
 * isLoop: number,  蓝牙设备是否循环  2:循环 1:不循环
 */
interface RadioProps {
    send:number // 发送数据
    recv:number // 接收数据
    isLoop:number // 是否循环
}

// 导出接口
export {
    ButtonStyle,
    BluetoothDevice,
    BluetoothState,
    BleDeviceProps,
    MsgProps,
    AddMsgProps,
    RadioProps
}