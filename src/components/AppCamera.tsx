import { Stack, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useCameraPermission, useCameraDevice, Camera, TakePhotoOptions, useMicrophonePermission, VideoFile } from 'react-native-vision-camera';
import LoaderScreen from '../app/loader';
import CameraButtons from './CameraButtons';
import { ImageResult, manipulateAsync, SaveFormat } from 'expo-image-manipulator';

type AppCameraProps = {
  setPhoto: (photo: ImageResult) => void;
  photo: ImageResult | undefined;

  setVideo?: (video: VideoFile) => void;
  video?: VideoFile | undefined;

  isLoading: boolean;

  onlyPhoto?: boolean;

}

export default function AppCamera({
  setPhoto,
  photo,
  setVideo,
  video,
  isLoading,
  onlyPhoto = false
}: AppCameraProps) {
  const { hasPermission, requestPermission } = useCameraPermission();
  const {
    hasPermission: microphonePermission,
    requestPermission: requestMicrophonePermission
  } = useMicrophonePermission();

  const [isActive, setIsActive] = useState(false);
  const [flash, setFlash] = useState<TakePhotoOptions["flash"]>("off");
  const [isRecording, setIsRecording] = useState(false);
  const [exposure, setExposure] = useState<number>(0);

  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const [cameraSide, setCameraSide] = useState<'back' | 'front'>('back');

  const device = useCameraDevice(cameraSide);
  const camera = useRef<Camera>(null);

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
    return;
  }

  const onTakePicturePressed = async () => {
    if (isRecording) {
      camera.current?.stopRecording();
      clearTimeout(timer!);
      setTimer(null);
      return;
    }
    console.log('PICTURE TAKEN');

    const photo = await camera.current?.takePhoto({
      enableShutterSound: false,
      qualityPrioritization: 'speed',
      flash: flash,
      enableAutoStabilization: true,
      enableAutoRedEyeReduction: true,
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
      videoBitRate: 'low',
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

  const handleStopRecording = () => {
    clearTimeout(timer!);
    setTimer(null);

    camera.current?.stopRecording();
  };

  const handleStartRecording = async () => {
    onStartRecording();

    const timer = setTimeout(() => {
      handleStopRecording();
    }, 10000);

    setTimer(timer);
  };



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
          exposure={exposure}
          videoStabilizationMode={'cinematic-extended'}
        />
      }

      {isLoading && <LoaderScreen />}


      {/*CAMERA BUTTONS */}
      {!photo && !video && !isLoading &&
        <CameraButtons
          onTakePicturePressed={onTakePicturePressed}
          onStartRecording={handleStartRecording}
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