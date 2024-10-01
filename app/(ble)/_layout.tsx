
import { Href, router, Stack } from 'expo-router'

const Blelayout = () => {
  return (
    <Stack>
      <Stack.Screen name='content' 
      options={{ 
        headerShown: false,
        title: 'BLE'
        }} />
        <Stack.Screen 
          name='set' 
          options={{headerShown: false}} />
    </Stack>
  )
}

export default Blelayout
