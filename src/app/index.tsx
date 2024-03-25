import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, SafeAreaView } from 'react-native';
import { useFonts, Raleway_700Bold } from '@expo-google-fonts/raleway';
import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';

export default function HomeScreen() {

  const [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold: Raleway_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }


  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/background_3.jpg')}
        style={styles.imageBackground}
        resizeMode='cover'
      >
        <View style={styles.imageBackground}>
          <Text style={styles.title}>JUST NOW</Text>
          <MaterialIcons name="access-time" size={50} color="black" />
        </View>
        <Link href={'/camera'} style={styles.link} >Go to camera</Link>
        <StatusBar hidden />
      </ImageBackground>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    marginTop: 200,
    fontFamily: "Raleway_700Bold"
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  // --------
  link: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 30
  }
});
