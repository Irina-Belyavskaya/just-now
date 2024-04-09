import { Stack, router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, ActivityIndicator, View, Pressable, Image, Dimensions, ViewStyle } from 'react-native';
import { useCameraPermission, useCameraDevice, Camera, PhotoFile, TakePhotoOptions, useMicrophonePermission, VideoFile } from 'react-native-vision-camera';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import repository from '../repository';
import { useAuth } from '../context/auth-context';
import { sendToFirebase } from '../utils/firebase';

export default function AppCamera() {
  const {user} = useAuth();
  const { hasPermission, requestPermission } = useCameraPermission();
  const { hasPermission: microphonePermission, requestPermission: requestMicrophonePermission } = useMicrophonePermission();

  const [isActive, setIsActive] = useState(false);
  const [photo, setPhoto] = useState<PhotoFile>();
  const [flash, setFlash] = useState<TakePhotoOptions["flash"]>("off");
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState<VideoFile>();
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const [isPlaying, setIsPlaying] = useState<boolean>(true);
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

  const convertBlobToBase64 = (blob: any) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  const uploadPhoto = async () => {
    try {
      if (!photo)
        return;

      setIsLoading(true);

      const result = await fetch(`file://${photo?.path}`)
      const blob = await result.blob();
      const base64 = await convertBlobToBase64(blob);

      await repository.post(
        '/posts/upload', 
        {data : base64, user_id: user}
      );
      setPhoto(undefined);
      setIsLoading(false);
      router.replace('/');
    } catch (error) {
      const err = error as any;
      console.error(err.message);
      console.error(err.code);
      setIsLoading(false);
    }
  }

  const uploadVideo = async () => {
    try {
      if (!video)
        return;
      setIsLoading(true);
      const result = await fetch(`file://${video?.path}`)
      const blob = await result.blob();
      const url = await sendToFirebase(blob);
      console.log(url);
      setVideo(undefined);
      setIsLoading(false);
      router.replace('/');
    } catch (error) {
      const err = error as any;
      console.error(err.message);
      console.error(err.code);
      setIsLoading(false);
    }
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

  // Get screen width
 const {width: screenWidth, height: screenHeight} = Dimensions.get("window")

 // calculate ratio of screen to video width
  const delta_1 = video ? screenWidth / video.width : 0;
  const delta_2 = video ? screenHeight / video.height : 0;

  const VIDEO: ViewStyle = {
    // Set the width and height to fit in the screen
    width: video ? video.width * delta_1 : screenWidth,
    height: video ? video.height * delta_2 : screenHeight,
    flex: 0,
    backgroundColor: '#fff',
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{headerShown: false}}/>
      {device && 
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
      }

      {isLoading && 
        <View style={{backgroundColor: 'balck'}}>
          <ActivityIndicator size={'large'}/>
        </View>
      }

      {photo && !isLoading &&
        <>
          <Image source={{ uri: `file://${photo.path}` }} style={StyleSheet.absoluteFill} />
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
      }

      {!photo && !video && !isLoading &&
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
        </>
      }

      {video && !isLoading &&
        <>
          <Video
            source={{
              uri: video.path,
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
      }

      <StatusBar hidden />
    </View>
  );
}
