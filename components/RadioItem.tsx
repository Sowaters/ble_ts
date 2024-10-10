import {  Text, View, Image, TouchableOpacity} from 'react-native'
import React,{useState} from 'react'
import tw from 'twrnc';
import icons from '../constants/icons'

/**
 * 定义RadioItemProps接口，用于定义RadioItem组件的props
 * @title 标题
 * @radioArr 单选按钮数组
 * @onValueChange 单选按钮值改变时的回调函数
 * @rwrapStyle 单选按钮外层样式
 *  
 */
interface RadioItemProps {
    title?:string, 
    radioArr:{
        id:string, 
        name:string 
    }[], 
    onValueChange:(id:number)=>void, 
    rwrapStyle?:any 
}

/** 
 * RadioItem组件，用于显示单选按钮列表
 * @props RadioItemProps类型的props
 * @returns JSX.Element
 *  
 */
const RadioItem = ({title='',radioArr,onValueChange,rwrapStyle=''}:RadioItemProps) => {

    // 使用useState钩子，定义checkedId状态，用于记录当前选中的单选按钮的id
    const [checkedId,setCheckedId]=useState<string>(radioArr[0].id)

    // 定义handleClick函数，用于处理单选按钮的点击事件
    const handleClick = (id:string)=>{      
        setCheckedId(id) // 更新checkedId状态
        onValueChange(Number(id)); // 调用onValueChange回调函数，传入当前选中的单选按钮的id
    }
  return (
    <View style={tw`flex-row items-center justify-start px-4 py-2 ${rwrapStyle}`}>
        {title&&<Text>{title}:</Text>} // 如果有标题，则显示标题
        <View style={tw`flex-row justify-start ${title&&'ml-2'}`}> // 单选按钮外层View组件，用于包裹单选按钮
            {radioArr&&radioArr.map(item=>( // 遍历radioArr数组，生成单选按钮
                <TouchableOpacity 
                        style={tw`flex-row items-center justify-start ${title&&'ml-1'}`} 
                        activeOpacity={1} 
                        onPress={(e)=>handleClick(item.id)}
                        key={item.id}
                    >
                    <Image source={item.id === checkedId?icons.radioOn:icons.radio} style={tw`w-8 h-8`} resizeMode={"contain"} /> // 根据当前选中的单选按钮的id，显示不同的图片
                    <Text style={tw`text-black`}>{item.name}</Text> // 显示单选按钮的名称
                </TouchableOpacity>
            ))}
        </View> 
    </View>  
  )
}

export default RadioItem