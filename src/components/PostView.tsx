import { FontAwesome } from "@expo/vector-icons";
import { View, TouchableOpacity, Image, Text, Pressable } from "react-native";
import { Post, PostType } from "../types/post.type";
import VideoPost from "./VideoPost";
import { useEffect, useState } from "react";
import Colors from "../constants/Colors";
import repository from "../repository";
import Reactions from "./Reactions";
import { useAuth } from "../context/auth-context";
import Entypo from '@expo/vector-icons/Entypo';
import { Reaction } from "../types/reaction.type";
import { router } from "expo-router";

type PostProps = {
  post: Post
}

function convertToKebabCase(input: string): any {
  const lowerCaseInput = input.toLowerCase();
  const words = lowerCaseInput.split('_');
  const kebabCaseString = words.join('-');
  return kebabCaseString;
}

export default function PostView({ post }: PostProps) {
  const { user } = useAuth();
  const [reaction, setReaction] = useState<Reaction>();

  useEffect(() => {
    if (!user || !post)
      return;

    (async () => {
      try {
        const { data } = await repository.get(`/reactions/${post.post_id}/${user}`);
        setReaction(data);
      } catch (error) {
        const err = error as any;
        console.error('ERROR IN GET REACTIONS: ', err.message);
        console.error(err.code);
        if (err.code === 401) {
          router.replace('/');
        }
      }
    })()
  }, [])

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
      {reaction &&
        <Entypo
          name={convertToKebabCase(reaction.reaction_type)}
          size={30}
          color={Colors.pickedYelllow}
          style={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            marginLeft: 10,
            marginBottom: 10
          }}
        />
      }
      <Reactions postId={post.post_id} setReaction={setReaction} />
    </View>
  )
}