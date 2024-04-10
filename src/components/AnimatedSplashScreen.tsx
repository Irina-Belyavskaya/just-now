import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { Easing, ImageBackground, View } from "react-native";
import { Animated } from "react-native";

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

type AnimationScreenProps = {
  onAnimationFinish?: () => void,
  loop?: boolean
}

export default function AnimationScreen({
  onAnimationFinish = () => { },
  loop = false
}: AnimationScreenProps) {
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    if (!loop)
      animation.current?.play(0, 40);
    else 
      animation.current?.play(0, 1000);
    // animation.current?.play(0, 1000);
    // Animated.timing(animationProgress, {
    //   toValue: 1,
    //   duration: 4000,
    //   easing: Easing.linear,
    //   useNativeDriver: true,
    // }).start();
  }, []);

  return (
    <Animated.View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black'
      }}
    >
      <AnimatedLottieView
        ref={animation}
        onAnimationFinish={onAnimationFinish}
        loop={loop}
        style={{
          width: '80%',
          maxWidth: 400,
          height: 400,
        }}
        source={require('@/assets/lottie/calendar.json')}
      />
    </Animated.View>
  )
}