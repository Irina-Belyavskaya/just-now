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
import { Badge } from 'react-native-paper';
import { Text } from '@/src/components/Themed';
import { useAppSelector } from '@/src/redux/hooks';
import { RoleType } from '@/src/types/role.type';

export default function TabLayout() {
  const { user } = useAuth();
  const [isNotifications, setIsNotifications] = useState(false);
  const userInfo = useAppSelector(state => state.userReducer.userInfo);

  useEffect(() => {
    if (!user)
      return;

    (async () => {
      try {
        console.log('GET USER NOTIFICATIONS IN TABS');
        const { data } = await repository.get(`/friend-requests/notifications/${user}`);
        if (data && data.length > 0)
          setIsNotifications(true);
        else
          setIsNotifications(false);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [])

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.lightBlue,
        tabBarInactiveTintColor: Colors.white,
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: { backgroundColor: Colors.darkBlue },
        headerStyle: { backgroundColor: Colors.darkBlue },
        headerTintColor: Colors.white,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: () => { return null },
          tabBarIcon: ({ color }) => <AntDesign name="home" color={color} size={25} />,
          headerRight: () => (
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              {userInfo?.role.role_type === RoleType.USER_START &&
                <View>
                  <Feather
                    name="message-circle"
                    size={25}
                    color={'white'}
                    style={{ marginRight: 15 }}
                  />
                  <Ionicons
                    name="lock-closed"
                    size={16}
                    color="white"
                    style={{
                      position: 'absolute',
                      backgroundColor: Colors.alt,
                      borderRadius: 10,
                      padding: 7,
                      right: 12,
                      bottom: 0
                    }}
                  />
                </View>
              }
              {userInfo?.role.role_type === RoleType.USER_MONTHLY_PRO &&
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
              }
              <Link href="/notifications" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <>
                      <Badge
                        visible={isNotifications}
                        size={10}
                        style={{
                          position: 'absolute',
                          left: '35%',
                          top: '-10%',
                          zIndex: 10
                        }}
                      />
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
          title: 'Search',
          tabBarLabel: () => { return null },
          tabBarIcon: ({ color }) => <Feather name="search" color={color} size={25} />,
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Camera',
          tabBarLabel: () => { return null },
          tabBarIcon: ({ color }) => <Feather name="camera" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: () => { return null },
          tabBarIcon: ({ color }) =>
            <>
              <View
                style={{
                  backgroundColor: Colors.lightBlue,
                  paddingHorizontal: 3,
                  borderRadius: 100,
                  transform: [{ rotate: '10deg' }],
                  marginLeft: 10
                }}
              >
                <Text style={{ fontSize: 9 }}>
                  {userInfo?.role.role_type === RoleType.USER_START && 'Upgrade'}
                  {userInfo?.role.role_type === RoleType.USER_MONTHLY_PRO && 'PRO'}
                </Text>
              </View>
              <Octicons
                name="person"
                color={color}
                size={25}
              />
            </>,
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
