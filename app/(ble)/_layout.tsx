
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const Blelayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name='content'
          options={{
            headerShown: false,
          }} />
        <Stack.Screen
          name='set'
          options={{ headerShown: false }} />

        
      </Stack>
      <StatusBar backgroundColor='#ffffff' style='dark'/>  
    </>
  )
}

export default Blelayout
