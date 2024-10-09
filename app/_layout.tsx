import { Stack } from "expo-router";
import { Provider } from "react-redux";
import  store  from "@/store/";
import { useEffect } from "react";
import BluetoothApi from "@/store/ble/bluetoothApi";

export default function RootLayout() {
  useEffect(() => {
   
    BluetoothApi.init((result)=>{
      // if(result.status){
        
        // BluetoothApi.listenBleStateChange(dispatch,(res)=>{
        //   console.log('蓝牙状态=>',res);
        //   if(res.message === 'PoweredOff'){      
        //       BluetoothApi.enableBluetooth()
        //   }
        // })
      // }
      
    })
  },[])
  
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{
            headerShown: false,
          }}
          />
        <Stack.Screen 
          name="(ble)" 
          options={{
            headerShown: false,
          }}
          />
        <Stack.Screen 
          name="(sets)" 
          options={{
            headerShown: false,
          }}
          />     
      </Stack>
    </Provider>
  );
}
