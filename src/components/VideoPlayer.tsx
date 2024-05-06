import { AntDesign } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { useState } from "react";
import { Dimensions, View, ViewStyle } from "react-native";
import { VideoFile } from "react-native-vision-camera";
import { sendToFirebase } from "../utils/firebase";
import repository from "../repository";
import { useAuth } from "../context/auth-context";
import { router } from "expo-router";

type VideoPlayerProps = {
  videoPath: string,
  video: VideoFile,
  setVideo: React.Dispatch<React.SetStateAction<VideoFile | undefined>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function VideoPlayer ({
  videoPath, 
  video, 
  setVideo, 
  setIsLoading
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const {user} = useAuth();

  const {width: screenWidth, height: screenHeight} = Dimensions.get("window")

  const delta_1 = screenWidth / video.width;
  const delta_2 = screenHeight / video.height;

  const VIDEO: ViewStyle = {
    width: video.width * delta_1,
    height: video.height * delta_2,
    flex: 0,
    backgroundColor: '#fff',
  }

  const uploadVideo = async () => {
    try {
      if (!video)
        return;

      setIsLoading(true);

      // Get blob
      const result = await fetch(`file://${video?.path}`)
      const blob = await result.blob();
      const url = await sendToFirebase(blob, user as string);

      // Send to server
      await repository.post(
        '/posts/upload/video', 
        {video_url : url, user_id: user}
      );

      // Reset states
      setVideo(undefined);
      setIsLoading(false);

      // Redirect with refresh
      router.replace('/');
      router.setParams({ refresh: 'true' })
    } catch (error) {
      const err = error as any;
      console.error(err.message);
      console.error(err.code);
      setIsLoading(false);
    }
  }

  return (
    <>
      <Video
        source={{
          uri: videoPath,
        }}
        useNativeControls={false}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={isPlaying}
        isLooping
        style={VIDEO}
      />
      
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: 20,
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexDirection: 'row'
        }}
      >
        <AntDesign 
          onPress={uploadVideo}
          name="upload" 
          size={30} 
          color="black" 
          style={{
            position: 'absolute',
            bottom: 20,
            left: 10
          }}
        />
        <AntDesign 
          name={isPlaying ? "pausecircleo" :  "playcircleo"}
          size={30} 
          color="black" 
          style={{
            marginLeft: 'auto',
            marginRight: 'auto'
          }} 
          onPress={() => setIsPlaying(!isPlaying)}
        />
      </View>
      <AntDesign 
        onPress={() => setVideo(undefined)}
        name="arrowleft" 
        size={25}
        color="black"
        style={{
          position: 'absolute',
          top: 20,
          left: 15,
        }} 
      />
    </>
  )
}