import { StyleSheet, SafeAreaView } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { Post } from '@/src/types/post.type';
import repository from '@/src/repository';
import FeedScreen from '@/src/components/Feed';
import { router, useLocalSearchParams } from 'expo-router';
import LoaderScreen from '../../loader';
import EmptyScreen from '@/src/components/EmptyScreen';
import { useAuth } from '@/src/context/auth-context';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/src/constants/Colors';
import { useAppSelector } from '@/src/redux/hooks';
import { RoleType } from '@/src/types/role.type';

const getDiffrenceInDays = (dateString: string) => {
  const userEntryDate = new Date(dateString).getTime();
  const currentDate = new Date().getTime();
  const differenceInDays = Math.floor((currentDate - userEntryDate) / (1000 * 60 * 60 * 24));
  return differenceInDays;
};

export default function HomeScreen() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [shouldUpdateActivity, setShouldUpdateActivity] = useState(false);
  const { refresh } = useLocalSearchParams<{ refresh: string }>();
  const userInfo = useAppSelector(state => state.userReducer.userInfo);

  const getPosts = useCallback(async () => {
    try {
      if (!user || user === '') {
        return;
      }
      if (
        userInfo &&
        userInfo.role &&
        userInfo.role.role_type === RoleType.USER_START &&
        getDiffrenceInDays(userInfo.user_entry_date) >= 3
      ) {
        const days = getDiffrenceInDays(userInfo.user_entry_date);
        console.log('User has been active for 3 or more days', days);
        setShouldUpdateActivity(true);
        return;
      }
      setShouldUpdateActivity(false);
      setLoading(true);

      console.log('GET POSTS');
      const { data: postsData } = await repository.get('/posts');

      setPosts(postsData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const err = error as any;
      console.error('ERROR IN GET POSTS: ', err.message);
      console.error(err.code);

      if (err.code === 401) {
        router.replace('/');
      }
    }
  }, [user, repository, userInfo]);

  useEffect(() => {
    if (user && user !== '') {
      getPosts();
    }
  }, [refresh, user, getPosts]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='light' />
      {!isLoading && shouldUpdateActivity &&
        <EmptyScreen
          text="More than 3 days have passed since your last activity! Create a post to see your friends's photo feed!"
        />
      }
      {!isLoading && posts.length === 0 && !shouldUpdateActivity &&
        <EmptyScreen text='No posts(' />
      }
      {isLoading &&
        <LoaderScreen />
      }
      {!isLoading && posts.length !== 0 && !shouldUpdateActivity &&
        <FeedScreen posts={posts} getPosts={getPosts} />
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: Colors.lightBlue,
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
