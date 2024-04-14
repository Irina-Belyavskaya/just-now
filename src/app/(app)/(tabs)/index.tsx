import { StyleSheet, SafeAreaView, ImageBackground} from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/src/context/auth-context';
import { Post } from '@/src/types/post.type';
import repository from '@/src/repository';
import FeedScreen from '@/src/components/Feed';
import { useLocalSearchParams } from 'expo-router';
import LoaderScreen from '../../loader';
import EmptyScreen from '@/src/components/EmptyScreen';

export default function TabOneScreen() {
  const {user} = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setLoading] = useState(false);
  const {refresh} = useLocalSearchParams<{ refresh: string }>();

  const getPosts = useCallback(async () => {
    try {
      setLoading(true);
      const {data} = await repository.get('/posts');
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [])

  useEffect(() => {
    getPosts();
  }, [refresh])

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require("../../../../assets/yellow_background.jpg")}
        blurRadius={8}
      >
        {!isLoading && posts.length === 0 && 
          <EmptyScreen text='No posts('/>
        }
        {isLoading && 
          <LoaderScreen />
        }
        {!isLoading && posts.length !== 0 &&
          <FeedScreen posts={posts}/>
        }
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    height: '100%'
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
