import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import { Post } from "../types/post.type";
import { useEffect, useRef, useState } from "react";
import { Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native-paper";
import Colors from "../constants/Colors";

type VideoPostProps = {
  post: Post,
  activePostId: string
}

export default function VideoPost ({ post, activePostId }: VideoPostProps) {
  const video = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isPlaying = status?.isLoaded && status.isPlaying;

  useEffect(() => {
    if (!video.current) {
      return;
    }
    if (activePostId !== post.post_id) {
      video.current.pauseAsync();
    }
    if (activePostId === post.post_id) {
      video.current.playAsync();
    }
  }, [activePostId, video.current]);

  const onPress = () => {
    if (!video.current) {
      return;
    }
    if (isPlaying) {
      video.current.pauseAsync();
    } else {
      video.current.playAsync();
    }
  };

  return(
    <Pressable onPress={onPress}>
      <Video
        ref={video}
        style={{ height: 340 }} 
        resizeMode={ResizeMode.CONTAIN}
        source={{uri: post.post_content_url}} 
        onPlaybackStatusUpdate={setStatus}
        isLooping
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
      />
      {!isPlaying && !isLoading && (
        <Feather
          style={{ position: 'absolute', alignSelf: 'center', top: '40%' }}
          name="play"
          size={70}
          color="rgba(255, 255, 255, 0.6)"
        />
      )}
      {isLoading && 
        <ActivityIndicator
          size={'large'}
          color={Colors.yellow}
          style={{
            position: 'absolute', alignSelf: 'center', top: '40%'
          }}
        />
      }
    </Pressable>
  )
}