import { Button, StyleSheet } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import LottieView from 'lottie-react-native';
import { useRef } from 'react';

export default function TabOneScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'black' }}>
      <LottieView
        style={{
          width: '80%',
          maxWidth: 400,
          height: 400,
        }}
        // autoPlay
        source={require('@/assets/lottie/calendar.json')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
