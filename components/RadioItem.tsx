import {  Text, View, Image, TouchableOpacity} from 'react-native'
import React,{useState} from 'react'
import tw from 'twrnc';
import icons from '../constants/icons'

interface RadioItemProps {
    title?:string,
    radioArr:{
        id:string,
        name:string
    }[],
    onValueChange:(id:number)=>void,
    rwrapStyle?:any
}

const RadioItem = ({title='',radioArr,onValueChange,rwrapStyle=''}:RadioItemProps) => {

    const [checkedId,setCheckedId]=useState<string>(radioArr[0].id)

    const handleClick = (id:string)=>{      
        setCheckedId(id)
        onValueChange(Number(id)); 
    }
  return (
    <View style={tw`flex-row items-center justify-start px-4 py-2 ${rwrapStyle}`}>
        {title&&<Text>{title}:</Text>}
        <View style={tw`flex-row justify-start ${title&&'ml-2'}`}>
            
            {radioArr&&radioArr.map(item=>(
                <TouchableOpacity 
                        style={tw`flex-row items-center justify-start ${title&&'ml-1'}`} 
                        activeOpacity={1} 
                        onPress={(e)=>handleClick(item.id)}
                        key={item.id}
                    >
                    <Image source={item.id === checkedId?icons.radioOn:icons.radio} style={tw`w-8 h-8`} resizeMode={"contain"} />
                    <Text style={tw`text-black`}>{item.name}</Text>
                </TouchableOpacity>
            ))}
            
        </View> 
    </View>  
  )
}

export default RadioItem