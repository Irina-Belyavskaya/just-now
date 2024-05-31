import repository from "../repository";
import { generatePath, sendToFirebase } from "../utils/firebase";

export const uploadToFirebaseAndCreateFile = async (photoUrl: string, basePath: string, user_id?: string) => {
  try {
    const result = await fetch(photoUrl)
    const blob = await result.blob();

    const path = generatePath(basePath, user_id);
    const response = await sendToFirebase(blob, path);

    if (!response) {
      throw new Error('Something go wrong');
    }

    const fileDto = {
      file_url: response.url,
      file_path: response.fullPath,
      file_size: response.size,
    }
    const { data } = await repository.post("/files", fileDto);
    return data;
  } catch (error) {
    console.error('ERROR IN uploadToFirebaseAndCreateFile: ', error);
  }
}

export const uploadToFirebaseAndUpdateFile = async (photoUrl: string, file_id: string) => {
  try {
    const result = await fetch(photoUrl)
    const blob = await result.blob();

    const { data: file } = await repository.get(`/files/${file_id}`);
    const response = await sendToFirebase(blob, file.file_path);

    if (!response) {
      throw new Error('Something go wrong');
    }

    const fileDto = {
      file_url: response.url,
      file_path: response.fullPath,
      file_size: response.size,
    }
    const { data } = await repository.put(`/files/${file_id}`, fileDto);
    return data;
  } catch (error) {
    console.error('ERROR IN uploadToFirebaseAndUpdateFile: ', error);
  }
}