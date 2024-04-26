import { ImageBackground, StyleSheet } from 'react-native';
import Sizes from '@/src/constants/Sizes';
import ProfileHead from '@/src/components/ProfileHead';
import { useEffect, useState } from 'react';
import { useAuth } from '@/src/context/auth-context';
import repository from '@/src/repository';
import { User } from '@/src/types/user.type';
import LoaderScreen from '../../loader';
import { Post } from '@/src/types/post.type';
import ProfileBottom from '@/src/components/ProfileBottom';
import { useIsFocused } from '@react-navigation/native';

export default function ProfileScreen() {
  const {user} = useAuth();
  const [userInfo, setUserInfo] = useState<User>();
  const [userPosts, setUserPosts] = useState<Post[]>();

  const [numberOfPhotoPosts, setNumberOfPhotoPosts] = useState<number>(0);
  const [numberOfVideoPosts, setNumberOfVideoPosts] = useState<number>(0);

  const [numberOfUserFriends, setNumberOfUserFriends] = useState<number>(0);
  const [isLoading, setLoading] = useState(false);

  const isFocused = useIsFocused();

  // Объявляем состояние для отслеживания обновления страницы
  const [refreshCount, setRefreshCount] = useState(0);

  // Обновляем состояние, когда компонент становится активным
  useEffect(() => {
    if (isFocused) {
      setRefreshCount((prevCount) => prevCount + 1);
    }
  }, [isFocused]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const {data: userInfo} = await repository.get(`/users/${user}`);
        setUserInfo(userInfo);
        const {data: userFriends} = await repository.get(`/friend-requests/friends/${user}`);
        setNumberOfUserFriends(userFriends.length);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    })();
  }, [user])

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const {data: numberOfPhotoPosts} = await repository.get(`/posts/number-of-photos/${user}`);
        setNumberOfPhotoPosts(numberOfPhotoPosts);
        const {data: numberOfVideoPosts} = await repository.get(`/posts/number-of-video/${user}`);
        setNumberOfVideoPosts(numberOfVideoPosts);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    })();
  }, [user])

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const {data: userPosts} = await repository.get(`/posts/${user}`);
        setUserPosts(userPosts);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    })();
  }, [user])
  
  return (
    <>
      {isLoading && 
        <LoaderScreen />
      }
      {!isLoading && userInfo && userPosts &&
        <ImageBackground
          style={styles.backgroundImage}
          source={require("../../../../assets/yellow_background.jpg")}
          blurRadius={8}
        >
          <ProfileHead 
            userInfo={userInfo} 
            numberOfUserFriends={numberOfUserFriends}
            numberOfPhotos={numberOfPhotoPosts}
            numberOfVideo={numberOfVideoPosts}
            isPersonalAccount 
          />
          <ProfileBottom userPosts={userPosts}/>
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
