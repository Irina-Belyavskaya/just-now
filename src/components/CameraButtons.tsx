import { Ionicons } from "@expo/vector-icons";
import { View, Pressable } from "react-native";
import { TakePhotoOptions } from "react-native-vision-camera";
import { AntDesign } from '@expo/vector-icons';

type CameraButtonsProps = {
  onTakePicturePressed: () => Promise<void>,
  onStartRecording: () => Promise<void>,
  setFlash: React.Dispatch<React.SetStateAction<"auto" | "off" | "on" | undefined>>,
  flash: TakePhotoOptions["flash"],
  isRecording: boolean,
  changeCameraSide: () => void
}

export default function CameraButtons ({
  onTakePicturePressed, 
  onStartRecording,
  setFlash,
  flash,
  isRecording,
  changeCameraSide
}: CameraButtonsProps) {
  return (
    <>
      <View
        style={{
          position: 'absolute',
          right: 10,
          top: 30,
          backgroundColor: 'rgba(0,0,0,0.4)',
          borderRadius: 5
        }}
      >
        <Ionicons
          onPress={() => setFlash((curValue) => curValue === 'off' ? 'on' : 'off')}
          name={flash === 'off' ? "flash-off" : "flash"}
          size={24}
          color="white"
        />
      </View>
      <Pressable
        onPress={onTakePicturePressed}
        onLongPress={onStartRecording}
        style={{
          position: 'absolute',
          bottom: 10,
          width: 70,
          height: 70,
          backgroundColor: isRecording ? 'red' : 'white',
          alignSelf: 'center',
          borderRadius: 75
        }}
      />
      {!isRecording &&
        <AntDesign 
          name="retweet" 
          size={35} 
          color="white" 
          style={{
            position: 'absolute',
            bottom: 25,
            left: 50
          }}
          onPress={changeCameraSide}
        />
      }
    </>
  )
}