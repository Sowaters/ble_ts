import { StatusBar, Text, View,FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {DeviceItem,HeadItem} from "@/components";
import tw from "twrnc";
import { Href, router } from "expo-router";
import icons from "@/constants/icons";
import BluetoothApi from "@/store/ble/bluetoothApi";
import { useEffect,useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {BluetoothDevice} from "@/types/types";
import { RootState } from "@/store";


export default function Index() {
  const dispatch = useDispatch();

  const [isConnecting, setIsConnecting] = useState<{[id:string]:boolean}>({});
  const {scanResults} = useSelector((state:RootState) => state.ble)
  const [deviceList,setDeviceList] = useState<BluetoothDevice[]>([])

  const scanResultsRef = useRef(scanResults);  
  useEffect(() => {  

    scanResultsRef.current = scanResults;  

  }, [scanResults]);

  
  useEffect(()=>{
     const intervalId = setInterval(()=>{
        
        setDeviceList([...scanResultsRef.current])
      },2000)
      
      return ()=> clearInterval(intervalId)
   
  },[])

  useEffect(()=>{    
          
    BluetoothApi.isBluetoothEnabled((result1)=>{ 
        
      if(result1.status){
        BluetoothApi.startScanningDevices(dispatch)
      }
    }) 
    
    BluetoothApi.listenBleStateChange((res)=>{
      console.log('监听蓝牙状态',res);
      if(res.message === 'PoweredOff'){
        BluetoothApi.enableBluetooth()
      }
    })
      return ()=>{
        BluetoothApi.stopScanningDevices(dispatch)
      }
  },[])
 
  const handleConnect = useCallback((id:string) => {
      setIsConnecting((prevState) => ({  
        ...prevState,  
        [id]: true, // 设置该设备为连接中状态  
      }));  
    // router.push( '/content' as Href<string>);
    // BluetoothApi.connectToDevice(id)
      try {
        const res = BluetoothApi.connectToDevice(id,()=>{
          BluetoothApi.discoverAllServicesAndCharacteristicsForDevice(id,ret=>{
            router.push( {pathname:'/content',params:{deviceId:id}});
          })
        })    
        
      } catch (error) {
       console.log('连接失败',error);
        setIsConnecting((prevState) => ({  
          ...prevState,  
          [id]: false, // 连接完成后，将设备状态设置为已连接  
        }));
      }finally {
        // setIsConnecting((prevState) => ({  
        //   ...prevState,  
        //   [id]: false, // 连接完成后，将设备状态设置为已连接  
        // }));
      }
  },[])

  

  return (
    <SafeAreaView style={tw`h-full w-full `}>
      <HeadItem title="设备列表" isBack={false} icon={icons.set} handlePress={()=>router.push('/set')}/>
      
      <FlatList 
        data={deviceList}
        renderItem={({item}) => <DeviceItem device={item} isLoading={isConnecting[item.id] || false} handleClick={()=>handleConnect(item.id)} />}
        keyExtractor={(item) => item.id}
      />

      <StatusBar barStyle={"dark-content"} />
    </SafeAreaView>
  );
}
