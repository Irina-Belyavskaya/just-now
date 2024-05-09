import { Post, PostType } from "../types/post.type";
import { View, Image, StyleSheet, FlatList, RefreshControl } from "react-native";
import VideoPost from "./VideoPost";
import { useState } from "react";

type ProfileBottomProps = {
  userPosts: Post[],
  getUserPosts: () => Promise<void>
}

const height = 200;
const width = 200;

export default function ProfileBottom({ userPosts, getUserPosts }: ProfileBottomProps) {
  const [isLoading, setLoading] = useState(false);

  return (
    <FlatList
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={async () => {
          setLoading(true)
          await getUserPosts();
          setLoading(false)
        }}
        />
      }
      contentContainerStyle={{
        display: 'flex',
        flexDirection: 'row',
        marginTop: 30
      }}
      showsHorizontalScrollIndicator={false}
      data={userPosts}
      showsVerticalScrollIndicator={false}
      horizontal
      renderItem={({ item }) =>
        <View style={{ marginRight: 10 }}>
          {item.post_type === PostType.PHOTO
            ?
            <Image
              key={item.post_id}
              source={{ uri: item.file.file_url }}
              style={{ height, width, resizeMode: 'contain', }}
            />
            :
            <VideoPost
              key={item.post_id}
              post={item}
              height={height}
              width={width}
            />
          }
        </View>
      }
      keyExtractor={item => item.post_id}
    />
  )
}

const styles = StyleSheet.create({
});