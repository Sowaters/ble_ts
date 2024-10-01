import {  Text, View,ScrollView,TextInput, StatusBar} from 'react-native'
import React,{useState, useCallback} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc'
import {BleInfoItem, ButtonItem, MsgItem,RadioItem,HeadItem} from '@/components'
import icons from '@/constants/icons'
import {router} from 'expo-router'


const Content = () => {
  const [tabs, setTabs] = useState<string>('Services')
  const [xhTime, setXhTime] = useState<string | null>(null)
  // const [sendType, setSendType] = useState<string>()
  const getRadioValue = (value:string,type:string) => {
    
  }
  const handleTimeChange = useCallback((text:string) => {
    setXhTime(text)
  },[])

  const handleDiyClick = useCallback(() => {
    console.log('diy')
  },[])

  const handleDiyLongClick = useCallback(() => {
    console.log('longdiy')
  },[])

  return (
    <SafeAreaView style={tw`flex-1`}>
      <HeadItem icon={icons.set} title='设置' handlePress={()=>{router.push('/set')}}/>
      <ScrollView style={tw`w-full bg-white`} contentContainerStyle={{height:'100%'}}>
          
        <View style={tw`h-[50] bg-white`}>
          <View  style={tw`flex-row justify-between px-4 bg-white pb-2`}>
            <Text>Conneted</Text>
            <View style={tw`flex-row items-center`}>
              <Text onPress={()=>setTabs('Services')} style={tw`mr-4 ${tabs === 'Services'?'border-b-2 border-blue-500 text-blue-500':''}`}>Services</Text>
              <Text onPress={()=>setTabs('WR')} style={tw`${tabs !== 'Services'?'border-b-2 border-blue-500 text-blue-500':''}`}>Write&Read</Text>
            </View>
            
          </View>
          { tabs === 'Services'&&(<View style={tw`bg-white `}>
            <BleInfoItem title='Generic Access' uuid='1234567890' mainKey="123456789"/>
            <BleInfoItem title='Service Changed' uuid='1234567890' mainKey="123456789" isMain={false}/>
          </View>)}
          { tabs === 'WR'&&(<View style={tw`bg-gray-100`}>
            <ScrollView style={tw`min-h-[80%] w-full p-4`}>
              <MsgItem type={'Status'} msg={'连接中'} />
              <MsgItem type={'send'} msg={'Hello World'} />
              <MsgItem type={'recv'} msg={'Hello World'} />
            </ScrollView>
            
              
            <View style={tw`bg-white`}>
              <View style={tw`flex-row justify-between px-4 py-2`}>
                <TextInput style={tw`bg-gray-100 h-10 w-[65%] rounded-md px-2`} placeholder='写入要发送的数据' />
                <View style={tw`flex-row w-[30]`}>
                  <ButtonItem title='发送' handClick={()=>{}} bwrapStyle={'w-[50%] '}/>
                  <ButtonItem title='清除' handClick={()=>{}} bwrapStyle={'w-[50%] ml-1 bg-[#e10602]'}/>
                </View>
              </View>

              
              <RadioItem 
                title='发送显示' 
                onValueChange = {(value) => getRadioValue(value, 'send')}
                radioArr={[{
                  name:'Hex',
                  id:'1',
                },{
                  name:'Ascii',
                  id:'2',
                }]}
              />

              <RadioItem 
                title='接收显示' 
                onValueChange = {(value) => getRadioValue(value, 'send')}
                radioArr={[{
                  name:'Hex',
                  id:'1',
                },{
                  name:'Ascii',
                  id:'2',
                }]}
              />
              <View style={tw`flex-row justify-start`}>
                <RadioItem             
                  onValueChange = {(value) => getRadioValue(value, 'send')}
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
            
          </View>)}
        </View>  
      </ScrollView>   
      <StatusBar backgroundColor={'#ffffff'} barStyle={'dark-content'}/>    
    </SafeAreaView>
  )
}

export default Content


