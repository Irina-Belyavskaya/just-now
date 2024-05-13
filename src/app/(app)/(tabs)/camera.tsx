import { useAuth } from "@/src/context/auth-context";
import repository from "@/src/repository";
import { PostType } from "@/src/types/post.type";
import { uploadToFirebaseAndCreateFile } from "@/src/redux/actions";
import { ImageResult } from "expo-image-manipulator";
import { useState } from "react";
import { VideoFile } from "react-native-vision-camera";
import PhotoViewer from "@/src/components/PhotoViewer";
import AppCamera from "@/src/components/AppCamera";
import VideoPlayer from "@/src/components/VideoPlayer";
import { StatusBar } from "react-native";

export default function CameraScreen() {
  const { user } = useAuth();

  const [photo, setPhoto] = useState<ImageResult>();
  const [video, setVideo] = useState<VideoFile>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePhoto = async (photoUrl: string) => {
    if (!user)
      return;

    const file = await uploadToFirebaseAndCreateFile(photoUrl, `post/${user}/`);

    const postDto = {
      post_content_id: file.file_id,
      user_id: user,
      post_type: PostType.PHOTO
    }

    await repository.post('/posts/', postDto);
  }

  return (
    <>
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

      <StatusBar hidden />
    </>
  );
}