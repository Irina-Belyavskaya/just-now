import { Text } from "@/src/components/Themed";
import Colors from "@/src/constants/Colors";
import { TouchableOpacity, View, Image } from "react-native";
import { FontAwesome6 } from '@expo/vector-icons';
import repository from "@/src/repository";
import { useStripe } from "@stripe/stripe-react-native";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import PaywallTextBlock from "@/src/components/PaywallTextBlock";
import LottieView from "lottie-react-native";
import Animated from "react-native-reanimated";
import { RoleType } from "@/src/types/role.type";
import { useAppDispatch } from "@/src/redux/hooks";
import { setUserInfo } from "@/src/redux/user/user.reducer";
import { useState } from "react";
import LoaderScreen from "../loader";
import { FontAwesome5 } from '@expo/vector-icons';

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

export default function Paywall() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const dispatch = useAppDispatch();

  const [isLoading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      // 1. Create a customer and get customerId
      const { data: customer } = await repository.post(`/payments/customers`);
      const customerId = customer.id;

      // 2. Create a subscription and get clientSecret
      const { data: subscription } = await repository.post(`/payments/subscriptions`, {
        customerId
      });

      // 3. Initialize the Payment sheet
      const initResponse = await initPaymentSheet({
        customerId,
        customerEphemeralKeySecret: subscription.clientSecret,
        paymentIntentClientSecret: subscription.clientSecret,
        merchantDisplayName: 'JustNow',
      });

      if (initResponse.error) {
        console.error('ERROR IN handleUpgrade: ', initResponse.error.localizedMessage);
        setLoading(false);
        return;
      }

      // 4. Present the Payment Sheet from Stripe
      const paymentResponse = await presentPaymentSheet();

      if (paymentResponse.error) {
        console.error('ERROR IN handleUpgrade: ', paymentResponse.error.localizedMessage);
        setLoading(false);
        return;
      }

      // 5. If payment ok 
      const { data: updatedUser } = await repository.put(
        `/users/upgrade`,
        { role_type: RoleType.USER_MONTHLY_PRO }
      )
      dispatch(setUserInfo(updatedUser));
      setLoading(false);
      router.replace('/profile');
    } catch (error) {
      console.error('ERROR IN handleUpgrade: ', error);
    }

  };

  return (
    <>
      {isLoading && <LoaderScreen />}
      {!isLoading &&
        <View
          style={{
            backgroundColor: Colors.lightBlue,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        // contentContainerStyle={{

        // }}
        >
          <View style={{ marginBottom: 40, }}>
            <Text
              style={{
                fontSize: 30,
                fontFamily: 'Raleway_700Bold',
                color: Colors.darkBlue
              }}
            >
              Upgrade
            </Text>
            <AnimatedLottieView
              loop
              autoPlay
              style={{
                width: 60,
                height: 60,
                position: 'absolute',
                right: -40,
                top: -25,
                transform: [{ rotate: '30deg' }]
              }}
              source={require('@/assets/lottie/pro.json')}
            />
          </View>
          <Text
            style={{
              fontSize: 18,
              color: Colors.darkBlue,
              marginBottom: 20
            }}
          >
            Upgrade to Pro to access all features
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
          </View>
          <TouchableOpacity
            onPress={() => handleUpgrade()}
            style={{
              borderColor: Colors.orange,
              borderWidth: 1,
              borderRadius: 30,
              paddingHorizontal: 25,
              paddingVertical: 15,
              backgroundColor: Colors.orange,
              marginTop: 60,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                fontSize: 22,
                textTransform: 'uppercase',
                fontFamily: 'Raleway_700Bold',
                color: Colors.white,
              }}
            >
              Subscribe
            </Text>
            <FontAwesome6
              name="4"
              size={22}
              color={Colors.white}
              style={{
                marginRight: 3,
                marginLeft: 10,
              }}
            />
            <FontAwesome6
              name="dollar-sign"
              size={22}
              color={Colors.white}
            />
          </TouchableOpacity>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 'auto',
              marginTop: 100,
              marginRight: 30
            }}
          >
            <Text
              style={{
                color: Colors.darkBlue,
                marginRight: 10
              }}
            >
              Pay with
            </Text>
            <FontAwesome5
              name="stripe"
              size={40}
              color={Colors.darkBlue}
            />
            <MaterialIcons
              name="security"
              size={30}
              color={Colors.darkBlue}
            />
          </View>

        </View>
      }
    </>
  )
}