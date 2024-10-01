import { Button, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import React from 'react'
import ButtonItem from './ButtonItem'
import tw from 'twrnc'

interface deviceItemProps {
    name: string
    uuid: string,
    handleClick:()=> void,
    deviceWrapStyle?: string|undefined
}
const DeviceItem = ({name,uuid,handleClick,deviceWrapStyle=''}: deviceItemProps) => {
  return (
    <View style={tw`flex-row justify-between bg-white py-4 border-b border-gray-600 px-4 ${deviceWrapStyle}`}>
        <View style={tw`flex-row items-center`}>
            <View style={tw`w-10 h-10 bg-gray-200 rounded-full mr-2`}></View>
            <View>
                <Text style={tw`text-black`}>{name}</Text>
                <Text style={tw`text-gray-600 text-xs`}>{uuid}</Text>
            </View>
        </View>
        <ButtonItem title='连接' handClick={handleClick}/>

    </View>
  )
}

export default DeviceItem
