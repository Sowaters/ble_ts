import {  Text, View } from 'react-native'
import React,{useState} from 'react'
import {Picker} from '@react-native-picker/picker';
import tw from 'twrnc';

interface PickerItemProps {
    title: string,
    pickWrapStyle?: string
}

const PickerItem = ({title,pickWrapStyle=''}: PickerItemProps) => {
    
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