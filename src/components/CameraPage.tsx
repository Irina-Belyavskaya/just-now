import { Stack, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useCameraPermission, useCameraDevice, Camera, PhotoFile, TakePhotoOptions, useMicrophonePermission, VideoFile } from 'react-native-vision-camera';
import LoaderScreen from '../app/loader';
import VideoPlayer from './VideoPlayer';
import PhotoViewer from './PhotoViewer';
import CameraButtons from './CameraButtons';

export default function AppCamera() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const { 
          hasPermission: microphonePermission, 
          requestPermission: requestMicrophonePermission 
        } = useMicrophonePermission();

  const [isActive, setIsActive] = useState(false);
  const [photo, setPhoto] = useState<PhotoFile>();
  const [flash, setFlash] = useState<TakePhotoOptions["flash"]>("off");
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState<VideoFile>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [cameraSide, setCameraSide] = useState<'back' | 'front'>('back');

  const device = useCameraDevice(cameraSide);
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
    return <LoaderScreen />;
  }

  if (!device) {
    return <Text>Camera no found!</Text>;
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

  const changeCameraSide= () => {
    if (cameraSide === 'back') setCameraSide('front');
    if (cameraSide === 'front') setCameraSide('back');
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{headerShown: false}}/>
      
      {/* CAMERA */}
      {device && !isLoading &&
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

      {isLoading && <LoaderScreen />}

      {/* PHOTO VIEWER */}
      {photo && !isLoading &&
        <PhotoViewer 
          photoPath={photo.path}
          setPhoto={setPhoto}
          photo={photo}
          setIsLoading={setIsLoading}
        />
      }

      {/*CAMERA BUTTONS */}
      {!photo && !video && !isLoading &&
        <CameraButtons 
          onTakePicturePressed={onTakePicturePressed}
          onStartRecording={onStartRecording} 
          setFlash={setFlash} 
          flash={flash} 
          isRecording={isRecording}   
          changeCameraSide={changeCameraSide}     
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
    </View>
  );
}
