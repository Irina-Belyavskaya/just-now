import { Pressable, StyleSheet, View } from "react-native";
import { Text } from '@/src/components/Themed';
import Colors from "../constants/Colors";
import { BaseStepType } from "../types/base-step.type";

type SignUpButtonsType = Partial<BaseStepType> & {
  handleSubmit: () => void,
}

export default function SignUpButtons({ onMain, handleSubmit }: SignUpButtonsType) {
  return (
    <View style={styles.buttonsRow}>
      <Text onPress={onMain} style={styles.buttonText}>
        On main
      </Text>

      <Pressable
        onPress={handleSubmit}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Next</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonsRow: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    borderRadius: 50,
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    fontFamily: 'Raleway_400Regular',
    fontSize: 16,
    color: Colors.darkBlue,
    padding: 15,
    paddingHorizontal: 25,
    textTransform: 'uppercase',
  },
});