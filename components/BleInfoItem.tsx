import {  Text, TouchableHighlight, View, Image, TouchableOpacity } from 'react-native'
import React, {useCallback, useState, memo, useReducer} from 'react'
import tw from 'twrnc'
import icons from '@/constants/icons'

/**
 * 蓝牙特征 Characteristic
 * @param id 特征ID
 * @param serviceID 服务ID
 * @param deviceID 设备ID
 * @param serviceUUID 服务UUID
 * @param uuid 特征UUID
 * @param isIndicatable 是否可指示
 * @param isNotifiable 是否可通知
 * @param isNotifying 是否可读
 * @param isReadable 是否可写
 * @param isWritableWithResponse 是否可带响应地写
 * @param isWritableWithoutResponse 是否可不带响应地写
 * @param isReadSelected  是否已选择读取
 * @param isWriteSelected   是否已选择写入
 *   
 */
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
  // 是否可带响应地写
  isWritableWithResponse:boolean
  // 是否不带响应地写
  isWritableWithoutResponse:boolean
  // 是否可读选中的值
  isReadSelected:boolean
  // 是否可写选中的值
  isWriteSelected:boolean
} 

/**
 * @description: 蓝牙设备信息组件
 * @param {string} title                      标题
 * @param {string} uuid                       设备uuid
 * @param {number} curIndex                   当前选中项
 * @param {object} items                      设备信息
 * @param {string} name                       设备名称
 * @param {function} getSelectIndex           获取选中项
 */
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

/**
 * initialState 初始化蓝牙设备信息
 * @param items 蓝牙设备信息
 * @returns 
 */
const initialState = (items: { characteristics: Characteristic[] }) => {  

  return {  
    ...items,  
  }; 
}; 

/**
 * 
 * @param state 蓝牙设备信息
 * @param action 
 * @returns 
 */
const reducer = (state: { characteristics: Characteristic[] }, action: { type: 'R' | 'W'; index: number }) => {  
  
  const newItems = { ...state };  
 
  const characteristic = newItems.characteristics[action.index];  

  // 根据action.type的值，更新characteristic的isReadSelected或isWriteSelected属性
  if (action.type === 'R') {  
    characteristic.isReadSelected = !characteristic.isReadSelected;  
  } else {  
    characteristic.isWriteSelected = !characteristic.isWriteSelected;  
  }  
  // 返回新的state对象
  return { ...newItems };  
};

/**
 * BleInfoItem 组件
 * @param uuid 蓝牙设备id
 * @param items 蓝牙设备信息
 * @param curIndex 当前选中的蓝牙设备索引
 * @param getSelectIndex 获取当前选中的蓝牙设备索引
 * @param title 蓝牙设备标题
 * @param name 蓝牙设备名称
 *  
 */
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
