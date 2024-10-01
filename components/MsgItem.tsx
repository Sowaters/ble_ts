import { Text, View } from 'react-native'
import React, { memo } from 'react'
import tw from 'twrnc'
import moment from 'moment'

interface MsgProps {
    msg:string,
    type:'recv'|'send'|'Status',
}

const MsgItem = memo(({msg,type}:MsgProps) => {
    
    
    const timeStr = moment().format('HH:mm:ss.SSS')//获取当前时间;
    return (
    <View style={tw`flex-row items-center justify-start`}>
      <Text>{timeStr+'>>'}</Text>
      {type === 'recv'&&<Text style={tw`text-green-500`}>Recv:{msg}</Text>}
      {type === 'send'&&<Text style={tw`text-blue-500`}>Send:{msg}</Text>}
      {type === 'Status'&&<Text>{msg}</Text>}
    </View>
  )
})

export default MsgItem
