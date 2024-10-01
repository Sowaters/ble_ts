import {  Text, View, Image, Linking, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc'
import icons from '@/constants/icons'
import { HeadItem } from '@/components'

const Set = () => {
  const setList = [ {
    id: 2,
    name: '使用帮助',
  }, {
    id: 3,
    name: '问题反馈',
  }
  ]

  const emailConfig = {
    email: '377014021@qq.com',
    subject: '问题反馈',
    body: '请输入您的问题反馈'
  }
  const mailtoLink = `mailto:${emailConfig.email}?subject=${encodeURIComponent(emailConfig.subject)}&body=${encodeURIComponent(emailConfig.body)}`;
 
  const handleItem = (id: number)=>{
      if(id === 3){
        Linking.openURL(mailtoLink)
          .then(() => {
            console.log('Email opened successfully');
            
          })
          .catch((error) => {
            console.log('Failed to open email: ',error);
            Alert.alert(
              "提示",
              "打开邮件失败，请检查邮件客户端是否可用",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                { text: "OK", onPress: () => console.log("OK Pressed") }
              ]
            );
          })
      }
  } 
  return (
    <SafeAreaView >
      <HeadItem title='settings'/>
      <View style={tw`w-full `}>
        {setList.map((item,index) => (<TouchableOpacity activeOpacity={1} onPress={()=>handleItem(item.id)}  style={tw`flex-row px-4 py-4 justify-between ${index !== setList.length-1 ? 'border-b' : ''} border-gray-200 bg-white items-center`} key={item.id}>
          <Text >{item.name}</Text>
          <Image source={icons.arrow} resizeMode='contain' style={tw`w-4 h-4`}/>
        </TouchableOpacity>))
        }
        
      </View>
    </SafeAreaView>
  )
}

export default Set
