import { AntDesign } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { useState } from "react";
import { Dimensions, View, ViewStyle } from "react-native";
import { VideoFile } from "react-native-vision-camera";
import repository from "../repository";
import { router } from "expo-router";
import { PostType } from "../types/post.type";
import { uploadToFirebaseAndCreateFile } from "../redux/actions";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getUser } from "../redux/user/users.actions";
import { deleteFile } from "../utils/deleteFile";

type VideoPlayerProps = {
  videoPath: string,
  video: VideoFile,
  setVideo: React.Dispatch<React.SetStateAction<VideoFile | undefined>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function VideoPlayer({
  videoPath,
  video,
  setVideo,
  setIsLoading
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const userInfo = useAppSelector(state => state.userReducer.userInfo);
  const dispatch = useAppDispatch();

  const { width: screenWidth, height: screenHeight } = Dimensions.get("window")

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
      if (!video || !userInfo)
        return;

      setIsLoading(true);

      const file = await uploadToFirebaseAndCreateFile(`file://${video?.path}`, `post/${userInfo.user_id}/`);

      const postDto = {
        post_content_id: file.file_id,
        post_type: PostType.VIDEO
      }

      await repository.post('/posts', postDto);

      dispatch(getUser());

      // Reset states
      setVideo(undefined);
      const filePath = video?.path.split('///').pop();
      if (filePath)
        deleteFile(filePath);
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
          name={isPlaying ? "pausecircleo" : "playcircleo"}
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
          top: 40,
          left: 15,
        }}
      />
    </>
  )
}