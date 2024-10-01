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



export {
    ButtonStyle,
    BleDeviceProps
}