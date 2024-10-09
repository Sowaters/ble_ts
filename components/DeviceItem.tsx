import {Text, TouchableHighlight, View } from 'react-native'
import React, { memo, useState } from 'react'
import ButtonItem from './ButtonItem'
import tw from 'twrnc'
import {BluetoothDevice} from '@/types/types'

interface deviceItemProps {
    device:BluetoothDevice
    handleClick:()=> void
    isLoading?:boolean
    deviceWrapStyle?: string|undefined
}
const DeviceItem = memo(({
      device,
      handleClick,
      isLoading,
      deviceWrapStyle=''
    }: deviceItemProps) => {
  const [showSubItems, setShowSubItems] = useState(false)
      
    
  return (
 
      <View style={tw`flex-col bg-white border-b`}>
        <TouchableHighlight activeOpacity={0.9} onPress={() =>setShowSubItems(!showSubItems)}>
          <View style={tw`flex-row bg-white justify-between py-4 border-gray-600 px-4 ${deviceWrapStyle}`}>
              <View style={tw`flex-row items-center`}>
                  <View style={tw`w-10 h-10 rounded-full mr-2 items-center justify-center`}>
                      <Text style={tw`font-black`}>{device.rssi}</Text>
                  </View>
                  <View>
                      <Text style={tw`text-black`}>{device.name||'Unnamed'}</Text>
                      <Text style={tw`text-gray-600 text-xs`}>{device.id}</Text>
                  </View>
              </View>
              <ButtonItem title='连接' handClick={handleClick} isLoading={isLoading} bwrapStyle='w-[18]' />
          </View>
        </TouchableHighlight>  
        
          {showSubItems && (
              <View style={tw`flex-col ml-6`}>
                  {device && Object.entries(device).map(([key, value]) => {
                      if (key !== 'id' && key !== 'rssi' && key !== 'name') {
                          return (
                              <View
                                  key={`${device.id}-${key}`}
                                  style={tw`${(key === 'rawScanRecord' || key === 'serviceData') ? 'flex-col' : 'flex-row'}`}
                              >
                                  <Text style={tw`text-xs font-bold`}>{key}：</Text>
                                  {typeof value === 'object' && value !== null ? (
                                      <View style={tw`flex-row ml-2`}>
                                          {Object.entries(value).map(([key1, value2]) => (
                                              <View key={key1}>
                                                  <Text style={tw`text-xs text-gray-400`}>{key1}:</Text>
                                                  <Text style={tw`text-xs text-gray-400`}>
                                                      {value2 === null ? 'Unknown' : value2 + ''}
                                                  </Text>
                                              </View>
                                          ))}
                                      </View>
                                  ) : (
                                      <Text style={tw`text-xs text-gray-400`}>
                                          {value === null ? 'Unknown' : value+''}
                                      </Text>
                                  )}
                              </View>
                          );
                      }
                  })}
              </View>
          )}
      </View>
    )
}) 

export default DeviceItem
