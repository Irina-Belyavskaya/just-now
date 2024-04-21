import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setPhotoUrl, setSignUpFromReset } from "../redux/sign-up.reducer";
import { BaseStepType } from "../types/base-step.type";
import React, { useState } from 'react';
import {
	Image,
	View,
	StyleSheet
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from 'react-native-paper';
import Colors from "../constants/Colors";
import SignUpButtons from "./SignUpButtons";
import repository from "../repository";
import { useAuth } from "../context/auth-context";
import { router } from "expo-router";
import { sendToFirebase } from "../utils/firebase";
import LoaderScreen from "../app/loader";
import ModalWindow from "./ModalWindow";

export default function SignUpUploadPhotoScreen ({
  handleNext, 
  onMain
}: BaseStepType) {
  const dispatch = useAppDispatch();
  const { signUp } = useAuth();
  
  const photoUrl = useAppSelector(state => state.signUp.photoUrl);
  const signUpData = useAppSelector(state => state.signUp);

  const [image, setImage] = useState<any>(photoUrl);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

      if (!signUpData.email ||
          !signUpData.password ||
          !signUpData.nickname || 
          !signUpData.photoUrl
      ) {
        setShowModalWindow(true);
        return;
      }

      setIsLoading(true);

      const result = await fetch(photoUrl)
      const blob = await result.blob();

      const url = await sendToFirebase(blob, 'profile');

      const dto = {
        user_email: signUpData.email,
        user_password: signUpData.password,
        // user_confirmPassword: signUpData.confirmPassword,
        user_nickname: signUpData.nickname,
        user_profile_picture_url: url
      };
      console.log("dto: ", dto);
      const { data: responseInfo, status } = await repository.post("/auth/sign-up", dto);
      console.log(responseInfo);
      console.log(status);
      setIsLoading(false);
      signUp(responseInfo.access_token);
      dispatch(setSignUpFromReset());
      router.replace('/')
    } catch (error) {
      const err = error as any;
      console.error(err.message);
      console.error(err.code);
    }
  } 

  return (
    <>
    {isLoading && <LoaderScreen />}
    {!isLoading && showModalWindow && 
      <ModalWindow
        modalVisible
        handleCloseModalWindow={() => setShowModalWindow(false)}
        message={'Please fill in all data'}
      />
    }
    {!isLoading && !showModalWindow &&
      <View style={styles.container}>
        <Button style={styles.button} onPress={pickImage} textColor={Colors.white}>
          Pick an image from camera roll
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
    width: 300,
    backgroundColor: Colors.black,
    color: Colors.white
  },
  image: {
    marginTop: 40,
    width: 250,
    height: 250,
    borderRadius: 200,
    borderWidth: 2,
    borderColor: "black"
  },
});