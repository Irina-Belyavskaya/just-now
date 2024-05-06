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
import { useAppSelector } from '@/src/redux/hooks';

export default function ProfileScreen() {
  const { user } = useAuth();
  // const [userInfo, setUserInfo] = useState<User>();
  const [userPosts, setUserPosts] = useState<Post[]>();

  const [numberOfPhotoPosts, setNumberOfPhotoPosts] = useState<number>(0);
  const [numberOfVideoPosts, setNumberOfVideoPosts] = useState<number>(0);

  const [numberOfUserFriends, setNumberOfUserFriends] = useState<number>(0);
  const [isLoading, setLoading] = useState(false);

  const isFocused = useIsFocused();
  const [refreshCount, setRefreshCount] = useState(0);

  const userInfo = useAppSelector(state => state.userReducer.userInfo);

  useEffect(() => {
    if (isFocused) {
      setRefreshCount((prevCount) => prevCount + 1);
    }
  }, [isFocused]);

  useEffect(() => {
    if (!user)
      return;

    (async () => {
      try {
        setLoading(true);
        console.log('GET FREINDS');
        const { data: userFriends } = await repository.get(`/friend-requests/friends/${user}`);
        setNumberOfUserFriends(userFriends.length);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    })();
  }, [])

  useEffect(() => {
    if (!user)
      return;

    (async () => {
      try {
        setLoading(true);
        console.log('GET POSTS INFO FOR PROFILE');
        const { data } = await repository.get(`posts/profile-posts-info/${user}`);
        setNumberOfPhotoPosts(data.numberOfPhotoPosts);
        setNumberOfVideoPosts(data.numberOfVideoPosts);
        setUserPosts(data.userPosts);
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
          <ProfileBottom userPosts={userPosts} />
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
