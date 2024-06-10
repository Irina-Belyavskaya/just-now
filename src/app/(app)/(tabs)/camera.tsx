import repository from "@/src/repository";
import { PostType } from "@/src/types/post.type";
import { uploadToFirebaseAndCreateFile } from "@/src/redux/actions";
import { ImageResult } from "expo-image-manipulator";
import { useState } from "react";
import { VideoFile } from "react-native-vision-camera";
import PhotoViewer from "@/src/components/PhotoViewer";
import AppCamera from "@/src/components/AppCamera";
import VideoPlayer from "@/src/components/VideoPlayer";
import { SafeAreaView, StatusBar } from "react-native";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { getUser } from "@/src/redux/user/users.actions";

export default function CameraScreen() {
  const userInfo = useAppSelector(state => state.userReducer.userInfo);

  const [photo, setPhoto] = useState<ImageResult>();
  const [video, setVideo] = useState<VideoFile>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const handlePhoto = async (photoUrl: string) => {
    if (!userInfo)
      return;

    const file = await uploadToFirebaseAndCreateFile(photoUrl, `post/${userInfo.user_id}/`);

    const postDto = {
      post_content_id: file.file_id,
      post_type: PostType.PHOTO
    }

    await repository.post('/posts', postDto);
    dispatch(getUser());
  }

  return (
    <SafeAreaView style={{ flex: 1, overflow: 'hidden' }}>
      <AppCamera
        setPhoto={setPhoto}
        photo={photo}
        setVideo={setVideo}
        video={video}
        isLoading={isLoading}
      />

      {/* PHOTO VIEWER */}
      {photo && !isLoading &&
        <PhotoViewer
          photoPath={photo.uri}
          setPhoto={setPhoto}
          photo={photo}
          setIsLoading={setIsLoading}
          handlePhoto={handlePhoto}
        />
      }

      {/* VIDEO PLAYER */}
      {video && !isLoading &&
        <VideoPlayer
          videoPath={video.path}
          video={video}
          setVideo={setVideo}
          setIsLoading={setIsLoading}
        />
      }

      <StatusBar hidden={true} />
    </SafeAreaView>
  );
}