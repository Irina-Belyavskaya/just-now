import { initializeApp } from "firebase/app";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import uuid from 'react-native-uuid';
import { FirebaseResponse } from "../types/firebase-response.type";

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

export const generatePath = (base: string, user_id?: string) => {
  let path = `${base}/`;
  if (user_id) {
    path += user_id;
  } else {
    path += uuid.v4();
  }
  return path;
}

export const sendToFirebase = async (blob: Blob, path: string): Promise<FirebaseResponse | null> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, blob);

    if (snapshot) {
      console.log(JSON.stringify(snapshot, null, 2));

      const downloadURL = await getDownloadURL(storageRef);
      return {
        url: downloadURL,
        fullPath: snapshot.metadata.fullPath,
        size: snapshot.metadata.size
      };
    }
    return null;
  } catch (error) {
    console.log('ERROR IN sendToFirebase: ', error);
    return null;
  }
}

export const deleteFileFromFirebase = async (fullPath: string) => {
  const desertRef = ref(storage, fullPath);

  deleteObject(desertRef).then(() => {
    return;
  }).catch((error) => {
    console.log('ERROR IN deleteFileFromFirebase: ', error);
  });
}