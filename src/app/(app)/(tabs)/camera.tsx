import { useAuth } from "@/src/context/auth-context";
import repository from "@/src/repository";
import { PostType } from "@/src/types/post.type";
import { uploadToFirebaseAndCreateFile } from "@/src/redux/actions";
import AppCamera from "@/src/components/CameraPage";

export default function CameraScreen() {
  const { user } = useAuth();

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
    <AppCamera
      handlePhoto={handlePhoto}
    />
  );
}

// type AppCameraProps = {
//   handlePhoto: (photoUrl) => Promise<void>,
//   navigate?: () => void
// }

// export default function CameraScreen() {
//   const { hasPermission, requestPermission } = useCameraPermission();
//   const {
//     hasPermission: microphonePermission,
//     requestPermission: requestMicrophonePermission
//   } = useMicrophonePermission();

//   const { user } = useAuth();

//   const [isActive, setIsActive] = useState(false);
//   const [photo, setPhoto] = useState<ImageResult>();
//   const [flash, setFlash] = useState<TakePhotoOptions["flash"]>("off");
//   const [isRecording, setIsRecording] = useState(false);
//   const [video, setVideo] = useState<VideoFile>();
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [exposure, setExposure] = useState<number>(0);

//   const [cameraSide, setCameraSide] = useState<'back' | 'front'>('back');

//   const device = useCameraDevice(cameraSide);
//   const camera = useRef<Camera>(null);

//   const handlePhoto = useCallback(async (photoUrl: string) => {
//     const file = await uploadToFirebaseAndCreateFile(photoUrl, `post/${user}/`);

//     const postDto = {
//       post_content_id: file.file_id,
//       user_id: user,
//       post_type: PostType.PHOTO
//     }

//     await repository.post('/posts/', postDto);
//   }, [user])


//   useEffect(() => {
//     if (!hasPermission) {
//       requestPermission();
//     }

//     if (!microphonePermission) {
//       requestMicrophonePermission();
//     }
//   }, [hasPermission, microphonePermission]);

//   useFocusEffect(
//     useCallback(() => {
//       setIsActive(true);
//       return () => setIsActive(false);
//     }, [])
//   )

//   if (!hasPermission || !microphonePermission) {
//     return <LoaderScreen />;
//   }

//   if (!device) {
//     return <Text>Camera no found!</Text>;
//   }

//   const onTakePicturePressed = async () => {
//     if (isRecording) {
//       camera.current?.stopRecording();
//       return;
//     }

//     const photo = await camera.current?.takePhoto({
//       enableShutterSound: false,
//       qualityPrioritization: 'speed',
//       flash: flash,
//       enableAutoStabilization: true,
//       enableAutoRedEyeReduction: true
//     });

//     let rotation = 0;
//     if (cameraSide === 'front' &&
//       (photo?.orientation == 'landscape-left' ||
//         photo?.orientation == 'landscape-right')
//     ) {
//       rotation = 90;
//     }
//     const photoWithOrientation = await manipulateAsync(
//       photo?.path ?? '', [{ rotate: rotation }],
//       {
//         compress: 1,
//         format: SaveFormat.JPEG,
//       }
//     );
//     setPhoto(photoWithOrientation);
//   }

//   const onStartRecording = async () => {
//     if (!camera.current) {
//       return;
//     }
//     setIsRecording(true);
//     camera.current.startRecording({
//       fileType: 'mp4',
//       flash: flash === 'on' ? 'on' : 'off',
//       onRecordingFinished: (video) => {
//         setVideo(video);
//         setIsRecording(false);
//       },
//       onRecordingError: (error) => {
//         console.error(error);
//         setIsRecording(false);
//       }
//     })
//   }

//   const changeCameraSide = () => {
//     if (cameraSide === 'back') setCameraSide('front');
//     if (cameraSide === 'front') setCameraSide('back');
//   }

//   return (
//     <View style={{ flex: 1 }}>
//       <Stack.Screen options={{ headerShown: false }} />
//       {/* CAMERA */}
//       {device && !isLoading &&
//         <Camera
//           ref={camera}
//           style={StyleSheet.absoluteFill}
//           device={device}
//           isActive={isActive && !photo && !video}
//           exposure={exposure}
//           photo
//           video
//           audio
//           enableZoomGesture
//         />
//       }

//       {isLoading && <LoaderScreen />}

//       {/* PHOTO VIEWER */}
//       {photo && !isLoading &&
//         <PhotoViewer
//           photoPath={photo.uri}
//           setPhoto={setPhoto}
//           photo={photo}
//           setIsLoading={setIsLoading}
//           handlePhoto={handlePhoto}
//         />
//       }

//       {/*CAMERA BUTTONS */}
//       {!photo && !video && !isLoading &&
//         <CameraButtons
//           onTakePicturePressed={onTakePicturePressed}
//           onStartRecording={onStartRecording}
//           setFlash={setFlash}
//           flash={flash}
//           isRecording={isRecording}
//           changeCameraSide={changeCameraSide}
//           exposure={exposure}
//           setExposure={setExposure}
//         />
//       }

//       {/* VIDEO PLAYER */}
//       {video && !isLoading &&
//         <VideoPlayer
//           videoPath={video.path}
//           video={video}
//           setVideo={setVideo}
//           setIsLoading={setIsLoading}
//         />
//       }

//       <StatusBar hidden />
//     </View>
//   );
// }