import { Button, StyleSheet, Image, SafeAreaView, ImageBackground } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/src/context/auth-context';
import { Post } from '@/src/types/post.type';
import repository from '@/src/repository';

export default function TabOneScreen() {
  const {user} = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    (async () => {
      const {data} = await repository.get('/posts');
      console.log(data)
      setPosts(data);
    })();
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require("../../../../assets/yellow_background.jpg")}
        blurRadius={8}
      >
      {
        posts.map((post) => 
          <Image 
            key={post.post_id}
            source={{ uri: post.post_content_url }} 
            style={{
              width: 200,
              height: 500,
              resizeMode: 'contain'
            }} 
          />
        )
      }
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start'
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
