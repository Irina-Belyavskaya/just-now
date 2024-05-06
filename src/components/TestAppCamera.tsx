import { Stack, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useCameraPermission, useCameraDevice, Camera, PhotoFile, TakePhotoOptions, useMicrophonePermission, VideoFile, useCameraFormat } from 'react-native-vision-camera';
import LoaderScreen from '../app/loader';
import CameraButtons from './CameraButtons';
import { ImageResult, manipulateAsync, SaveFormat } from 'expo-image-manipulator';

type TestAppCameraProps = {
  setPhoto: (photo: ImageResult) => void;
  photo: ImageResult | undefined;

  setVideo?: (video: VideoFile) => void;
  video?: VideoFile | undefined;

  onlyPhoto?: boolean;

}

export default function TestAppCamera({ setPhoto, photo, setVideo, video, onlyPhoto = false }: TestAppCameraProps) {
  const { hasPermission, requestPermission } = useCameraPermission();
  const {
    hasPermission: microphonePermission,
    requestPermission: requestMicrophonePermission
  } = useMicrophonePermission();

  const [isActive, setIsActive] = useState(false);
  const [flash, setFlash] = useState<TakePhotoOptions["flash"]>("off");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [exposure, setExposure] = useState<number>(0);

  const [cameraSide, setCameraSide] = useState<'back' | 'front'>('back');

  const device = useCameraDevice(cameraSide);
  const camera = useRef<Camera>(null);

  const format = useCameraFormat(device, [
    { videoStabilizationMode: 'cinematic-extended' },
    { photoResolution: 'max' },
    { videoResolution: 'max' },
    { videoAspectRatio: 16 / 9 },
    { videoResolution: { width: 3048, height: 2160 } },
  ]);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }

    if (!microphonePermission && !onlyPhoto) {
      requestMicrophonePermission();
    }
  }, [hasPermission, microphonePermission]);

  useFocusEffect(
    useCallback(() => {
      setIsActive(true);
      return () => setIsActive(false);
    }, [])
  )

  if (!hasPermission || (!microphonePermission && !onlyPhoto)) {
    return <LoaderScreen />;
  }

  if (!device) {
    return <LoaderScreen />;
  }

  const onTakePicturePressed = async () => {
    if (isRecording) {
      camera.current?.stopRecording();
      return;
    }
    console.log('PICTURE TAKEN');

    const photo = await camera.current?.takePhoto({
      enableShutterSound: false,
      qualityPrioritization: 'speed',
      flash: flash,
      enableAutoStabilization: true,
      enableAutoRedEyeReduction: true
    });

    let rotation = 0;
    if (cameraSide === 'front' &&
      (photo?.orientation == 'landscape-left' ||
        photo?.orientation == 'landscape-right')
    ) {
      rotation = 90;
    }
    const photoWithOrientation = await manipulateAsync(
      photo?.path ?? '', [{ rotate: rotation }],
      {
        compress: 1,
        format: SaveFormat.JPEG,
      }
    );
    setPhoto(photoWithOrientation);
  }

  const onStartRecording = async () => {
    if (!camera.current || onlyPhoto || !setVideo) {
      return;
    }
    setIsRecording(true);
    camera.current.startRecording({
      fileType: 'mp4',
      flash: flash === 'on' ? 'on' : 'off',
      onRecordingFinished: (video) => {
        setVideo(video);
        setIsRecording(false);
      },
      onRecordingError: (error) => {
        console.error(error);
        setIsRecording(false);
      }
    })
  }

  const changeCameraSide = () => {
    if (cameraSide === 'back') setCameraSide('front');
    if (cameraSide === 'front') setCameraSide('back');
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* CAMERA */}
      {device && !isLoading &&
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isActive && !photo && !video}
          photo
          video={!onlyPhoto}
          audio={!onlyPhoto}
          enableZoomGesture
          format={format}
          exposure={exposure}
          videoStabilizationMode={'cinematic-extended'}
        />
      }

      {isLoading && <LoaderScreen />}


      {/*CAMERA BUTTONS */}
      {!photo && !video && !isLoading &&
        <CameraButtons
          onTakePicturePressed={onTakePicturePressed}
          onStartRecording={onStartRecording}
          setFlash={setFlash}
          flash={flash}
          isRecording={isRecording}
          changeCameraSide={changeCameraSide}
          exposure={exposure}
          setExposure={setExposure}
        />
      }

      <StatusBar hidden />
    </View>
  )
}