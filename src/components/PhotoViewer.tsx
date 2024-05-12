import { AntDesign } from "@expo/vector-icons";
import { View, StyleSheet, Image } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../context/auth-context";
import { ImageResult } from "expo-image-manipulator";

type PhotoViewerProps = {
  photoPath: string,
  photo: ImageResult,
  setPhoto: React.Dispatch<React.SetStateAction<ImageResult | undefined>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  handlePhoto: (photoUrl: string) => Promise<void>,
  navigate?: () => void
}

export default function PhotoViewer({
  photoPath,
  photo,
  setPhoto,
  setIsLoading,
  handlePhoto,
  navigate
}: PhotoViewerProps) {

  const uploadPhoto = async () => {
    try {
      if (!photo)
        return;

      setIsLoading(true);
      await handlePhoto(`file://${photo?.uri}`);
      setPhoto(undefined);
      setIsLoading(false);
      if (navigate) {
        console.log('Navigate!')
        navigate();
      } else {
        router.replace('/');
      }
      router.setParams({ refresh: 'true' })
    } catch (error) {
      const err = error as any;
      console.error('ERROR IN uploadPhoto: ', err.message);
      console.error('ERROR CODE IN uploadPhoto: ', err.code);
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