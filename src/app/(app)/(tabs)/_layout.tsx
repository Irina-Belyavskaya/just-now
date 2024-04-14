import React, { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { Pressable, View } from 'react-native';
import Colors from '@/src/constants/Colors';
import { useClientOnlyValue } from '@/src/components/useClientOnlyValue';
import { useAuth } from '@/src/context/auth-context';
import repository from '@/src/repository';

export default function TabLayout() {
  const {user} = useAuth();
  const [isNotifications, setIsNotifications] = useState(false);

  useEffect(() => {
    if (!user) 
      return;

    (async() => {
      try {
        const {data} = await repository.get(`/friend-requests/notifications/${user}`);
        if (data && data.length > 0) 
          setIsNotifications(true);
        else 
          setIsNotifications(false);
      } catch (error) {
        console.error(error);
      }
    })();    
  })

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
            <View style={{display: 'flex', flexDirection: 'row'}}>
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
              <Link href="/notifications" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <>
                      { isNotifications && 
                        <View 
                          style={{
                            width: 8,
                            height: 8,
                            backgroundColor: Colors.deniedColor,
                            borderRadius: 50,
                            position: 'absolute',
                            left: '35%',
                            zIndex: 10
                          }} 
                        />
                      }
                      <Ionicons 
                        name="notifications" 
                        size={25}
                        color={'white'}
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                      />
                    </>
                  )}
                </Pressable>
              </Link>
            </View>
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
