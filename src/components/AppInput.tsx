import { View, TextInput, StyleSheet, NativeSyntheticEvent, TextInputFocusEventData } from "react-native";
import { Text } from '@/src/components/Themed';
import { TextInputProps } from "react-native-paper";

export type AppInputProps = {
  onChangeText: ((text: string) => void) | undefined,
  onBlur?: ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void) | undefined,
  value: string | undefined,
  placeholder?: string,
  isTouched?:  boolean | undefined,
  errorMessage?: string | undefined,
} & TextInputProps;

export default function AppInput ({
  onChangeText, onBlur, value, placeholder, isTouched, errorMessage, ...props}: AppInputProps) {
  return (
    <View style={styles.wrapInput}>
      <TextInput
        onChangeText={onChangeText}
        onBlur={onBlur}
        value={value}
        style={[styles.input, isTouched && errorMessage ? styles.errorInput : null]}
        placeholder={placeholder}
        autoCapitalize={'none'}
        {...props}
      />
      {isTouched && errorMessage 
        ? 
        <Text style={styles.error}>
          {errorMessage}
        </Text>
        : 
        null
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  formWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  imageBackground: {
    flex: 1,
  },
  title: {
    marginBottom: 24,
    marginTop: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 40,
    fontFamily: "Raleway_700Bold"
  },
  error: {
    fontSize: 14,
    color: '#cc0000',
    fontWeight: 'bold',
    marginLeft: 3
  },
  wrapInput: {
    width: '80%',
    marginBottom: 15,
    textAlign: 'center',
    alignSelf: 'center'
  },
  input: {
    height: 50,
    paddingHorizontal: 8,
    width: '100%',
    borderColor: '#ddd',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#fff',
    alignSelf: 'center'
  },
  errorInput: {
    borderColor: '#cc0000',
  },
  button: {
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: 'black',
    width: '80%',
    paddingVertical: 5,
    fontSize: 20
  },
  promt: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 25,
  }
});