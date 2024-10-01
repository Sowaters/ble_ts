import { Button, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import React, { memo, useState } from 'react'
import ButtonItem from './ButtonItem'
import tw from 'twrnc'
import {BluetoothDevice} from '@/types/types'

interface deviceItemProps {
    device:BluetoothDevice
    handleClick:()=> void
    deviceWrapStyle?: string|undefined
}
const DeviceItem = memo(({
      device,
      handleClick,
      deviceWrapStyle=''
    }: deviceItemProps) => {
  const [showSubItems, setShowSubItems] = useState(true)
      
    
  return (
 
      <View style={tw`flex-col bg-white border-b`}>
        <TouchableHighlight activeOpacity={0.9} onPress={() =>setShowSubItems(!showSubItems)}>
          <View style={tw`flex-row bg-white justify-between py-4 border-gray-600 px-4 ${deviceWrapStyle}`}>
              <View style={tw`flex-row items-center`}>
                  <View style={tw`w-10 h-10 rounded-full mr-2 items-center justify-center`}>
                      <Text style={tw`font-black`}>{device.rssi}</Text>
                  </View>
                  <View>
                      <Text style={tw`text-black`}>{device.name}</Text>
                      <Text style={tw`text-gray-600 text-xs`}>{device.id}</Text>
                  </View>
              </View>
              <ButtonItem title='连接' handClick={handleClick} bwrapStyle='w-[18]' />
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
                                                      {value2 === null ? 'N/A' : value2 + ''}
                                                  </Text>
                                              </View>
                                          ))}
                                      </View>
                                  ) : (
                                      <Text style={tw`text-xs text-gray-400`}>
                                          {value === null ? 'N/A' : value+''}
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


{/* <TouchableHighlight style={tw`flex-1`} activeOpacity={0.9} onPress={()=>setShowSubItems(!showSubItems)}>
      <View style={tw`flex-col bg-white border-b relative`}>
        <View style={tw`flex-row justify-between py-4  border-gray-600 px-4 ${deviceWrapStyle}`}>
            <View style={tw`flex-row items-center`}>
                <View style={tw`w-10 h-10  rounded-full mr-2 items-center justify-center`}>
                  <Text style={tw`font-black`}>{device.rssi}</Text>
                </View>
                <View>
                    <Text style={tw`text-black`}>{device.name}</Text>
                    <Text style={tw`text-gray-600 text-xs`}>{device.id}</Text>
                </View>
            </View>
            <ButtonItem title='连接' handClick={handleClick}/>
        </View>
        {(<View style={tw`flex-col ml-6 ${showSubItems?'':'hidden'}`}>
          {
            device&&Object.entries(device).map(([key,value])=>{
              if(key !== 'id' && key !== 'rssi' && key !== 'name'){
                return (<View style={tw`${(key === 'rawScanRecord'||key === 'serviceData')?'flex-col':'flex-row'} `} key={`${device.id}-${key}`}>
                        <Text style={tw`text-xs font-bold`}>{key}：</Text>
                        
                        {(typeof value === 'object' && value !== null)?(
                          <View style={tw`flex-row`}>
                            {value && Object.entries(value).map(([key1, value2]) => (  
                              <View>
                                <Text style={tw`text-xs text-gray-400`}>{key1}:</Text>
                                <Text style={tw`text-xs text-gray-400`}>{(value2=== null)?'N/A':value2+''}</Text>
                              </View>
                            ))}
                          </View>
                        ):(<Text style={tw`text-xs text-gray-400`}>{(value === null)?'N/A':value+''}</Text>)}
                      </View>)

              }
            })
          }
        </View>)}
      </View>
    </TouchableHighlight> */}