import { Href, Stack,router } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{
          headerShown: false,
        }}
        />
      <Stack.Screen 
        name="(ble)" 
        options={{
          headerShown: false,
        }}
        />  
    </Stack>
  );
}
