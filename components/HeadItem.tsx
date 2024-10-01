import { TouchableOpacity, Image, View,Text,ImageSourcePropType  } from 'react-native'
import React from 'react'
import icons from '@/constants/icons'
import tw from 'twrnc'
import { router } from 'expo-router'

interface HeadItemProps {
  icon?: ImageSourcePropType  | string | undefined,
  title:string,
  isBack?: boolean,
  handlePress?: () => void
}

const HeadItem = ({icon='',title,isBack=true,handlePress=()=>{}}:HeadItemProps) => {
  return (
      <View style={tw`flex-row justify-around h-[13] items-center bg-white`}>
        <View style={tw`w-[33.3%]`}>
          {isBack&&<TouchableOpacity onPress={()=>router.back()} activeOpacity={1} style={tw`h-8 w-8 ml-4`}>
            <Image source={icons.back}  style={tw`h-8 w-8`} resizeMode="contain"/>
          </TouchableOpacity>}
        </View>
        <Text style={tw`w-[33.3%] text-2xl text-center`}>{title}</Text>
       <View style={tw`w-[33.3%] items-end `}>
       {icon&&<TouchableOpacity 
            activeOpacity={1}
            onPress ={() => {handlePress()}}
            ><Image 
            source={typeof icon === 'string' ? {uri:icon} : icon}
            style={tw`w-6 h-6 mr-4`} 
            resizeMode='contain'
          /></TouchableOpacity>}
        </View>
      </View>  
  )
}

export default HeadItem
