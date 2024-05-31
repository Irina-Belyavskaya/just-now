import LottieView from "lottie-react-native";
import { Animated, ViewStyle, StyleSheet } from "react-native";
import Colors from "../constants/Colors";

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

interface LoaderScreenProps {
  style?: ViewStyle;
}

export default function LoaderScreen({ style }: LoaderScreenProps) {
  return (
    <Animated.View style={[styles.container, style]}>
      <AnimatedLottieView
        loop
        autoPlay
        style={styles.lottie}
        source={require('@/assets/lottie/loader.json')}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightBlue,
  },
  lottie: {
    width: '80%',
    maxWidth: 400,
    height: 400,
  },
});