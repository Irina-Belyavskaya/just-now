import { ImageBackground, StyleSheet } from 'react-native';
import Sizes from '@/src/constants/Sizes';
import ProfileHead from '@/src/components/ProfileHead';
import { useEffect, useState } from 'react';
import { useAuth } from '@/src/context/auth-context';
import repository from '@/src/repository';
import { User } from '@/src/types/user.type';
import LoaderScreen from '../../loader';

export default function ProfileScreen() {
  const {user} = useAuth();
  const [userInfo, setUserInfo] = useState<User>();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const {data} = await repository.get(`/users/${user}`);
        setUserInfo(data);
        console.log(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    })();
  }, [])
  
  return (
    <>
      {isLoading && 
        <LoaderScreen />
      }
      {!isLoading && userInfo &&
        <ImageBackground
          style={styles.backgroundImage}
          source={require("../../../../assets/yellow_background.jpg")}
          blurRadius={8}
        >
          <ProfileHead userInfo={userInfo} isPersonalAccount/>
        </ImageBackground>
      }
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
