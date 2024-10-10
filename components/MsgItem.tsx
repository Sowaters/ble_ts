import { Text, View } from 'react-native'
import React, { memo } from 'react'
import tw from 'twrnc'
import { MsgProps } from '@/types/types'

/**
 * MsgItem组件，用于显示消息内容
 * @param {MsgProps} props - 消息属性
 * @returns {JSX.Element} - 返回一个View组件，包含Text组件和根据type属性的不同显示不同的Text组件
 * 
 */
const MsgItem = memo(({msg,type,timestr}:MsgProps) => {
    return (
    <View style={tw`flex-row items-center justify-start`}>
      <Text>{timestr+'>>'}</Text>
      {type === 'recv'&&<Text style={tw`text-green-500`}>Recv:{msg}</Text>}
      {type === 'send'&&<Text style={tw`text-blue-500`}>Send:{msg}</Text>}
      {type === 'Status'&&<Text>{msg}</Text>}
      {type === 'sendFail'&&<Text style={tw`text-red-500`}>SendFail:{msg}</Text>}
    </View>
  )
})

export default MsgItem