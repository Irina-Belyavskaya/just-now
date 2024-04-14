import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot} from 'expo-router';
import { useEffect, useState } from 'react';

import { useColorScheme } from '@/src/components/useColorScheme';
import { AuthProvider } from '@/src/context/auth-context';
import { Raleway_700Bold, Raleway_100Thin, Raleway_300Light, Raleway_400Regular } from '@expo-google-fonts/raleway';
import AnimationSplashScreen from '../components/AnimatedSplashScreen';
import StartPage from '../components/StartPage';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

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

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Slot />
      </ThemeProvider>
    </AuthProvider>
  );
}