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

export default function TabOneScreen() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setLoading] = useState(false);
  const { refresh } = useLocalSearchParams<{ refresh: string }>();

  const getPosts = useCallback(async () => {
    try {
      setLoading(true);
      console.log('GET POSTS');
      const { data: posts } = await repository.get('/posts');
      setPosts(posts.sort((postA: Post, postB: Post) => {
        const dateA = new Date(postA.post_created_at).toISOString();
        const dateB = new Date(postB.post_created_at).toISOString();
        return dateB.localeCompare(dateA);
      }));
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
  }, [])

  useEffect(() => {
    if (!user || user === '')
      return;

    getPosts();
  }, [refresh, user])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='light' />
      {!isLoading && posts.length === 0 &&
        <EmptyScreen text='No posts(' />
      }
      {isLoading &&
        <LoaderScreen />
      }
      {!isLoading && posts.length !== 0 &&
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
