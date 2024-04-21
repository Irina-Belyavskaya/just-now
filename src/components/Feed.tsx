import React, { useRef, useState } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { Post } from '../types/post.type';
import PostView from './PostView';

type FeedScreenProps = {
  posts: Post[],
  getPosts: () => Promise<void>
}

export default function FeedScreen({ posts, getPosts }: FeedScreenProps) {
  const [isLoading, setLoading] = useState(false);
  const onEndReached = () => {
    console.log('End of feed!')
  };

  return (
    <View>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={async () => {
              setLoading(true)
              await getPosts()
              setLoading(false)
            }} 
          />
        }
        data={posts}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        renderItem={({ item }) => 
          <PostView post={item}/>
        }
        keyExtractor={(item) => (item.post_created_at + "")}
      />
    </View>
  )
}