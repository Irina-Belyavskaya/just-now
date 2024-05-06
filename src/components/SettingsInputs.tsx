import { Formik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { FieldValues } from 'react-hook-form';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setNickname, setPhotoUrl } from '../redux/sign-up/sign-up.reducer';
import repository from '../repository';
import AppInput from './AppInput';
import SignUpButtons from './SignUpButtons';
import { StyleSheet, Image, View, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button, Snackbar } from 'react-native-paper';
import { User } from '../types/user.type';
import { Text } from '@/src/components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import AppCamera from './CameraPage';
import { sendToFirebase } from '../utils/firebase';
import { useAuth } from '../context/auth-context';
import { Stack, router } from 'expo-router';
import { getUser } from '../redux/user/users.actions';
import { uploadToFirebaseAndCreateFile, uploadToFirebaseAndUpdateFile } from '../redux/actions';
import TestAppCamera from './TestAppCamera';
import { ImageResult } from 'expo-image-manipulator';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableHighlight } from 'react-native-gesture-handler';
import ModalWindow from './ModalWindow';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UpdateUserDTO } from '../redux/sign-up/types/update-info.dto';

export default function SettingInputs() {
  const { user } = useAuth();

  const dispatch = useAppDispatch();
  const userState: User | null = useAppSelector(state => state.userReducer.userInfo);
  const [isUniquenessError, setIsUniquenessError] = useState(false);
  const [image, setImage] = useState<string | undefined>(userState?.file.file_url);
  const [camera, setCamera] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const [photo, setPhoto] = useState<ImageResult>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const initialValues = {
    nickname: userState?.user_nickname,
    email: userState?.user_email,
    currentPassword: '',
    newPassword: ''
  }

  const schema = yup.object().shape({
    nickname: yup.string()
      .required('Required')
      .min(2, 'Nickname must contain at least 2 characters'),
    email: yup.string()
      .required('Required')
      .email('Invalid email'),
    currentPassword: yup.string()
      .min(8, 'Password must contain at least 8 characters'),
    newPassword: yup.string()
      .min(8, 'Password must contain at least 8 characters'),
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [5, 5],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      dispatch(setPhotoUrl(result.assets[0].uri));
    }
  };

  const handleSubmitForm = async ({ nickname, email, currentPassword, newPassword }: FieldValues) => {
    try {
      // console.log(nickname)
      // console.log(email)
      // console.log(currentPassword)
      // console.log(newPassword)
      // console.log(image)

      setIsLoading(true);

      let dto: UpdateUserDTO = {
        user_email: email,
        user_nickname: nickname,
      }

      if (currentPassword && newPassword) {
        dto.user_newPassword = newPassword;
        dto.user_currentPassword = currentPassword;
      }

      const { data } = await repository.put(`/users/${user}`, dto);
      console.log("data: ", JSON.stringify(data, null, 2))

      if (data.status && data.status !== 201) {
        setErrorMessage(data.message);
        setIsLoading(false);
        return;
      }
      // console.log(JSON.stringify(data, null, 2))
      console.log(image !== userState?.file.file_url)

      if (image && image !== userState?.file.file_url && user && userState) {
        console.log('here')
        await uploadToFirebaseAndUpdateFile(image, userState.file.file_id);
      }

      if (user)
        dispatch(getUser({ id: user }));

      setIsLoading(false);
    } catch (error) {
      const err = error as any;
      setIsLoading(false);
      console.error(err.message);
      console.error(err.code);
    }
  }

  useEffect(() => {
    if (photo) {
      setImage(photo.uri);
      setTimeout(() => {
        setCamera(false);
      }, 300);
    }
  }, [photo])

  return (
    <>
      {camera &&
        <TestAppCamera
          onlyPhoto
          setPhoto={setPhoto}
          photo={photo}
        />
      }

      {!camera &&
        <ScrollView style={{ flex: 1, backgroundColor: Colors.pickedYelllow }}>

          <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: true }} />
            {!isLoading && errorMessage &&
              <Snackbar
                visible={!!errorMessage}
                onDismiss={() => setErrorMessage(undefined)}
                action={{
                  label: 'Close',
                  textColor: Colors.white
                }}
                style={{
                  zIndex: 100,
                  backgroundColor: Colors.deniedColor,
                }}

                elevation={5}
              >
                {errorMessage}
              </Snackbar>
            }
            <Formik
              initialValues={initialValues}
              onSubmit={(values) => {
                handleSubmitForm(values);
              }}
              validationSchema={schema}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                values,
                errors,
                touched
              }) => (
                <>
                  <Text style={styles.title}>Update information</Text>
                  <Button
                    style={styles.saveBtn}
                    onPress={handleSubmit}
                    textColor={Colors.white}
                  >
                    Save
                  </Button>
                  <AppInput
                    onChangeText={(text) => {
                      setFieldValue('nickname', text);
                      setIsUniquenessError(false);
                    }}
                    onBlur={handleBlur('nickname')}
                    value={values.nickname}
                    placeholder={'Nickname'}
                    isTouched={touched.nickname || isUniquenessError}
                    errorMessage={errors.nickname || (isUniquenessError ? 'This nickname is already taken' : '')}
                  />
                  <AppInput
                    onChangeText={(text) => {
                      setFieldValue('email', text);
                      setIsUniquenessError(false);
                    }}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    placeholder={'Email'}
                    isTouched={touched.email || isUniquenessError}
                    errorMessage={errors.email || (isUniquenessError ? 'This email already exists' : '')}
                  />
                  <AppInput
                    onChangeText={handleChange('currentPassword')}
                    onBlur={handleBlur('currentPassword')}
                    value={values.currentPassword}
                    placeholder={'Current password'}
                    isTouched={touched.currentPassword}
                    errorMessage={errors.currentPassword}
                    autoCorrect={false}
                    secureTextEntry={true}
                    textContentType={'password'}
                  />
                  <AppInput
                    onChangeText={handleChange('newPassword')}
                    onBlur={handleBlur('newPassword')}
                    value={values.newPassword}
                    placeholder={'New password'}
                    isTouched={touched.newPassword}
                    errorMessage={errors.newPassword}
                    autoCorrect={false}
                    secureTextEntry={true}
                    textContentType={'password'}
                  />
                  <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <Text style={styles.text}>
                      Pick an image from
                    </Text>
                    <FontAwesome
                      name="photo"
                      size={20}
                      color={Colors.white}
                    />
                  </TouchableOpacity>
                  <MaterialIcons
                    name="enhance-photo-translate"
                    size={40}
                    color={Colors.gray}
                    style={styles.icon}
                    onPress={() => {
                      setPhoto(undefined);
                      setCamera(true);
                    }}
                  />
                  {image &&
                    <Image
                      source={{ uri: image }}
                      style={styles.image}
                    />
                  }
                </>
              )}
            </Formik>
          </SafeAreaView >
        </ScrollView>

      }
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.pickedYelllow,
  },
  button: {
    borderRadius: 30,
    paddingVertical: 10,
    width: 300,
    backgroundColor: Colors.black,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    color: Colors.white,
    marginRight: 10
  },
  saveBtn: {
    position: 'absolute',
    borderRadius: 30,
    backgroundColor: Colors.black,
    color: Colors.white,
    right: 10,
    top: 10,
    marginBottom: 50
  },
  image: {
    marginTop: 40,
    width: 250,
    height: 250,
    borderRadius: 200,
    borderWidth: 2,
    borderColor: "black"
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  icon: {
    position: 'absolute',
    bottom: 100,
    zIndex: 100,
    borderWidth: 1,
    borderColor: Colors.alt,
    borderRadius: 100,
    padding: 10,
    backgroundColor: Colors.alt
  }
});