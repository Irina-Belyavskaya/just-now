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
import { useAppSelector } from "../redux/hooks";
import { RoleType } from "../types/role.type";
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

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
  const userInfo = useAppSelector(state => state.userReducer.userInfo);

  useEffect(() => {
    if (!user || !post || userInfo?.role.role_type === RoleType.USER_START)
      return;

    const reaction = post.reactions.find(reaction => reaction.user_id === user);
    setReaction(reaction);
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
      {reaction && userInfo?.role.role_type === RoleType.USER_MONTHLY_PRO &&
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
      {userInfo?.role.role_type === RoleType.USER_MONTHLY_PRO &&
        <Reactions postId={post.post_id} setReaction={setReaction} />
      }
      {userInfo?.role.role_type === RoleType.USER_START &&
        <>
          <MaterialIcons
            name="add-reaction"
            size={40}
            color={Colors.pickedYelllow}
            style={{
              position: 'absolute',
              // padding: 7,
              right: 12,
              bottom: 10
            }}
          />
          <Ionicons
            name="lock-closed"
            size={20}
            color="white"
            style={{
              position: 'absolute',
              backgroundColor: Colors.alt,
              borderRadius: 100,
              padding: 14,
              right: 8,
              bottom: 8
            }}
          />
        </>
      }
    </View>
  )
}