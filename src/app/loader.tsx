import LottieView from "lottie-react-native";
import { Animated } from "react-native";

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

export default function LoaderScreen() {
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
        loop
        autoPlay
        style={{
          width: '80%',
          maxWidth: 400,
          height: 400,
        }}
        source={require('@/assets/lottie/loader.json')}
      />
    </Animated.View>
  );
}