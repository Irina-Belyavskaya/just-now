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
            navigationBarColor: Colors.darkBlue,
            statusBarColor: Colors.darkBlue
          }}
        />
        <Stack.Screen
          name="chats"
          options={{
            presentation: 'modal',
            headerStyle: { backgroundColor: Colors.darkBlue },
            headerTintColor: Colors.white,
            navigationBarColor: Colors.darkBlue
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            presentation: 'modal',
            headerStyle: { backgroundColor: Colors.darkBlue },
            headerTintColor: Colors.white,
            headerShown: true,
            navigationBarColor: Colors.darkBlue
          }}
        />
        <Stack.Screen
          name="user"
          options={{
            presentation: 'modal',
            headerStyle: { backgroundColor: Colors.darkBlue },
            headerTintColor: Colors.white,
            navigationBarColor: Colors.darkBlue
          }}
        />
        <Stack.Screen
          name="notifications"
          options={{
            presentation: 'modal',
            headerStyle: { backgroundColor: Colors.darkBlue },
            headerTintColor: Colors.white,
            navigationBarColor: Colors.darkBlue
          }}
        />
        <Stack.Screen
          name="paywall"
          options={{
            presentation: 'modal',
            headerStyle: { backgroundColor: Colors.darkBlue },
            headerTintColor: Colors.white,
            navigationBarColor: Colors.darkBlue
          }}
        />
        <Stack.Screen
          name="channel/[cid]"
          options={{
            presentation: 'modal',
            headerStyle: { backgroundColor: Colors.darkBlue },
            headerTintColor: Colors.white,
            navigationBarColor: Colors.darkBlue,
            headerTitle: 'Loading...'
          }}
        />
        <Stack.Screen
          name="users"
          options={{
            presentation: 'modal',
            headerStyle: { backgroundColor: Colors.darkBlue },
            headerTintColor: Colors.white,
            navigationBarColor: Colors.darkBlue
          }}
        />
      </Stack>
    </ChatProvider>
  )
}