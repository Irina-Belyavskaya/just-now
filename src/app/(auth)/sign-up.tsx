import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ImageBackground } from 'react-native';
import {
  GestureDetector,
  Gesture,
  Directions,
} from 'react-native-gesture-handler';

import Animated, {
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import SignUpSteps from '@/src/constants/SignUpSteps';
import Colors from '@/src/constants/Colors';
import { useAppDispatch } from '@/src/redux/hooks';
import { setSignUpFromReset } from '@/src/redux/sign-up/sign-up.reducer';
import LoaderScreen from '../loader';

export default function OnboardingScreen() {
  const [screenIndex, setScreenIndex] = useState(0);

  const data = SignUpSteps[screenIndex];
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onMain = () => {
    setScreenIndex(0);
    dispatch(setSignUpFromReset())
    router.back();
  };

  const onContinue = () => {
    const isLastScreen = screenIndex === SignUpSteps.length - 1;
    if (isLastScreen) {
      onMain();
    } else {
      setScreenIndex(screenIndex + 1);
    }
  };

  const onBack = () => {
    const isFirstScreen = screenIndex === 0;
    if (isFirstScreen) {
      onMain();
    } else {
      setScreenIndex(screenIndex - 1);
    }
  };

  const swipes = Gesture.Simultaneous(
    Gesture.Fling().direction(Directions.LEFT).onEnd(onContinue),
    Gesture.Fling().direction(Directions.RIGHT).onEnd(onBack)
  );

  return (
    <>
      {isLoading && <LoaderScreen />}
      {!isLoading &&
        <SafeAreaView style={styles.page}>
          <Stack.Screen options={{ headerShown: false }} />
          <ImageBackground
            source={require('../../../assets/cat.jpg')}
            style={styles.imageBackground}
            resizeMode='cover'
          >
            <View style={styles.stepIndicatorContainer}>
              {SignUpSteps.map((step, index) => (
                <View
                  key={index}
                  style={[
                    styles.stepIndicator,
                    { backgroundColor: index === screenIndex ? Colors.black : Colors.darkGray },
                  ]}
                />
              ))}
            </View>
            <GestureDetector gesture={swipes}>
              <View style={styles.pageContent} key={screenIndex}>
                <Animated.View entering={FadeIn} exiting={FadeOut}>
                  <Animated.Text
                    entering={FadeIn}
                    exiting={FadeOut}
                    style={styles.title}
                  >
                    {data.title}
                  </Animated.Text>
                </Animated.View>

                <View style={styles.content}>
                  <Animated.View
                    entering={FadeIn}
                    exiting={FadeOut}
                  >
                    {data.content({ handleNext: onContinue, onMain, setIsLoading, isLoading })}
                  </Animated.View>
                </View>
              </View>
            </GestureDetector>
          </ImageBackground>
        </SafeAreaView>
      }
    </>
  )
}

const styles = StyleSheet.create({
  page: {
    justifyContent: 'center',
    flex: 1,
  },
  pageContent: {
    padding: 20,
    flex: 1,
  },
  image: {
    alignSelf: 'center',
    margin: 20,
    marginTop: 70,
  },
  title: {
    color: Colors.black,
    fontSize: 30,
    letterSpacing: 1.3,
    marginVertical: 10,
  },
  content: {
    marginBottom: 'auto',
    marginTop: 20,
  },

  buttonsRow: {
    // marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    backgroundColor: Colors.pickedYelllow,
    borderRadius: 50,
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    fontFamily: 'Raleway_400Regular',
    fontSize: 16,
    color: Colors.black,
    padding: 15,
    paddingHorizontal: 25,
    textTransform: 'uppercase',
  },
  imageBackground: {
    flex: 1,
  },

  // steps
  stepIndicatorContainer: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 15,
  },
  stepIndicator: {
    marginTop: 35,
    flex: 1,
    height: 5,
    backgroundColor: 'gray',
    borderRadius: 10,
  },
});
