import { Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeadItem } from '@/components'
import tw from 'twrnc'

const Helps = () => {
  const content = [
    {
      id: 1,
      title: 'localName',
      content: '设备的本地名称。这是设备在广播时使用的名称。',
    },
    {
      id: 2,
      title: 'isConnectable',
      content: '设备是否可连接',
    },
    {
      id: 3,
      title: 'manufacturerData',
      content: '设备的制造商数据',
    },
    {
      id: 4,
      title: 'mtu',
      content: '最大传输单元,表示设备支持的最大数据包大小',
    },
    {
      id: 5,
      title: 'overflowServiceUUIDs',
      content: '溢出服务 UUID 列表。',
    },
    {
      id: 6,
      title: 'rawScanRecord',
      content: '原始扫描记录',
    },
    {
      id: 7,
      title: 'serviceData',
      content: '服务数据',
    },
    {
      id: 8,
      title: 'serviceUUIDs',
      content: '服务 UUID 列表'
    },
    {
      id: 9,
      title: 'solicitedServiceUUIDs',
      content: '请求的服务 UUID 列表'
    },
    {
      id: 10,
      title: 'txPowerLevel',
      content: '设备的传输功率级别'
    },
  ]

  return (
    <SafeAreaView style={tw`flex-1`}>
      <HeadItem title="参数说明" />
      <View style={tw`flex-1`}>
        <View style={tw`p-4`}>
          {content.map(item=>(
            <View style={tw`flex-col`} key={item.id}>
              <Text style={tw`text-lg font-bold`}>{item.title}</Text>
              <Text>{item.content}</Text>
            </View>
          ))}
        </View>    
      </View>
    </SafeAreaView>
  )
}

export default Helps