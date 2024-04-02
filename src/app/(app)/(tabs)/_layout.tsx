import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { Pressable, View } from 'react-native';

import Colors from '@/src/constants/Colors';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useClientOnlyValue } from '@/src/components/useClientOnlyValue';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.pickedYelllow,
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: { backgroundColor: Colors.black },
        headerStyle: { backgroundColor: Colors.black},
        headerTintColor: Colors.white
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title:'Home',
          tabBarLabel:() => {return null},
          tabBarIcon: ({ color }) => <AntDesign name="home" color={color} size={25} />,
          headerRight: () => (
            <Link href="/chats" asChild>
              <Pressable>
                {({ pressed }) => (
                  <Feather 
                    name="message-circle"
                    size={25}                   
                    color={'white'}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title:'Search',
          tabBarLabel:() => {return null},
          tabBarIcon: ({ color }) => <Feather name="search" color={color} size={25} />,
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title:'Camera',
          tabBarLabel:() => {return null},
          tabBarIcon: ({ color }) => <Feather name="camera" color={color} size={24}/>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title:'Profile',
          tabBarLabel:() => {return null},
          tabBarIcon: ({ color }) => <Octicons name="person" color={color} size={25} />,
          headerRight: () => (
            <View style={{ flexDirection: 'row', backgroundColor: 'transparent' }}>
              <Link href="/settings" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <AntDesign 
                      name="setting" 
                      size={25} 
                      color="white" 
                      style={{ marginRight: 20, opacity: pressed ? 0.5 : 1 }}
                      />
                  )}
                </Pressable>
              </Link>
              <Link href="/sign-out" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <AntDesign 
                      name="logout" 
                      size={22} 
                      color="white" 
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                      />
                  )}
                </Pressable>
              </Link>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
