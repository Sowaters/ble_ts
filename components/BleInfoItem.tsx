import {  Text, TouchableHighlight, View, Image, TouchableOpacity } from 'react-native'
import React, {useCallback, useState, memo, useReducer} from 'react'
import tw from 'twrnc'
import icons from '@/constants/icons'

interface Characteristic {
  id: number
        serviceID:string
        deviceID:string
        serviceUUID:string
        uuid:string,
        isIndicatable:boolean
        isNotifiable:boolean
        isNotifying:boolean
        isReadable:boolean
        isWritableWithResponse:boolean
        isWritableWithoutResponse:boolean
        isReadSelected:boolean
        isWriteSelected:boolean
} 

interface BleDeviceProps {
    title?:string
    uuid:string
    curIndex:number
    items:{
      [key:string]:any
      characteristics:Characteristic[]
    }
    name?:string
    getSelectIndex: (index:number,index1:number,type:'R' | 'W',status:boolean) => void
}

const initialState = (items: { characteristics: Characteristic[] }) => ({  
  ...items,  
}); 

const reducer = (state: { characteristics: Characteristic[] }, action: { type: 'R' | 'W'; index: number }) => {  
  const newItems = { ...state };  
  const characteristic = newItems.characteristics[action.index];  

  if (action.type === 'R') {  
    characteristic.isReadSelected = !characteristic.isReadSelected;  
  } else {  
    characteristic.isWriteSelected = !characteristic.isWriteSelected;  
  }  
  return { ...newItems };  
};

const BleInfoItem = memo(({uuid,items,curIndex,getSelectIndex,title='Service',name='Primary'}:BleDeviceProps) => {

  const [showSubs , setShowSubs] = useState(false)

  const [state, dispatch] = useReducer(reducer, initialState(items));

  const handleSelect = useCallback((index:number,status:boolean,action:'R'|'W') => {
    
    getSelectIndex(index,curIndex,action,!status)
    dispatch({ type: action, index });  
  },[])

  return (
    <>
      <TouchableHighlight 
        underlayColor={'#000000'}      
        onPress={() => {
          setShowSubs(!showSubs)
        }}
      > 
        <View style={tw`bg-white px-4 py-1}` }>
            <Text style={tw`text-lg font-bold`}>{title}</Text>
            <Text style={tw`text-sm text-gray-500`}>UUID:{uuid} </Text>
            <Text style={tw`text-sm text-gray-500`}>{name} </Text>
        </View>
      </TouchableHighlight>
      <View style={tw`ml-6 w-full`}>
        
          {showSubs&&items.characteristics&&items.characteristics.map((characteristic:any,index:number) => (
            <View style={tw`flex-row `} key={characteristic.id}>
              <View style={tw`flex-col w-[75%]`} key={characteristic.id}>
                  <Text style={tw`text-lg font-bold`}>characteristics</Text>
                  <Text>UUID：{characteristic.uuid}</Text>
                  <Text>Properties：{characteristic.isNotifiable&&'Notify, '} {characteristic.isReadable&&'Read, '} {characteristic.isWritableWithResponse&&'Write, '} {characteristic.isWritableWithoutResponse&&'Write No Response'} </Text>
              </View>
              <View style={tw`flex-row w-[15%] items-center `}>
              {(characteristic.isNotifiable||characteristic.isReadable)&&(
                <TouchableOpacity onPress={()=>handleSelect(index,characteristic.isReadSelected,'R')} style={tw`flex-row items-center justify-center`}>
                  <Text style={tw`font-bold text-ls`}>{characteristic.isNotifiable?'N':'R'}</Text>
                  <Image source={characteristic.isReadSelected?icons.radioOn:icons.radio} style={tw`w-6 h-6`} resizeMode="contain"/>
                </TouchableOpacity>
              )}
                {characteristic.isWritableWithResponse&&(
                  <TouchableOpacity onPress={()=>handleSelect(index,characteristic.isWriteSelected,'W')}  style={tw`flex-row items-center justify-center`}>
                    <Text style={tw`font-bold text-ls`}>W</Text>
                    <Image source={characteristic.isWriteSelected?icons.radioOn:icons.radio} style={tw`w-6 h-6`} resizeMode="contain"/>
                  </TouchableOpacity>
                  )}
                
              </View>
            </View>
          ))
          }
      
      </View>   
    </>
  )
})

export default BleInfoItem
