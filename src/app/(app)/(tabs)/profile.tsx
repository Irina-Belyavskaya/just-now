import { ImageBackground, StyleSheet } from 'react-native';
import Sizes from '@/src/constants/Sizes';
import ProfileHead from '@/src/components/ProfileHead';

export default function ProfileScreen() {
  return (
    <>
      <ImageBackground
        style={styles.backgroundImage}
        source={require("../../../../assets/yellow_background.jpg")}
        blurRadius={8}
      >
        <ProfileHead />
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    marginHorizontal: Sizes.medium,
    marginTop: Sizes.safe,
  },
});
