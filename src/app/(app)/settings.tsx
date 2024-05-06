import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import SettingInputs from '@/src/components/SettingsInputs';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <SettingInputs />
      <StatusBar style='light' />
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
