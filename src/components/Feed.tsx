import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { Post } from '../types/post.type';
import VideoPost from './VideoPost';

type FeedScreenProps = {
  posts: Post[]
}

export default function FeedScreen({ posts }: FeedScreenProps) {
  const isImageUrl = (url:string) => {
    return /\.(jpg|jpeg|png|gif)$/i.test(url);
  }

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
          <View 
            style={{
              margin: 10, borderRadius: 7, elevation: 5, backgroundColor: "black", shadowColor: 'white',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.5,
              shadowRadius: 2,
              
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", padding: 10, }}>
              <Image 
                source={require("../../assets/user.jpg")} 
                style={{ height: 50, width: 50, borderRadius: 50 }} 
              />
              <View style={{ marginLeft: 10 }}>
                <Text style={{ fontSize: 20, color: 'white' }}>{'Name'}</Text>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontSize: 12, color: 'white' }}>
                    {new Date(item.post_created_at).toString().substring(0, 16)}
                  </Text>
                  <Text style={{ fontSize: 12, marginLeft: 5, color: 'white' }}>
                    {new Date(item.post_created_at).getHours() + " : " + new Date(item.post_created_at).getMinutes()}
                  </Text>
                </View>
              </View>
            </View>
            {
              isImageUrl(item.post_content_url)
              ? <Image 
                  source={{ uri: item.post_content_url }} 
                  style={{ height: 454, resizeMode: 'contain' }}
                />
              : <VideoPost post={item} activePostId={activePostId}/>
            }
            <View style={{ height: 1, width: "100%", backgroundColor: "white" }} />
            <View style={{ flexDirection: "row", }}>
              <TouchableOpacity style={{ flex: 1, margin: 10 }}>
                <Text style={{ textAlign: "center", fontWeight: "bold", color: 'white' }}>Like</Text>
              </TouchableOpacity>
              <View style={{ backgroundColor: "white", height: "100%", width: 1 }} />
              <TouchableOpacity style={{ flex: 1, margin: 10 }}>
                <Text style={{ textAlign: "center", fontWeight: "bold", color: 'white' }}>Comment</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        keyExtractor={(item) => (item.post_created_at + "")}
      />
    </View>
  )
}