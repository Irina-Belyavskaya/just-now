import { Platform } from "react-native";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, router } from 'expo-router';
import { useEffect, useState } from 'react';

import { useColorScheme } from '@/src/components/useColorScheme';
import { AuthProvider } from '@/src/context/auth-context';
import { Raleway_700Bold, Raleway_100Thin, Raleway_300Light, Raleway_400Regular } from '@expo-google-fonts/raleway';
import AnimationSplashScreen from '../components/AnimatedSplashScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { ErrorHandler } from '../components/ErrorBoundary';
import { StatusBar } from 'expo-status-bar';
import { StripeProvider } from '@stripe/stripe-react-native';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import { StreamChat } from 'stream-chat';
import { useRef } from "react";

import * as Device from 'expo-device';
import Constants from 'expo-constants';

const client = StreamChat.getInstance(`panhwp4pcwu3`);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    // EAS projectId is used here.
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

async function schedulePushNotification(title: string, body: string, url: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { data: 'goes here', url: url ?? '/' },
    },
    trigger: null,
  });
}
let messageHandledIds = new Set<string>();

const handleReceivedMessage = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
  if (remoteMessage.data && remoteMessage.data.id && remoteMessage.messageId && !messageHandledIds.has(remoteMessage.messageId)) {
    messageHandledIds.add(remoteMessage.messageId);
    const message = await client.getMessage(remoteMessage.data.id as string);

    if (message) {
      await schedulePushNotification(
        '✉️ from ' + message.message.user?.name,
        message.message?.text ?? '',
        '/chats'
      );
    }
  }

  if (remoteMessage.data && remoteMessage.data.title && remoteMessage.data.url) {
    await schedulePushNotification(
      '🙋🏼 ' + remoteMessage.data.title,
      remoteMessage.data.body as string,
      remoteMessage.data.url as string
    );
  }
}

messaging().onMessage(async (remoteMessage) => {
  console.log('Message handled!', JSON.stringify(remoteMessage, null, 2));

  if (remoteMessage.sentTime && remoteMessage.sentTime > 0) {
    console.log("remoteMessage.sentTime: ", remoteMessage.sentTime)
    await handleReceivedMessage(remoteMessage);
  }
});

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', JSON.stringify(remoteMessage, null, 2));
  if (remoteMessage.sentTime && remoteMessage.sentTime > 0) {
    console.log("remoteMessage.sentTime: ", remoteMessage.sentTime)
    await handleReceivedMessage(remoteMessage);
  }
});


export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  function redirect(notification: Notifications.Notification) {
    const url = notification.request.content.data?.url;
    if (url) {
      router.push(url);
    }
  }

  useEffect(() => {
    let isMounted = true;

    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification recieved!')
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
      redirect(response.notification);
    });

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response?.notification) {
        return;
      }
      redirect(response?.notification);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
      isMounted = false;
    };
  }, []);

  console.log('expoPushToken: ', expoPushToken);
  console.log('notification: ', notification);

  const [loaded, error] = useFonts({
    Raleway_700Bold: Raleway_700Bold,
    Raleway_100Thin: Raleway_100Thin,
    Raleway_300Light: Raleway_300Light,
    Raleway_400Regular: Raleway_400Regular
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      setAppReady(true);
    }
  }, [loaded]);

  if (!appReady || !splashAnimationFinished) {
    return (
      <AnimationSplashScreen
        onAnimationFinish={() => {
          setSplashAnimationFinished(true);
        }}
      />
    );
  }

  if (!loaded) {
    return null;
  }

  return (
    <RootLayoutNav />
  );
}

const stripeKey = 'pk_test_51N6d4dBpzz7pK9M26cTkZp7vx8Md2hsbY8fM8ManwiXMcr87zNdTpttmr3QhsfsLZA27nIiqLBqHYQm8HZxoZdwZ00fO59Zv7I';

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ErrorHandler>
      <Provider store={store}>
        <StripeProvider publishableKey={stripeKey}>
          <AuthProvider>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <Animated.View style={{ flex: 1 }} entering={FadeIn}>
                  <StatusBar style='light' />
                  <Slot />
                </Animated.View>
              </GestureHandlerRootView>
            </ThemeProvider>
          </AuthProvider>
        </StripeProvider>
      </Provider>
    </ErrorHandler>
  );
}