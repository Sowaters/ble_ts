import {  Text, TouchableHighlight, View } from 'react-native'
import React from 'react'
import tw from 'twrnc'

interface BleDeviceProps {
    title:string,
    uuid:string,
    name?:string
    isMain?:boolean
    mainKey:string
}



const BleInfoItem = ({title,uuid,mainKey,name='Primary',isMain=true}:BleDeviceProps) => {

  const viewHtml = (<View style={tw`bg-white px-4 py-1 ${isMain?'':'ml-4'}` }>
                      <Text style={tw` ${isMain?'text-lg':''} font-bold`}>{title}</Text>
                      <Text style={tw`text-sm text-gray-500`}>uuid:{uuid} </Text>
                      <Text style={tw`text-sm text-gray-500`}>{name} </Text>
                  </View>)

  return (
    <>
    {isMain ? (<TouchableHighlight 
        underlayColor={'#000000'}      
        onPress={() => {
          
        }}
      > 
      {viewHtml}
    </TouchableHighlight>):(<View>
      {viewHtml}
    </View>)}
    </>
   
  )
}

export default BleInfoItem
