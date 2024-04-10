import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';

import EditScreenInfo from '@/src/components/EditScreenInfo';
import { Text, View } from '@/src/components/Themed';
import Colors from '@/src/constants/Colors';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.pickedYelllow
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});
