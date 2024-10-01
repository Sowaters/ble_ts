import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"

const SetLatout = () => {
  return (
    <>
    <Stack>
        <Stack.Screen name="helps" options={{headerShown: false}}/>
    </Stack>
    <StatusBar style="dark" backgroundColor="#fff"  />
    </>
  )
}

export default SetLatout
