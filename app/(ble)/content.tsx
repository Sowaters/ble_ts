import {  Text, View,ScrollView,TextInput} from 'react-native'
import React,{useState, useCallback, useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc'
import {BleInfoItem, ButtonItem, MsgItem,RadioItem,HeadItem} from '@/components'
import icons from '@/constants/icons'
import BluetoothApi from "@/store/ble/bluetoothApi";
import {router, useLocalSearchParams } from 'expo-router'
import { useDispatch, useSelector } from "react-redux";
import { setReadParms, setWriteParms } from "@/store/ble/bluetoothSlice";
import { RootState } from "@/store";

const Content = () => {
  const dispatch = useDispatch();
  const {readParams,writeParams} = useSelector((state:RootState) => state.ble)
  
  const [tabs, setTabs] = useState<'Services'|'WR'>('Services')
  const [xhTime, setXhTime] = useState<string | null>(null)
  const [serviceList, setServiceList] = useState<any[]>([])
  const [writeVal, setWriteVal] = useState<string>('')
  const [logData, setLogData] = useState<any[]>([])
  const [radiaoVal, setRadiaoVal] = useState<{send:number,recv:number,isLoop:number}>({
    send:1,
    recv:1,
    isLoop:1
  })
  
  const addLog = (data:{}) => {
    setLogData(prevLogData=>[...prevLogData,data])
  }

  const {deviceId} = useLocalSearchParams()
  
  useEffect(() => {
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
      
      // console.log(characteristics);
      Promise.all(promises).then(results => {
        setServiceList(results)
      }).catch(error => {
        console.error('Error fetching characteristics',error);
      })
      
    })

  },[])
 
  const handelTabs = (tabsVal:'WR'|'Services') => {
    setTabs(tabsVal)
    if(tabsVal === 'WR'){
      BluetoothApi.notify(deviceId as string,readParams.serviceUUID,readParams.characteristicUUID, res => {
        console.log(res.message);
        
        addLog({type:'recv',msg:res.message})
      })
    }
  }
  
  const handleSelect = (tzIndex:number,serIndex:number,type:string,status:boolean) => {
      console.log(tzIndex,type,serIndex,status);
      if (status === false ){
          const deviceInfo = serviceList[serIndex].characteristics[tzIndex];
          if(type === 'R'){
            dispatch(setReadParms({serviceUUID:deviceInfo.serviceUUID,characteristicUUID:deviceInfo.uuid}))
          }else{
            dispatch(setWriteParms({serviceUUID:deviceInfo.serviceUUID,characteristicUUID:deviceInfo.uuid,isWriteWithoutResponse:deviceInfo.isWriteWithoutResponse}))
          }
      }else{
        if(type === 'R'){
          dispatch(setReadParms({serviceUUID:'',characteristicUUID:''}))
        }else{
          dispatch(setWriteParms({serviceUUID:'',characteristicUUID:'',isWriteWithoutResponse:false}))
        }  
      }  
    }

  // const [sendType, setSendType] = useState<string>()
  const getRadioValue = useCallback((value:string,type:'send'|'recv'|'isLoop') => {
    setRadiaoVal({...radiaoVal,[type]:value})   
  },[radiaoVal])

  const handleSend = useCallback(() => {
      // A66A0001A10D0A 
    

    if(writeVal === ''){
      return
    } 
    let sendData = radiaoVal.send===1?writeVal:BluetoothApi.asciiToHex(writeVal)
    console.log(sendData);
      addLog({type:'send',msg:writeVal})
    if(writeParams.isWriteWithoutResponse){
      BluetoothApi.writeOutData(deviceId as string,writeParams.serviceUUID,writeParams.characteristicUUID,sendData,res=>{
        
      })
    }else{
      BluetoothApi.writeData(deviceId as string,writeParams.serviceUUID,writeParams.characteristicUUID,sendData,res=>{
        
      })
    }  
  },[writeVal])
  const handleTimeChange = useCallback((text:string) => {
    setXhTime(text)
  },[])

  return (
    <SafeAreaView style={tw`flex-1`}>
      <HeadItem icon={icons.set} title='设置' handlePress={()=>{router.push('/set')}}/>  
        <View style={tw`flex-1 bg-white`}>
          <View  style={tw`flex-row justify-between px-4 bg-white pb-2`}>
            <Text>Conneted</Text>
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
                <MsgItem key={index} type={item.type} msg={item.msg} />
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
                <RadioItem             
                  onValueChange = {(value) => getRadioValue(value, 'isLoop')}
                  radioArr={[{
                    name:'循环发送',
                    id:'1',
                  }]}
                />
                <View style={tw`flex-row justify-start items-center`}>
                  <Text>发送频率</Text>
                  <TextInput onChangeText={handleTimeChange} style={tw`border-b w-[20] text-base text-center`} keyboardType="numeric" value={xhTime??''}/>
                  <Text>(秒/次)</Text>
                </View>
                
              </View>    
            </View>    
            
          </View></ScrollView>)}
        </View>  
    </SafeAreaView>
  )
}

export default Content


