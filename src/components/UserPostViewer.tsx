import { useState } from "react";
import { Pressable, Modal, StyleSheet } from "react-native";
import { Post, PostType } from "../types/post.type";
import PhotoPost from "./PhotoPost";
import VideoPost from "./VideoPost";
import { ResizeMode, Video } from "expo-av";
import Colors from "../constants/Colors";
import { FontAwesome5 } from '@expo/vector-icons';
import { ActivityIndicator } from "react-native-paper";

type UserPostViewer = {
  post: Post
}

const height = 200;
const width = 200;

export default function UserPostViewer({ post }: UserPostViewer) {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleLongPress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Pressable
        style={{ marginRight: 10 }}
        onLongPress={handleLongPress}
      >
        {post.post_type === PostType.PHOTO
          ?
          <PhotoPost imageUrl={post.file.file_url} />
          :
          <>
            <Video
              style={{
                height,
                width,
                aspectRatio: 1,
              }}
              resizeMode={ResizeMode.CONTAIN}
              source={{ uri: post.file.file_url }}
              onLoadStart={() => setIsLoading(true)}
              onLoad={() => setIsLoading(false)}
            />
            {isLoading &&
              <ActivityIndicator
                size={'large'}
                color={Colors.darkBlue}
                style={{
                  position: 'absolute', alignSelf: 'center', top: '30%'
                }}
              />
            }
            {!isLoading &&
              <FontAwesome5
                name="video"
                size={30}
                color={Colors.lightBlue}
                style={{
                  position: 'absolute',
                  left: '35%',
                  top: '35%',
                  padding: 10,
                  borderRadius: 100,
                  backgroundColor: Colors.alt
                }}
              />
            }
          </>

        }
      </Pressable>
      <Modal visible={modalVisible} transparent={true} onRequestClose={handleCloseModal}>
        <Pressable style={styles.modalContainer} onPress={handleCloseModal}>
          {post.post_type === PostType.PHOTO
            ?
            <PhotoPost imageUrl={post.file.file_url} imageStyles={styles.modalImage} />
            :
            <VideoPost
              key={post.post_id}
              post={post}
              height={350}
              width={350}
            />
          }
        </Pressable>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.alt,
  },
  modalImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
});