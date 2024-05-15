import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import Colors from "../constants/Colors";

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
  }, []);

  return (
    <Animated.View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.lightBlue
      }}
    >
      <AnimatedLottieView
        ref={animation}
        onAnimationFinish={onAnimationFinish}
        loop={loop}
        style={{
          width: '100%',
          maxWidth: 400,
          height: 400
        }}
        source={require('@/assets/lottie/animated-splash.json')}
      />
    </Animated.View>
  )
}