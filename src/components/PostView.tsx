import { View, Image } from "react-native";
import { Text } from "@/src/components/Themed";
import { Post, PostType } from "../types/post.type";
import VideoPost from "./VideoPost";
import { useEffect, useState } from "react";
import Colors from "../constants/Colors";
import Reactions from "./Reactions";
import Entypo from '@expo/vector-icons/Entypo';
import { Reaction } from "../types/reaction.type";
import { useAppSelector } from "../redux/hooks";
import { RoleType } from "../types/role.type";
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import PhotoPost from "./PhotoPost";

type PostProps = {
  post: Post
}

function convertToKebabCase(input: string): any {
  const lowerCaseInput = input.toLowerCase();
  const words = lowerCaseInput.split('_');
  const kebabCaseString = words.join('-');
  return kebabCaseString;
}

function getCurrentLocalTime(): Date {
  const now = new Date();
  const localOffset = now.getTimezoneOffset() * 60000;
  const localTime = new Date(now.getTime() - localOffset);
  return localTime;
}

function getTimeAgo(post_created_at: string): string {
  const now = getCurrentLocalTime().getTime();
  const postCreatedAt = new Date(post_created_at).getTime();

  const timeDiff = now - postCreatedAt;

  const millisecondsInMinute = 1000 * 60;
  const millisecondsInHour = millisecondsInMinute * 60;
  const millisecondsInDay = millisecondsInHour * 24;

  if (timeDiff < millisecondsInMinute) {
    const secondsDiff = Math.floor(timeDiff / 1000);
    return `${secondsDiff} ${secondsDiff === 1 ? 'second ago' : 'seconds ago'}`;
  } else if (timeDiff < millisecondsInHour) {
    const minutesDiff = Math.floor(timeDiff / millisecondsInMinute);
    return `${minutesDiff} ${minutesDiff === 1 ? 'minute ago' : 'minutes ago'}`;
  } else if (timeDiff < millisecondsInDay) {
    const hoursDiff = Math.floor(timeDiff / millisecondsInHour);
    return `${hoursDiff} ${hoursDiff === 1 ? 'hour ago' : 'hours ago'}`;
  } else {
    const daysDiff = Math.floor(timeDiff / millisecondsInDay);
    return `${daysDiff} ${daysDiff === 1 ? 'day ago' : 'days ago'}`;
  }
}

export default function PostView({ post }: PostProps) {
  const [reaction, setReaction] = useState<Reaction>();
  const userInfo = useAppSelector(state => state.userReducer.userInfo);

  useEffect(() => {
    if (!userInfo || !post || userInfo?.role.role_type === RoleType.USER_START)
      return;

    const reaction = post.reactions.find(reaction => reaction.user_id === userInfo.user_id);
    setReaction(reaction);
  }, [])

  return (
    <View
      style={{
        marginTop: 10, borderRadius: 7, shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          margin: 10,
        }}
      >
        <Image
          source={{ uri: post.user.file.file_url }}
          style={{ height: 50, width: 50, borderRadius: 50 }}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontSize: 20, color: Colors.black }}>{post.user.user_nickname}</Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 12, color: Colors.black }}>
              {getTimeAgo(post.post_created_at)}
            </Text>
          </View>
        </View>
      </View>
      {
        post.post_type === PostType.PHOTO
          ?
          <PhotoPost imageUrl={post.file.file_url} />
          :
          <VideoPost post={post} />
      }
      {reaction && userInfo?.role.role_type === RoleType.USER_MONTHLY_PRO &&
        <Entypo
          name={convertToKebabCase(reaction.reaction_type)}
          size={30}
          color={Colors.lightBlue}
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
            color={Colors.lightBlue}
            style={{
              position: 'absolute',
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