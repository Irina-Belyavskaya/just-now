import { View } from "react-native";
import { Text } from "@/src/components/Themed";
import Colors from "../constants/Colors";

type PaywallTextBlockProps = {
  Icon: any,
  text: string,
  iconName: string,
}

export default function PaywallTextBlock({ Icon, text, iconName }: PaywallTextBlockProps) {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
      }}
    >
      <Icon
        name={iconName}
        size={24}
        color={Colors.orange}
        style={{
          marginRight: 15
        }}
      />
      <Text
        style={{
          fontSize: 25,
          color: Colors.darkBlue
        }}
      >
        {text}
      </Text>
    </View>
  )
}