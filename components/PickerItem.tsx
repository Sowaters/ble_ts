import {  Text, View } from 'react-native'
import React,{useState} from 'react'
import {Picker} from '@react-native-picker/picker';
import tw from 'twrnc';

/**
 *  定义PickerItemProps接口
 *  @interface PickerItemProps
 *  @param {string} title - PickerItem的标题
 *  @param {string} [pickWrapStyle=''] - PickerItem的样式，默认为空字符串
 *  @returns {JSX.Element} PickerItem组件
 */
interface PickerItemProps {
    title: string,
    pickWrapStyle?: string
}

/**
 *  PickerItem组件
 */

const PickerItem = ({title,pickWrapStyle=''}: PickerItemProps) => {
    
  // 使用useState钩子，定义selectedLanguage状态，并设置初始值为undefined
  const [selectedLanguage, setSelectedLanguage] = useState();

  return (
    <View style={tw`flex-row items-center justify-start ${pickWrapStyle}`}>
        <Text style={tw`text-gray-400`}>{title}：</Text>
        <View style={tw`w-[100%]`}>
            <Picker
                style={{direction: 'rtl'}}
                selectedValue={selectedLanguage}
                onValueChange={(itemValue, itemIndex) =>
                    setSelectedLanguage(itemValue)
                }>
                <Picker.Item label="HEX" value="Hex" />
                <Picker.Item label="ASCII" value="Ascii" />
            </Picker>

            
        </View> 
    </View>  
  )
}

export default PickerItem