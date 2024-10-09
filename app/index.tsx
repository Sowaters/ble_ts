import {FlatList } from "react-native";
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
import Toast from "react-native-toast-message";
import { setConnectionStatus } from "@/store/ble/bluetoothSlice";


export default function Index() {
  const dispatch = useDispatch();

  const [isConnecting, setIsConnecting] = useState<{[id:string]:boolean}>({});
  const {scanResults} = useSelector((state:RootState) => state.ble)
  const [deviceList,setDeviceList] = useState<BluetoothDevice[]>([])
  const [curConnect, setCurConnect] = useState<boolean>(false)

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
      if(curConnect){
        Toast.show({  
          type: 'error', 
          text1: '当前正在连接设备，请稍后',
        });
        return
      }
      
      setCurConnect(true)
      setIsConnecting((prevState) => ({  
        ...prevState,  
        [id]: true, // 设置该设备为连接中状态  
      }));  
      const res = BluetoothApi.connectToDevice(id,()=>{
        
        setCurConnect(false)
        setIsConnecting((prevState) => ({  
          ...prevState,  
          [id]: false, // 设置该设备为连接中状态  
        }));
        dispatch(setConnectionStatus(true))
        BluetoothApi.discoverAllServicesAndCharacteristicsForDevice(id,ret=>{
          router.push( {pathname:'/content',params:{deviceId:id}});
        })
      },error=>{
        Toast.show({  
          type: 'error', 
          text1: '连接设备失败',
        });
        setCurConnect(false)
        setIsConnecting((prevState) => ({  
          ...prevState,  
          [id]: false, // 设置该设备为连接中状态  
        }));
      })  
  },[curConnect])

  

  return (
    <SafeAreaView style={tw`h-full w-full `}>
      <HeadItem title="设备列表" isBack={false} icon={icons.set} handlePress={()=>router.push('/set')}/>
      
      <FlatList 
        data={deviceList}
        renderItem={({item}) => <DeviceItem device={item} isLoading={isConnecting[item.id] || false} handleClick={()=>handleConnect(item.id)} />}
        keyExtractor={(item) => item.id}
      />
      <Toast position='top' topOffset={50} visibilityTime={2000}/>  
     
    </SafeAreaView>
  );
}
