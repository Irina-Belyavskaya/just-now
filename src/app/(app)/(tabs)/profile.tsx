import ProfileInfo from '@/src/components/ProfileInfo';
import { useCallback, useEffect, useState } from 'react';
import repository from '@/src/repository';
import LoaderScreen from '../../loader';
import { Post } from '@/src/types/post.type';
import ProfilePosts from '@/src/components/ProfilePosts';
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import { getUser } from '@/src/redux/user/users.actions';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/src/constants/Colors';

export default function ProfileScreen() {
  const [userPosts, setUserPosts] = useState<Post[]>();

  const [numberOfPhotoPosts, setNumberOfPhotoPosts] = useState<number>(0);
  const [numberOfVideoPosts, setNumberOfVideoPosts] = useState<number>(0);

  const [numberOfUserFriends, setNumberOfUserFriends] = useState<number>(0);
  const [isLoading, setLoading] = useState(false);

  const userInfo = useAppSelector(state => state.userReducer.userInfo);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!userInfo) {
      dispatch(getUser());
    }
  }, [userInfo])

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        console.log('GET FREINDS');
        const { data: userFriends } = await repository.get('/friend-requests/friends');
        setNumberOfUserFriends(userFriends.length);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    })();
  }, [])

  const getUserPosts = useCallback(async () => {
    try {
      setLoading(true);
      console.log('GET POSTS INFO FOR PROFILE');
      const { data } = await repository.get('posts/profile-posts-info');
      setNumberOfPhotoPosts(data.numberOfPhotoPosts);
      setNumberOfVideoPosts(data.numberOfVideoPosts);
      setUserPosts(data.userPosts);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [])

  useEffect(() => {
    getUserPosts();
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.lightBlue }}>
      {isLoading &&
        <LoaderScreen />
      }
      {!isLoading && userInfo &&
        <ProfileInfo
          userInfo={userInfo}
          numberOfUserFriends={numberOfUserFriends}
          numberOfPhotos={numberOfPhotoPosts}
          numberOfVideo={numberOfVideoPosts}
          isPersonalAccount
        />
      }

      {!isLoading && userPosts && userPosts.length > 0 &&
        <ProfilePosts
          userPosts={userPosts}
          getUserPosts={getUserPosts}
        />
      }
    </SafeAreaView>
  );
}
