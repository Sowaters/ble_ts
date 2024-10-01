import {  Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import tw from 'twrnc'

interface ButtonStyle {
    bwrapStyle?: string,
    textStyle?: string,
    title: string,
    handClick: () => void
}

const ButtonItem = ({title,handClick,bwrapStyle="",textStyle=""}:ButtonStyle) => {
  return (
    <TouchableOpacity 
        style={tw`bg-[#333] rounded-md p-2 ${bwrapStyle}`}
        activeOpacity={0.8}
        onPress={() => {
            // console.log('connect')
            handClick()
        }}
    >
        <Text style={tw`text-center text-[#fff] font-bold ${textStyle}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default ButtonItem
