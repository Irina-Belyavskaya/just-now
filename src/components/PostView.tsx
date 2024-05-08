import { FontAwesome } from "@expo/vector-icons";
import { View, TouchableOpacity, Image, Text, Pressable } from "react-native";
import { Post, PostType } from "../types/post.type";
import VideoPost from "./VideoPost";
import { useState } from "react";
import Colors from "../constants/Colors";
import repository from "../repository";
import Reactions from "./Reactions";

type PostProps = {
  post: Post
}

export default function PostView({ post }: PostProps) {
  const [like, setLike] = useState<boolean>();
  const [open, setOpen] = useState(false);

  const likePost = async (postLikes: number, postId: string) => {
    try {
      const dto = {
        likes: postLikes + 1
      }
      await repository.post(`/posts/set-reaction/${postId}`, dto);
    } catch (error) {
      console.error(error);
    }
  }

  const dislikePost = async (postLikes: number, postId: string) => {
    try {
      await repository.post(`/posts/set-reaction/${postId}`, { likes: postLikes - 1 });
    } catch (error) {
      console.error(error);
    }
  }

  return (
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
          source={{ uri: post.user.file.file_url }}
          style={{ height: 50, width: 50, borderRadius: 50 }}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontSize: 20, color: 'white' }}>{post.user.user_nickname}</Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 12, color: 'white' }}>
              {new Date(post.post_created_at).toString().substring(0, 16)}
            </Text>
            <Text style={{ fontSize: 12, marginLeft: 5, color: 'white' }}>
              {post.post_created_at.split('T')[1].slice(0, 5)}
            </Text>
          </View>
        </View>
      </View>
      {
        post.post_type === PostType.PHOTO
          ? <Image
            source={{ uri: post.file.file_url }}
            style={{ height: 454, resizeMode: 'contain' }}
          />
          :
          <VideoPost post={post} />
      }
    </View>
  )
}