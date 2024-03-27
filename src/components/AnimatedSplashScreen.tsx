import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { Easing, ImageBackground, View } from "react-native";
import { Animated } from "react-native";

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

export default function AnimationSplashScreen({
  onAnimationFinish = () => { }
}: {
  onAnimationFinish: () => void
}) {
  const animation = useRef<LottieView>(null);
  const animationProgress = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    animation.current?.play(0, 40);
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
        // progress={animationProgress}
        loop={false}
        style={{
          width: '80%',
          maxWidth: 400,
          height: 400,
          // opacity: animationProgress
        }}
        source={require('@/assets/lottie/calendar.json')}
      />
    </Animated.View>
  )
}