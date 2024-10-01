import { StatusBar, Text, View,FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {DeviceItem,HeadItem} from "@/components";
import tw from "twrnc";
import { Href, router } from "expo-router";
import icons from "@/constants/icons";
// import BluetoothManager from "@/context/BleManager"
// import { useEffect } from "react";

export default function Index() {
  const handleConnect = () => {
    // connect to device
    router.push( '/content' as Href<string>);
  }

  // useEffect(()=>{
  //   const bluetoothManager = new BluetoothManager();
  //   bluetoothManager.initialize();
  // },[])

   

 


  const devices = [{id:1, name: 'Device 1', uuid: '1234567890'},
  {id:2, name: 'Device 2', uuid: '1234567890'}, 
  {id:3, name: 'Device 3', uuid: '1234567890'},
  {id:4, name: 'Device 4', uuid: '1234567890'},
  {id:5, name: 'Device 5', uuid: '1234567890'},
  {id:6, name: 'Device 6', uuid: '1234567890'},
  {id:7, name: 'Device 7', uuid: '1234567890'},
  {id:8, name: 'Device 8', uuid: '1234567890'},
  {id:9, name: 'Device 9', uuid: '1234567890'},
  ]

  return (
    <SafeAreaView style={tw`h-full w-full `}>
      <HeadItem title="设备列表" isBack={false} icon={icons.set}/>
      
      <FlatList 
        data={devices}
        renderItem={({item}) => <DeviceItem name={item.name} uuid={item.uuid} handleClick={handleConnect} />}
        keyExtractor={(item) => item.id.toString()}
      />

      <StatusBar barStyle={"dark-content"} />
    </SafeAreaView>
  );
}
