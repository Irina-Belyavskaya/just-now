import { Stack, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, SafeAreaView, Text, ActivityIndicator, View, Button, Pressable, Image } from 'react-native';
import { useCameraPermission, useCameraDevice, Camera, PhotoFile, TakePhotoOptions, useMicrophonePermission, VideoFile } from 'react-native-vision-camera';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';

export default function CameraScreen() {

  const { hasPermission, requestPermission } = useCameraPermission();
  const { hasPermission: microphonePermission, requestPermission: requestMicrophonePermission } = useMicrophonePermission();

  const [isActive, setIsActive] = useState(false);
  const [photo, setPhoto] = useState<PhotoFile>();
  const [flash, setFlash] = useState<TakePhotoOptions["flash"]>("off");
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState<VideoFile>();



  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }

    if (!microphonePermission) {
      requestMicrophonePermission();
    }
  }, [hasPermission, microphonePermission]);

  useFocusEffect(
    useCallback(() => {
      setIsActive(true);
      return () => setIsActive(false);
    }, [])
  )

  if (!hasPermission || !microphonePermission) {
    return <ActivityIndicator />;
  }

  if (!device) {
    return <Text>Camera no found!</Text>;
  }

  const uploadPhoto = async () => {
    if (!photo)
      return;
    const result = await fetch(`file://${photo?.path}`)
    const data = await result.blob();
    console.log(data);
  }

  const onTakePicturePressed = async () => {
    if (isRecording) {
      camera.current?.stopRecording();
      return;
    }

    const photo = await camera.current?.takePhoto({
      enableShutterSound: false,
      qualityPrioritization: 'speed',
      flash: flash,
      enableAutoStabilization: true,
      enableAutoRedEyeReduction: true
    });
    setPhoto(photo);
  }

  const onStartRecording = async () => {
    if (!camera.current) {
      return;
    }
    setIsRecording(true);
    camera.current.startRecording({
      fileType: 'mp4',
      flash: flash === 'on' ? 'on' : 'off',
      onRecordingFinished: (video) => {
        console.log(video);
        setVideo(video);
        setIsRecording(false);
      },
      onRecordingError: (error) => {
        console.error(error);
        setIsRecording(false);
      }
    })
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive && !photo && !video}
        photo
        video
        audio
        enableZoomGesture
      />
      {photo &&
        <>
          <Image source={{ uri: `file://${photo.path}` }} style={StyleSheet.absoluteFill} />
          <FontAwesome5
            onPress={() => setPhoto(undefined)}
            name="arrow-left"
            size={30}
            color="red"
            style={{
              position: 'absolute',
              top: 30,
              left: 30
            }}
          />
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              paddingBottom: 50,
              backgroundColor: 'rgba(0,0,0,0.4)',
            }}
          >
            <Button title="Upload" onPress={uploadPhoto} />
          </View>
        </>
      }

      {!photo && !video &&
        <>
          <View
            style={{
              position: 'absolute',
              right: 10,
              top: 50,
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
        </>
      }

      {video &&
        <>
          <Video
            style={StyleSheet.absoluteFill}
            source={{
              uri: video.path,
            }}
            useNativeControls
            resizeMode={ResizeMode.COVER}
            isLooping
          />
          <FontAwesome5
            onPress={() => setVideo(undefined)}
            name="arrow-left"
            size={30}
            color="red"
            style={{
              position: 'absolute',
              top: 30,
              left: 30
            }}
          />
        </>
      }

      <StatusBar hidden />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
