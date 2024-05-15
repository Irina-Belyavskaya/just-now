import { Post } from "../types/post.type";
import { FlatList, RefreshControl } from "react-native";
import { useState } from "react";
import UserPostViewer from "./UserPostViewer";

type ProfilePostsProps = {
  userPosts: Post[],
  getUserPosts: () => Promise<void>
}

export default function ProfilePosts({ userPosts, getUserPosts }: ProfilePostsProps) {
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
        marginTop: 30,
        gap: 10
      }}
      showsHorizontalScrollIndicator={false}
      data={userPosts}
      showsVerticalScrollIndicator={false}
      horizontal
      renderItem={({ item }) =>
        <UserPostViewer post={item} />
      }
      keyExtractor={item => item.post_id}
    />
  )
}

