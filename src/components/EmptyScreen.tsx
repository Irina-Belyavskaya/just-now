import LottieView from "lottie-react-native";
import { Animated, Text } from "react-native";
import Colors from "../constants/Colors";

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

type EmptyScreenProps = {
  text: string
}

export default function EmptyScreen({ text }: EmptyScreenProps) {
  return (
    <Animated.View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.lightBlue
      }}
    >
      <Text
        style={{
          color: Colors.darkGray,
          fontFamily: 'Raleway_700Bold',
          fontSize: 25,
          textAlign: 'center'
        }}
      >
        {text}
      </Text>
      <AnimatedLottieView
        loop
        autoPlay
        style={{
          width: '80%',
          maxWidth: 400,
          height: 400,
        }}
        source={require('@/assets/lottie/clocks.json')}
      />
    </Animated.View>
  );
}