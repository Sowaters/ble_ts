import React, { useRef, memo } from 'react';  
import {  Text, StyleSheet, PanResponder, Animated, Pressable } from 'react-native';  
import tw from 'twrnc';

interface DraggableButtonProps {
    title?:string,
    handleClick:()=>void
    handleLongClick?:()=>void
}
  
const DraggableButton = memo(({title='按钮1',handleClick,handleLongClick=()=>{}}:DraggableButtonProps) => {  
//   // 定义按钮位置
    
    
    // 定义按钮位置
    const pan = useRef(new Animated.ValueXY()).current;
    
    // 创建PanResponder
    const panResponder = useRef(
        PanResponder.create({
          // 当用户开始移动时，设置PanResponder
          onMoveShouldSetPanResponder: () => true,
          // 当用户开始移动时，设置偏移量
          onPanResponderGrant: () => {
            
            pan.setOffset({
              x: pan.x._value,
              y: pan.y._value
            });
          },
          // 当用户移动时，更新位置
          onPanResponderMove: Animated.event(
            [
              null,
              { dx: pan.x, dy: pan.y }
            ]
          ),
          // 当用户释放时，重置偏移量
          onPanResponderRelease: () => {
           
            pan.flattenOffset();
          }
        })
      ).current; 
  
  return (  
    // 使用Animated.View包裹按钮，并设置PanResponder
    <Animated.View  
      {...panResponder.panHandlers}  
      style={[  
        styles.button,  
        {  
          // 设置按钮位置
          transform: [  
            { translateX: pan.x },  
            { translateY: pan.y },  
          ],  
        }, 
         
      ]}  
    >  
    <Pressable 
    onPress={()=>{handleClick()
    }} 
    onLongPress = {()=>{handleLongClick()
    }}
     style={({pressed })=>[{
        backgroundColor: pressed
            ? '#0Eb098'
            : '#14b8a6'
     },tw`w-[15] h-[15] justify-center rounded-[8]}`]}
    >
        <Text style={styles.text}>{title}</Text>  
    </Pressable>
    </Animated.View>  
  );  
});  
  
// 定义样式
const styles = StyleSheet.create({  
  button: {   
    // 设置按钮样式
    // backgroundColor: '#14b8a6',  
    // borderRadius: 30, 
    // width:60,
    // height:60,
    // justifyContent:'center',
  },  
  text:{
    // 设置文本样式
    textAlign:'center',
    color:'#fff',
  }
});  
  
export default DraggableButton;