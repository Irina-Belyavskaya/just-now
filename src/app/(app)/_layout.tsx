import Colors from "@/src/constants/Colors";
import { Stack } from "expo-router";
import ChatProvider from "@/src/providers/ChatProvider";

export default function AppEntry() {
  return (
    <ChatProvider>
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
        <Stack.Screen
          name="channel"
          options={{
            presentation: 'modal',
            headerStyle: { backgroundColor: Colors.black },
            headerTintColor: Colors.white,
            navigationBarColor: Colors.black
          }}
        />
        <Stack.Screen
          name="users"
          options={{
            presentation: 'modal',
            headerStyle: { backgroundColor: Colors.black },
            headerTintColor: Colors.white,
            navigationBarColor: Colors.black
          }}
        />
      </Stack>
    </ChatProvider>
  )
}