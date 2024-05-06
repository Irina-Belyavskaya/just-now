import { Post, PostType } from "../types/post.type";
import { View, TouchableOpacity, Image, Text, StyleSheet, FlatList, RefreshControl, useWindowDimensions } from "react-native";
import VideoPost from "./VideoPost";

type ProfileBottomProps = {
  userPosts: Post[]
}

const height = 200;
const width = 200;

export default function ProfileBottom({ userPosts }: ProfileBottomProps) {
  return (
    <FlatList
      // refreshControl={
      //   <RefreshControl refreshing={isLoading} onRefresh={async () => {
      //       setLoading(true)
      //       await getPosts()
      //       setLoading(false)
      //     }} 
      //   />
      // }

      contentContainerStyle={{
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
        marginTop: 30
      }}
      showsHorizontalScrollIndicator={false}
      data={userPosts}
      showsVerticalScrollIndicator={false}
      horizontal
      renderItem={({ item }) =>
        item.post_type === PostType.PHOTO
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
      keyExtractor={item => item.post_id}
    />
  )
}

const styles = StyleSheet.create({
});