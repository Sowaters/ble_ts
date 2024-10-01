import {  Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React from 'react'
import tw from 'twrnc'

interface ButtonStyle {
    bwrapStyle?: string,
    textStyle?: string,
    isLoading?: boolean,
    title: string,
    handClick: () => void
}

const ButtonItem = ({title,handClick,isLoading,bwrapStyle="",textStyle=""}:ButtonStyle) => {
  return (
    <TouchableOpacity 
        style={tw`bg-[#333] flex flex-row items-center justify-center rounded-md p-2 ${bwrapStyle}`}
        activeOpacity={0.8}
        onPress={() => {
            // console.log('connect')
            handClick()
        }}
    >
        <Text style={tw`text-[#fff] ${textStyle}`}>{title}</Text>
        {
          isLoading && (<ActivityIndicator
            animating={isLoading}
            size={"small"}
            style={tw`ml-1`}
          ></ActivityIndicator>)
        }
    </TouchableOpacity>
  )
}

export default ButtonItem
