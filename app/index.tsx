import { StatusBar, Text, View,FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {DeviceItem,HeadItem} from "@/components";
import tw from "twrnc";
import { Href, router } from "expo-router";
import icons from "@/constants/icons";
import BluetoothApi from "@/store/ble/bluetoothApi";
import { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {BluetoothDevice} from "@/types/types";


export default function Index() {
  const dispatch = useDispatch();

  const {scanResults} = useSelector(state => state.ble)
  const [deviceList,setDeviceList] = useState<BluetoothDevice[]>([{"id": "DA:22:48:B5:A5:B1", "isConnectable": true, "localName": "N/A", "manufacturerData": null, "mtu": 23, "name": "N/A", "overflowServiceUUIDs": null, "rawScanRecord": "AgEGDhaV/hBVjAkwsaW1SCLaBAlOL0EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=", "rssi": -97, "serviceData": {"0000fe95-0000-1000-8000-00805f9b34fb": "EFWMCTCxpbVIIto="}, "serviceUUIDs": null, "solicitedServiceUUIDs": null, "txPowerLevel": null},{"id": "DA:22:48:B5:A5:B2", "isConnectable": true, "localName": "N/A", "manufacturerData": null, "mtu": 23, "name": "N/A", "overflowServiceUUIDs": null, "rawScanRecord": "AgEGDhaV/hBVjAkwsaW1SCLaBAlOL0EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=", "rssi": -97, "serviceData": {"0000fe95-0000-1000-8000-00805f9b34fb": "EFWMCTCxpbVIIto="}, "serviceUUIDs": null, "solicitedServiceUUIDs": null, "txPowerLevel": null}])

  
  // useEffect(()=>{
  //    const intervalId = setInterval(()=>{
      
  //       setDeviceList([...scanResults])
  //       console.log(deviceList);
        
  //     },2000)
      
  //     return ()=> clearInterval(intervalId)
   
  // },[])

  useEffect(()=>{
    BluetoothApi.init((result)=>{
      if(result.status){
        BluetoothApi.isBluetoothEnabled((result1)=>{ 
          console.log(result1);
          
          if(result1.status){
            
            BluetoothApi.startScanningDevices(dispatch)
          }
        })
      }
      
    })
  },[])

   

 
  const handleConnect = () => {
    // connect to device
    router.push( '/content' as Href<string>);
  }

  

  return (
    <SafeAreaView style={tw`h-full w-full `}>
      <HeadItem title="设备列表" isBack={false} icon={icons.set}/>
      
      <FlatList 
        data={deviceList}
        renderItem={({item}) => <DeviceItem device={item} handleClick={handleConnect} />}
        keyExtractor={(item) => item.id}
      />

      <StatusBar barStyle={"dark-content"} />
    </SafeAreaView>
  );
}
