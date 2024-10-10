import {FlatList,View,Text,Image, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {ButtonItem, DeviceItem,HeadItem} from "@/components";
import tw from "twrnc";
import {  router } from "expo-router";
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

  // 定义一个状态变量，用于存储设备连接状态
  const [isConnecting, setIsConnecting] = useState<{[id:string]:boolean}>({});
  // 使用 useSelector 获取蓝牙扫描结果
  const {scanResults} = useSelector((state:RootState) => state.ble)
  // 定义一个状态变量，用于存储设备列表
  const [deviceList,setDeviceList] = useState<BluetoothDevice[]>([])
  // 定义一个状态变量，用于存储过滤文本
  const [filterText,setFilterText] = useState<string>("")
  // 定义一个状态变量，用于存储当前连接状态
  const [curConnect, setCurConnect] = useState<boolean>(false)

  // 创建一个 ref，用于存储蓝牙扫描结果
  const scanResultsRef = useRef(scanResults);
  // 创建一个 ref，用于存储定时器ID
  const intervalRef = useRef<any>(null);

  // 当 scanResults 变化时，更新 scanResultsRef 的值 
  useEffect(() => {  
    scanResultsRef.current = scanResults;  

  }, [scanResults]);

  

  // 当 filterText 变化时，执行过滤操作  不需要数据更新太快
  useEffect(()=>{
    console.log(filterText);
    
    if (intervalRef.current) {  
        clearInterval(intervalRef.current);  
    } 
     const intervalId = setInterval(()=>{
      // 过滤 scanResultsRef 中的设备，返回包含 filterText 的设备列表
      const filteredResults = scanResultsRef.current.filter(device =>  
        device.name?.includes(filterText)??false // 替换 someProperty 和 includes 逻辑以匹配您的数据  
      ); 
        // 更新设备列表
        setDeviceList(filteredResults)
      },2000)
      // 更新 intervalRef 的值
      intervalRef.current = intervalId;   
      // 清除定时器
      return ()=> {
        clearInterval(intervalRef.current);  
        intervalRef.current = null
      }
  },[filterText])

  // 当组件挂载时，执行蓝牙扫描和监听蓝牙状态变化
  useEffect(()=>{    
          
    // 检查蓝牙是否开启
    BluetoothApi.isBluetoothEnabled((result1)=>{    
      if(result1.status){
        // 开启蓝牙扫描
        BluetoothApi.startScanningDevices(dispatch)
      }
    }) 
    // 监听蓝牙状态变化
    BluetoothApi.listenBleStateChange((res)=>{
      console.log('监听蓝牙状态',res);
      if(res.message === 'PoweredOff'){
        // 如果蓝牙关闭，则开启蓝牙
        BluetoothApi.enableBluetooth()
      }
    })
      // 组件卸载时，停止蓝牙扫描
      return ()=>{
        BluetoothApi.stopScanningDevices(dispatch)
      }
  },[])
 
  // 定义一个处理连接的函数
  const handleConnect = useCallback((id:string) => {
      // 如果当前正在连接设备，则提示用户稍后
      if(curConnect){
        Toast.show({  
          type: 'error', 
          text1: '当前正在连接设备，请稍后',
        });
        return
      }
      
      // 设置当前连接状态为 true
      setCurConnect(true)
      // 设置设备连接状态为连接中
      setIsConnecting((prevState) => ({  
        ...prevState,  
        [id]: true, // 设置该设备为连接中状态  
      }));  
      // 连接设备
      const res = BluetoothApi.connectToDevice(id,()=>{
        
        // 设置当前连接状态为 false
        setCurConnect(false)
        // 设置设备连接状态为已连接
        setIsConnecting((prevState) => ({  
          ...prevState,  
          [id]: false, // 设置该设备为连接中状态  
        }));
        // 更新连接状态
        dispatch(setConnectionStatus(true))
        // 发现设备的服务和特征
        BluetoothApi.discoverAllServicesAndCharacteristicsForDevice(id,ret=>{
          // 跳转到内容页面
          router.push( {pathname:'/content',params:{deviceId:id}});
        })
      },error=>{
        // 连接失败，提示用户
        Toast.show({  
          type: 'error', 
          text1: '连接设备失败',
        });
        // 设置当前连接状态为 false
        setCurConnect(false)
        // 设置设备连接状态为已连接
        setIsConnecting((prevState) => ({  
          ...prevState,  
          [id]: false, // 设置该设备为连接中状态  
        }));
      })  
  },[curConnect])

  

  return (
    <SafeAreaView style={tw`h-full w-full `}>
      <HeadItem title="设备列表" isBack={false} icon={icons.set} handlePress={()=>router.push('/set')}/>
      <View style={tw`flex-row px-4 h-10`}>
          <TextInput value={filterText}  onChangeText={text=>{setFilterText(text)}} style={tw`border-b bg-gray-100 h-10 w-full rounded-md px-2`} placeholder='根据设备名字过滤' />
        </View>
      <FlatList 
        data={deviceList}
        renderItem={({item}) => <DeviceItem device={item} isLoading={isConnecting[item.id] || false} handleClick={()=>handleConnect(item.id)} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (<View style={tw`flex mt-50 justify-center items-center`}>
          <Image source={icons.noData} style={tw`w-40 h-40 `} resizeMode="contain"/>
          
        </View>)}
      />
      <Toast position='top' topOffset={50} visibilityTime={2000}/>  
     
    </SafeAreaView>
  );
}
