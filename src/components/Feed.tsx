import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { Post } from '../types/post.type';
import VideoPost from './VideoPost';
import { FontAwesome } from '@expo/vector-icons';
import PostView from './PostView';

type FeedScreenProps = {
  posts: Post[]
}

export default function FeedScreen({ posts }: FeedScreenProps) {
  const [activePostId, setActivePostId] = useState(posts[0].post_id);

  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: { itemVisiblePercentThreshold: 50 },
      onViewableItemsChanged: ({ changed, viewableItems }: any) => {
        if (viewableItems.length > 0 && viewableItems[0].isViewable) {
          setActivePostId(viewableItems[0].item.id);
        }
      },
    },
  ]);

  const onEndReached = () => {
    console.log('End of feed!')
  };

  return (
    <View>
      <FlatList
        // refreshControl={
        //   <RefreshControl refreshing={isLoading} onRefresh={async () => {
        //       setLoading(true)
        //       await fetchFeed()
        //       setLoading(false)
        //     }} 
        //   />
        // }
        data={posts}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        renderItem={({ item }) => 
          <PostView post={item} activePostId={activePostId}/>
        }
        keyExtractor={(item) => (item.post_created_at + "")}
      />
    </View>
  )
}