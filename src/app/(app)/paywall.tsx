import EmptyScreen from "@/src/components/EmptyScreen";
import { Text } from "@/src/components/Themed";
import Colors from "@/src/constants/Colors";
import { TouchableOpacity, View, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { FontAwesome6 } from '@expo/vector-icons';
import { Button } from "react-native-paper";
import repository from "@/src/repository";
import { useStripe } from "@stripe/stripe-react-native";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import PaywallTextBlock from "@/src/components/PaywallTextBlock";
import LottieView from "lottie-react-native";
import Animated from "react-native-reanimated";

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

export default function Paywall() {

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const handleUpgrade = async () => {
    try {
      // 1. Create a payment intent
      const { data } = await repository.post(`/payments/intents`, { amount: 800 });
      console.log("Intent: ", data);

      // 2. Initialize the Payment sheet
      const initResponse = await initPaymentSheet({
        merchantDisplayName: 'JustNow',
        paymentIntentClientSecret: data,
      });

      console.log("initResponse: ", JSON.stringify(initResponse, null, 2));


      // 3. Present the Payment Sheet from Stripe
      const paymentResponse = await presentPaymentSheet();

      console.log("paymentResponse: ", JSON.stringify(paymentResponse, null, 2));

      // 4. If payment ok -> create the order
      router.replace('/');
    } catch (error) {
      console.error('ERROR IN handleUpgrade: ', error);
    }

  };

  return (
    <ScrollView
      style={{
        backgroundColor: Colors.pickedYelllow,
      }}
      contentContainerStyle={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 30,
          fontFamily: 'Raleway_700Bold',
          marginTop: 30,
          marginBottom: 10
        }}
      >
        Upgrade
      </Text>
      <Text
        style={{
          fontSize: 18
        }}
      >
        Upgrade to Pro to Access all the Features
      </Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
          alignItems: 'center',
          marginTop: 50,
          gap: 20
        }}
      >
        <PaywallTextBlock
          Icon={Ionicons}
          text={'Access to chat'}
          iconName={'chatbubbles-sharp'}
        />
        <PaywallTextBlock
          Icon={MaterialIcons}
          text={'Set reactions'}
          iconName={'add-reaction'}
        />
        <PaywallTextBlock
          Icon={FontAwesome6}
          text={'Unlimited feed viewing'}
          iconName={'unlock'}
        />
        <AnimatedLottieView
          loop
          autoPlay
          style={{
            width: '80%',
            maxWidth: 200,
            height: 200,
          }}
          source={require('@/assets/lottie/pro.json')}
        />
      </View>
      <TouchableOpacity
        onPress={() => handleUpgrade()}
        style={{
          borderColor: 'orange',
          borderWidth: 1,
          borderRadius: 30,
          paddingHorizontal: 25,
          paddingVertical: 15,
          backgroundColor: 'orange',
          marginTop: 20
        }}
      >
        <Text
          style={{
            fontSize: 22,
            textTransform: 'uppercase',
            fontFamily: 'Raleway_700Bold'
          }}
        >
          Upgrate
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}