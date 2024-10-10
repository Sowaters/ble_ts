import { Stack,SplashScreen } from "expo-router";
import { Provider } from "react-redux";
import  store  from "@/store/";
import { useEffect } from "react";
import BluetoothApi from "@/store/ble/bluetoothApi";
import { StatusBar } from 'expo-status-bar'

// 阻止自动隐藏启动屏幕
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  console.log("layout")
  // 在组件挂载时初始化蓝牙API
  useEffect(() => {
   
    BluetoothApi.init((result)=>{

    })
    SplashScreen.hideAsync();
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
      <StatusBar backgroundColor='#ffffff' style='dark' />
    </Provider>
  );
}