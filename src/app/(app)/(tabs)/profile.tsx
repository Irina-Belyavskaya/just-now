import { ImageBackground, StyleSheet } from 'react-native';
import Sizes from '@/src/constants/Sizes';
import ProfileHead from '@/src/components/ProfileHead';
import Middle from '@/src/components/ProfileHead';
import Bottom from '@/src/components/Bottom';

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
