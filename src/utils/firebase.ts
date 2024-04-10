import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import uuid from 'react-native-uuid';

const firebaseConfig = {
  apiKey: "AIzaSyCtT1UMxcFJ0sf4U-M2I7pLShFczcCpNYw",
  authDomain: "justnow-2024.firebaseapp.com",
  projectId: "justnow-2024",
  storageBucket: "justnow-2024.appspot.com",
  messagingSenderId: "680634362853",
  appId: "1:680634362853:web:9ae79e6e983a388d3e5d0c",
  measurementId: "G-V7ZQ0G6VK4"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const sendToFirebase = async (blob: Blob, user_id: string) => {
  try {
    const storageRef = ref(storage,`${user_id}/${uuid.v4()}`);

    const snapshot = await uploadBytes(storageRef, blob);
    if (snapshot) {
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    }
  } catch (error) {
    console.log(error);
  }
  
}