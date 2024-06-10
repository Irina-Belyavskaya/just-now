import { Ionicons } from "@expo/vector-icons";
import { View, Pressable } from "react-native";
import { TakePhotoOptions } from "react-native-vision-camera";
import { AntDesign } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import Colors from "../constants/Colors";
import { useEffect, useState } from "react";
import { Text } from "@/src/components/Themed";

type CameraButtonsProps = {
  onTakePicturePressed: () => Promise<void>,
  onStartRecording: () => Promise<void>,
  setFlash: React.Dispatch<React.SetStateAction<"auto" | "off" | "on" | undefined>>,
  flash: TakePhotoOptions["flash"],
  isRecording: boolean,
  changeCameraSide: () => void,
  exposure: number,
  setExposure: React.Dispatch<React.SetStateAction<number>>,
}

export default function CameraButtons({
  onTakePicturePressed,
  onStartRecording,
  setFlash,
  flash,
  isRecording,
  changeCameraSide,
  exposure,
  setExposure
}: CameraButtonsProps) {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [remainingTime, setRemainingTime] = useState(10);

  useEffect(() => {
    console.log('INTERVAL: ', remainingTime);
    if (remainingTime === 0) {
      if (timer) {
        console.log('CLEAR TIMER!');
        clearInterval(timer);
      }
      setRemainingTime(0);
    }
  }, [remainingTime]);

  const startRecording = () => {
    onStartRecording();
    setRemainingTime(10);

    const timer = setInterval(() => {
      console.log('INTERVAL: ', remainingTime);
      setRemainingTime((prev) => prev - 1);
    }, 1000);

    setTimer(timer);
  };

  return (
    <>
      <View
        style={{
          position: 'absolute',
          right: 10,
          top: 40,
          backgroundColor: 'rgba(0,0,0,0.4)',
          borderRadius: 5
        }}
      >
        <Ionicons
          onPress={() => setFlash((curValue) => curValue === 'off' ? 'on' : 'off')}
          name={flash === 'off' ? "flash-off" : "flash"}
          size={24}
          color={Colors.lightBlue}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          right: -80,
          top: 150,
          borderRadius: 5,
          backgroundColor: 'rgba(0,0,0,0.4)',
          transform: [{ rotate: '-90deg' }],
        }}
      >
        <Slider
          style={{ width: 200, height: 30 }}
          minimumValue={-50}
          maximumValue={50}
          value={exposure}
          onValueChange={(value) => setExposure(value)}
          minimumTrackTintColor={Colors.lightBlue}
          maximumTrackTintColor={Colors.lightBlue}
          thumbTintColor={Colors.lightBlue}
        />
      </View>
      <View style={{ position: 'absolute', bottom: 30, alignSelf: 'center' }}>
        <Pressable
          onPress={onTakePicturePressed}
          onLongPress={startRecording}
          style={({ pressed }) => ({
            width: 70,
            height: 70,
            borderRadius: 75,
            backgroundColor: isRecording ? Colors.darkBlue : Colors.lightBlue,
            transform: [{ scale: pressed ? 0.95 : 1 }],
            justifyContent: 'center',
            alignItems: 'center',
          })}
        >
          <Text style={{ color: 'white', fontSize: 16 }}>
            {isRecording ? `${remainingTime}s` : ''}
          </Text>
        </Pressable>
      </View>
      {!isRecording &&
        <AntDesign
          name="retweet"
          size={35}
          color={Colors.lightBlue}
          style={{
            position: 'absolute',
            bottom: 40,
            left: 50
          }}
          onPress={changeCameraSide}
        />
      }
    </>
  )
}