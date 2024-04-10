import Colors from "@/src/constants/Colors";
import { Stack } from "expo-router";

export default function AppEntry() {
  return (
    <Stack>
      <Stack.Screen 
        name="(tabs)" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="chats" 
        options={{ 
          presentation: 'modal', 
          headerStyle: {backgroundColor: Colors.black}, 
          headerTintColor: Colors.white 
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ 
          presentation: 'modal', 
          headerStyle: {backgroundColor: Colors.black}, 
          headerTintColor: Colors.white 
        }} 
      />
    </Stack>
  )
}