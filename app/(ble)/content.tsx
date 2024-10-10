import {  Text, View,ScrollView,TextInput, Switch} from 'react-native'
import React,{useState, useCallback, useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc'
import {BleInfoItem, ButtonItem, MsgItem,RadioItem,HeadItem} from '@/components'
import icons from '@/constants/icons'
import BluetoothApi from "@/store/ble/bluetoothApi";
import {router, useLocalSearchParams } from 'expo-router'
import { useDispatch, useSelector } from "react-redux";
import { setReadParms, setWriteParms, setConnectionStatus } from "@/store/ble/bluetoothSlice";
import { RootState } from "@/store";
import { AddMsgProps, RadioProps } from '@/types/types';
import Toast from 'react-native-toast-message';
import moment from 'moment'

const Content = () => {
  const dispatch = useDispatch();
  // 从Redux中获取ble状态
  const {readParams,writeParams,isConnected} = useSelector((state:RootState) => state.ble)
  // 从本地参数中获取设备ID
  const {deviceId} = useLocalSearchParams()
  // 设置当前选项卡为'Services'
  const [tabs, setTabs] = useState<'Services'|'WR'>('Services')
  // 设置是否正在连接
  const [isConnecting, setIsConnecting] = useState<boolean>(false)
  // 设置循环时间
  const [xhTime, setXhTime] = useState<string>('')
  // 设置服务列表
  const [serviceList, setServiceList] = useState<any[]>([])
  // 设置写入值
  const [writeVal, setWriteVal] = useState<string>('')
  // 设置日志数据
  const [logData, setLogData] = useState<any[]>([])
    // 设置MTU值
  const [mtuVal, setMtuVal] = useState<string>('')
  // 设置设备服务
  const [deviceServices, setDeviceServices] = useState<{[key:string]:any}>({})
  // 设置发送、显示、循环开关的状态RadioProps
  const [radiaoVal, setRadiaoVal] = useState<RadioProps>({
    send:1,
    recv:1,
    isLoop:2
  })

  // 添加日志
  const addLog = useCallback((data:AddMsgProps) => {
    if(data.timestr === undefined){
      data.timestr = moment().format('HH:mm:ss.SSS')//获取当前时间;
    }
    setLogData(pre=>[...pre,data])
  },[logData])
  
  // 监听isConnected状态变化 ，当连接成功时，获取设备服务
  useEffect(() => {
    if(isConnected){
      Toast.show({  
        type: 'success', 
        text1: '连接成功',
      });
    
      BluetoothApi.findAllServices(deviceId as string,res=>{  

        const services = res.message as any[];
        const promises = services.map(service => {      
          return new Promise((resolve, reject) => {
            BluetoothApi.findCharacteristics(deviceId as string, service.uuid,res1 => {  
            
              const updatedService = { ...service, characteristics: res1.message,showService: false }
              
              resolve(updatedService)
            });  
          })
        }); 
        
        Promise.all(promises).then(results => {
          setServiceList(results)
        }).catch(error => {
          console.error('Error fetching characteristics',error);
        })
        
      })

      BluetoothApi.listenConnected(deviceId as string,(res)=>{
        dispatch(setConnectionStatus(false))
        
      })
    }else{
      Toast.show({  
        type: 'error', 
        text1: '连接失败',
      });
      setServiceList([])
      setTabs('Services')
    }
  },[isConnected])

  // 组件卸载时断开连接
  useEffect(() => {
    
    return ()=>{
      
      BluetoothApi.disConnect(deviceId as string,res=>{
        
      })
    }
  },[])
  
  // 处理选项卡切换     
  const handelTabs = useCallback((tabsVal:'WR'|'Services') => {
    setTabs(tabsVal)
    if(tabsVal === 'WR'){
        if(JSON.stringify(deviceServices) !== '{}' ){
         
            for(const key in deviceServices){
              const { serIndex, status, tzIndex } = deviceServices[key]; 

              const deviceInfo = serviceList[serIndex].characteristics[tzIndex];  
              console.log('=>',serIndex, status, tzIndex);
              if(key === 'R'){ 
                  dispatch(setReadParms({
                    serviceUUID:status?deviceInfo.serviceUUID:'',
                    characteristicUUID:status?deviceInfo.uuid:''
                  }))            
              }else{ 
                dispatch(setWriteParms({
                  serviceUUID:status?deviceInfo.serviceUUID:'',
                  characteristicUUID:status?deviceInfo.uuid:'',
                  isWriteWithoutResponse:status?deviceInfo.isWriteWithoutResponse:true
                }))       
              }
          }
        } 
    }
  },[deviceServices,serviceList,dispatch])
  
  // 监听readParams变化 并执行read操作
  useEffect(()=>{
    if(readParams.serviceUUID && readParams.characteristicUUID&&deviceId&&tabs==='WR'){
      BluetoothApi.notify(deviceId as string,readParams.serviceUUID,readParams.characteristicUUID, res => {
        if(res.message){
         
          
          let recvMsg = radiaoVal.recv === 1?res.message+'':BluetoothApi.hexToAscii(res.message+'')
          addLog({type:'recv',msg:recvMsg})
        }
      })
    }  
   
  },[readParams, deviceId,radiaoVal,tabs])

  // 处理设备服务选择 并设置到redux中
  const handleSelect = useCallback((tzIndex:number,serIndex:number,type:string,status:boolean) => {
      setDeviceServices(pre=>({
        ...pre,
        [type]:{serIndex, tzIndex, status}
      }))
    },[deviceServices])

  // 获取显示、发送、是否开启循环的状态
  const getRadioValue = useCallback((value:number,type:'send'|'recv'|'isLoop') => {
    
    setRadiaoVal(prev=>({...prev,[type]:value}))   
    
  },[radiaoVal])

  // 发送蓝牙数据      
  const senBleData = useCallback((data:string) => {
  
    let sendData = radiaoVal.send === 1?data:BluetoothApi.asciiToHex(data)
    
    addLog({type:'send',msg:sendData})
    if(writeParams.isWriteWithoutResponse){
      BluetoothApi.writeOutData(deviceId as string,writeParams.serviceUUID,writeParams.characteristicUUID,sendData,res=>{
        
      },err=>{
        addLog({type:'sendFail',msg:sendData})
      })
    }else{
      BluetoothApi.writeData(deviceId as string,writeParams.serviceUUID,writeParams.characteristicUUID,sendData,res=>{
        
      },err=>{
        addLog({type:'sendFail',msg:sendData})
      })
    } 
  },[radiaoVal,writeParams])

  // 监听radiaoVal.isLoop变化 开启循环发送
  useEffect(() => {
    
    if(radiaoVal.isLoop ===  1){
        
      if(writeVal !== ''&&xhTime!== ''){
        const timer = setInterval(() => {
          senBleData(writeVal)
        },Number(xhTime)*1000)

        return () => {
          clearInterval(timer)
        }
      }
 
    }
  },[radiaoVal.isLoop])

    // 处理发送   
  const handleSend = useCallback(() => {

    if(writeVal === ''){
      Toast.show({  
        type: 'error', 
        text1: '内容不能为空',
      });
      return
    } 
    senBleData(writeVal)
  },[writeVal,radiaoVal])

  // 处理设置MTU      
  const handleSetMTU = useCallback(() => {
    
    if(mtuVal === ''){
      Toast.show({  
        type: 'error', 
        text1: '内容不能为空',
      });
      return
    }
    const mtu = parseInt(mtuVal)
    BluetoothApi.setMTU(deviceId as string,mtu,res=>{
      Toast.show({  
        type: 'success',
        text1: '设置成功', 
      });  
      
    },err=>{
      Toast.show({  
        type: 'error', 
        text1: '设置失败',
      }); 
    })
  },[mtuVal])

  // 设置循环时间
  const handleTimeChange = useCallback((text:string) => {
    setXhTime(text)
  },[])

  // 处理设备断开后手动连接
  const handleConnect = useCallback(() => {
    setIsConnecting(true)
    BluetoothApi.connectToDevice(deviceId as string,res=>{
      
      
      BluetoothApi.discoverAllServicesAndCharacteristicsForDevice(deviceId as string,ret=>{
        setIsConnecting(false)
        dispatch(setConnectionStatus(true))
      })
    },err=>{
      dispatch(setConnectionStatus(true)) 
    })
  },[deviceId,dispatch])
  return (
    <SafeAreaView style={tw`flex-1`}>
      <HeadItem  title='设置'/>  
        <View style={tw`flex-1 bg-white`}>
          <View  style={tw`flex-row justify-between px-4 bg-white pb-2`}>
            
              <View style={tw`flex-row items-center`}>
                {isConnected&&(<>
                  <View style={tw`w-2 h-2 rounded-full bg-[#2a864d] mr-1`}></View>
                  <Text style={tw`text-[#2a864d]`}>Conneted</Text>
                  </>
                )}
                {!isConnected&&(<>
                  <View style={tw`w-2 h-2 rounded-full bg-[red] mr-1`}></View>
                  <ButtonItem title='连接' isLoading={isConnecting} handClick={handleConnect} bwrapStyle='w-20'/>
                  </>
                )}
              </View>
             
            <View style={tw`flex-row items-center`}>
              <Text onPress={()=>handelTabs('Services')} style={tw`mr-4 ${tabs === 'Services'?'border-b-2 border-blue-500 text-blue-500':''}`}>Services</Text>
              <Text onPress={()=>handelTabs('WR')} style={tw`${tabs !== 'Services'?'border-b-2 border-blue-500 text-blue-500':''}`}>Write&Read</Text>
            </View>
            
          </View>
          { tabs === 'Services'&&(
            <ScrollView style={tw`flex-1`}>
              <View style={tw`bg-white `}>
                {serviceList&&serviceList.map((item,index)=>(
                  <BleInfoItem key={item.id} uuid={item.uuid} curIndex={index} items={item} getSelectIndex={handleSelect}/>
                ))}
              </View>
            </ScrollView>
          )}
          { tabs === 'WR'&&(<ScrollView style={tw`flex-1`}>
            <View style={tw`bg-gray-100 flex-1 `}>
            <ScrollView style={tw`h-[120] w-full p-4`}>
              
              {logData&&logData.map((item,index)=>(
                <MsgItem key={index} type={item.type} msg={item.msg} timestr={item.timestr} />
              )
              )}
            </ScrollView>
            
              
            <View style={tw`bg-white`}>
              <View style={tw`flex-row justify-between px-4 py-2`}>
                <TextInput value={writeVal} onChangeText={text=>setWriteVal(text)} style={tw`bg-gray-100 h-10 w-[65%] rounded-md px-2`} placeholder='写入要发送的数据' />
                <View style={tw`flex-row w-[30]`}>
                  <ButtonItem title='发送' handClick={handleSend} bwrapStyle={'w-[50%] '}/>
                  <ButtonItem title='清除' handClick={()=>{setWriteVal('')}} bwrapStyle={'w-[50%] ml-1 bg-[#e10602]'}/>
                </View>
              </View>

              
              <RadioItem 
                title='发送显示' 
                onValueChange = {(value) => getRadioValue(value, 'send')}
                radioArr={[{
                  name:'Hex',
                  id:'1',
                },{
                  name:'Str',
                  id:'2',
                }]}
              />

              <RadioItem 
                title='接收显示' 
                onValueChange = {(value) => getRadioValue(value, 'recv')}
                radioArr={[{
                  name:'Hex',
                  id:'1',
                },{
                  name:'Str',
                  id:'2',
                }]}
              />
              <View style={tw`flex-row justify-start`}>
                {/* <RadioItem             
                  onValueChange = {(value) => getRadioValue(value, 'isLoop')}
                  radioArr={[{
                    name:'循环发送',
                    id:'1',
                  }]}
                /> */}
                <View style={tw`flex-row justify-start items-center ml-4`}>
                  <Text>发送频率</Text>
                  <TextInput onChangeText={handleTimeChange} style={tw`border-b w-[20] text-base text-center`} keyboardType="numeric" value={xhTime}/>
                  <Text>(秒/次)</Text>
                </View>
                <Switch value={radiaoVal.isLoop===1?true:false} onValueChange={(value) => getRadioValue(value?1:2, 'isLoop')} />
              </View>   

              <View style={tw`flex-row justify-between px-4 py-2`}>
                <TextInput keyboardType='numeric' value={mtuVal} onChangeText={text=>setMtuVal(text)} style={tw`bg-gray-100 h-10 w-[80%] rounded-md px-2`} placeholder='设置MTU' />
                
                <ButtonItem title='设置' handClick={handleSetMTU} bwrapStyle={'w-[20%] '}/>
                
              </View>

              <View style={tw`flex-col p-4`}>
                  <Text style={tw`font-black`}>当前使用的服务</Text>
                  <View >
                    <Text>写：SUUID：{writeParams.serviceUUID}</Text>
                    <Text>写：CUUID：{writeParams.characteristicUUID}</Text>
                    <Text>读：SUUID：{readParams.serviceUUID}</Text>
                    <Text>读：CUUID：{readParams.characteristicUUID}</Text>
                  </View>
              </View>
            </View>    
            
          </View></ScrollView>)}
        </View>  
        <Toast position='top' topOffset={50} visibilityTime={2000}/>  
    </SafeAreaView>
  )
}

export default Content


