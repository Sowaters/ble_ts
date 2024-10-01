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

  // const {scanResults} = useSelector(state => state.ble)
  const [deviceList,setDeviceList] = useState<BluetoothDevice[]>([])

  
  // useEffect(()=>{
  //    const intervalId = setInterval(()=>{
      
  //       setDeviceList([...scanResults])
        
  //     },2000)
      
  //     return ()=> clearInterval(intervalId)
   
  // },[])

  // useEffect(()=>{
  //   BluetoothApi.init((result)=>{
  //     if(result.status){
  //       BluetoothApi.isBluetoothEnabled((result1)=>{ 
  //         console.log(result1);
          
  //         if(result1.status){
            
  //           BluetoothApi.startScanningDevices(dispatch)
  //         }
  //       })
  //     }
      
  //   })
  // },[])

   

 
  const handleConnect = () => {
    
    router.push( '/content' as Href<string>);
  }

  

  return (
    <SafeAreaView style={tw`h-full w-full `}>
      <HeadItem title="设备列表" isBack={false} icon={icons.set} handlePress={()=>router.push('/set')}/>
      
      <FlatList 
        data={deviceList}
        renderItem={({item}) => <DeviceItem device={item} handleClick={handleConnect} />}
        keyExtractor={(item) => item.id}
      />

      <StatusBar barStyle={"dark-content"} />
    </SafeAreaView>
  );
}
