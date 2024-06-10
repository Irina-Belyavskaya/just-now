import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setPhotoUrl, setSignUpFromReset } from "../redux/sign-up/sign-up.reducer";
import { BaseStepType } from "../types/base-step.type";
import React, { useState } from 'react';
import {
  Image,
  View,
  StyleSheet
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button, Snackbar } from 'react-native-paper';
import Colors from "../constants/Colors";
import SignUpButtons from "./SignUpButtons";
import repository from "../repository";
import { useAuth } from "../context/auth-context";
import { router } from "expo-router";
import LoaderScreen from "../app/loader";
import { SignUpDto } from "../redux/sign-up/types/sign-up.dto";
import { uploadToFirebaseAndCreateFile } from "../redux/actions";
import { Text } from "@/src/components/Themed";
import messaging from '@react-native-firebase/messaging';

export default function SignUpUploadPhotoScreen({
  handleNext,
  onMain,
  isLoading,
  setIsLoading
}: BaseStepType) {
  const dispatch = useAppDispatch();
  const { signUp } = useAuth();

  const photoUrl = useAppSelector(state => state.signUpReducer.user_profile_picture_url);
  const signUpData = useAppSelector(state => state.signUpReducer);

  const [image, setImage] = useState<any>(photoUrl);
  const [showModalWindow, setShowModalWindow] = useState<boolean>(false);

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

  const handleSubmitForm = async () => {
    try {

      if (!signUpData.user_email ||
        !signUpData.user_password ||
        !signUpData.user_nickname ||
        !signUpData.user_profile_picture_url
      ) {
        setShowModalWindow(true);
        return;
      }

      setIsLoading(true);

      const file = await uploadToFirebaseAndCreateFile(photoUrl, 'profile');
      const token = await messaging().getToken();
      const signUpDto: SignUpDto = {
        user_email: signUpData.user_email.toLowerCase(),
        user_password: signUpData.user_password,
        user_nickname: signUpData.user_nickname,
        user_profile_picture_id: file.file_id,
        user_device_token: token
      };
      console.log('AUTH SIGN UP');
      const { data: responseInfo } = await repository.post("/auth/sign-up", signUpDto);
      setIsLoading(false);
      signUp(responseInfo.accessToken, responseInfo.refreshToken);
      dispatch(setSignUpFromReset());
      router.replace('/')
    } catch (error) {
      const err = error as any;
      console.error('ERROR IN SIGN UP: ', err.message);
      console.error('ERROR CODE IN SIGN UP: ', err.code);
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading && <LoaderScreen />}
      {!isLoading && showModalWindow &&
        <Snackbar
          visible={showModalWindow}
          onDismiss={() => setShowModalWindow(false)}
          action={{
            label: 'Close',
            textColor: Colors.white
          }}
          wrapperStyle={{
            zIndex: 100,
            position: 'absolute',
            top: 570
          }}
          style={{
            backgroundColor: Colors.deniedColor,
          }}
          duration={7000}
          elevation={5}
        >
          Please fill in all data
        </Snackbar>
      }
      {!isLoading &&
        <View style={styles.container}>
          <Button style={styles.button} onPress={pickImage} textColor={Colors.white}>
            <Text style={styles.buttonText}>Pick an image</Text>
          </Button>
          {image &&
            <Image
              source={{ uri: image }}
              style={styles.image}
            />
          }
          <SignUpButtons
            handleNext={handleNext}
            onMain={onMain}
            handleSubmit={handleSubmitForm}
          />
        </View>
      }
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    borderRadius: 30,
    paddingVertical: 10,
    width: 200,
    backgroundColor: Colors.darkBlue,
  },
  buttonText: {
    color: Colors.white,
  },
  image: {
    marginTop: 40,
    width: 250,
    height: 250,
    borderRadius: 200,
    borderWidth: 2,
    borderColor: Colors.darkBlue
  },
});