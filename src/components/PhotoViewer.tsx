import { AntDesign } from "@expo/vector-icons";
import { View, StyleSheet, Image } from "react-native";
import { PhotoFile } from "react-native-vision-camera";
import { convertBlobToBase64 } from "../utils/convertToBase64";
import repository from "../repository";
import { router } from "expo-router";
import { useAuth } from "../context/auth-context";

type PhotoViewerProps = {
  photoPath: string,
  photo: PhotoFile,
  setPhoto: React.Dispatch<React.SetStateAction<PhotoFile | undefined>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function PhotoViewer ({photoPath, photo, setPhoto, setIsLoading}: PhotoViewerProps) {
  const {user} = useAuth();
  
  const uploadPhoto = async () => {
    try {
      if (!photo)
        return;

      setIsLoading(true);

      const result = await fetch(`file://${photo?.path}`)
      const blob = await result.blob();
      const base64 = await convertBlobToBase64(blob);

      await repository.post(
        '/posts/upload/photo', 
        {data : base64, user_id: user}
      );
      setPhoto(undefined);
      setIsLoading(false);
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
      <Image source={{ uri: `file://${photoPath}` }} style={StyleSheet.absoluteFill} />
      <AntDesign 
        onPress={() => setPhoto(undefined)}
        name="arrowleft" 
        size={25}
        color="white"
        style={{
          position: 'absolute',
          top: 15,
          left: 15,
          backgroundColor: 'rgba(0,0,0,0.8)',
          borderRadius: 50,
          padding: 5
        }} 
      />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AntDesign 
          onPress={uploadPhoto}
          name="upload" 
          size={40} 
          color="white" 
          style={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderRadius: 50,
            padding: 10
          }}
        />
      </View>
    </>
  )
}