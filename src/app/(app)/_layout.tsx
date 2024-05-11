import Colors from "@/src/constants/Colors";
import { Stack } from "expo-router";

export default function AppEntry() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          navigationBarColor: Colors.black
        }}
      />
      <Stack.Screen
        name="chats"
        options={{
          presentation: 'modal',
          headerStyle: { backgroundColor: Colors.black },
          headerTintColor: Colors.white,
          navigationBarColor: Colors.black
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          presentation: 'modal',
          headerStyle: { backgroundColor: Colors.black },
          headerTintColor: Colors.white,
          headerShown: true,
          navigationBarColor: Colors.black
        }}
      />
      <Stack.Screen
        name="user"
        options={{
          presentation: 'modal',
          headerStyle: { backgroundColor: Colors.black },
          headerTintColor: Colors.white,
          navigationBarColor: Colors.black
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          presentation: 'modal',
          headerStyle: { backgroundColor: Colors.black },
          headerTintColor: Colors.white,
          navigationBarColor: Colors.black
        }}
      />
      <Stack.Screen
        name="paywall"
        options={{
          presentation: 'modal',
          headerStyle: { backgroundColor: Colors.black },
          headerTintColor: Colors.white,
          navigationBarColor: Colors.black
        }}
      />
    </Stack>
  )
}