import { useState } from "react";
import { Pressable, Modal, StyleSheet, Image, View } from "react-native";
import { Post, PostType } from "../types/post.type";
import PhotoPost from "./PhotoPost";
import VideoPost from "./VideoPost";
import { ResizeMode, Video } from "expo-av";
import Colors from "../constants/Colors";
import { FontAwesome5 } from '@expo/vector-icons';
import { ActivityIndicator } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import Entypo from '@expo/vector-icons/Entypo';
import { TypeOfReactions } from "../types/reaction.type";
import { useAppSelector } from "../redux/hooks";
import { RoleType } from "../types/role.type";

type UserPostViewer = {
  post: Post
}

const height = 200;
const width = 200;

const mapReactionTypeToEnum = (reactionType: string): TypeOfReactions => {
  switch (reactionType) {
    case 'EMOJI_FLIRT':
      return TypeOfReactions.EMOJI_FLIRT;
    case 'EMOJI_HAPPY':
      return TypeOfReactions.EMOJI_HAPPY;
    case 'EMOJI_NEUTRAL':
      return TypeOfReactions.EMOJI_NEUTRAL;
    case 'EMOJI_SAD':
      return TypeOfReactions.EMOJI_SAD;
    default:
      return TypeOfReactions.EMOJI_NEUTRAL;
  }
}

export default function UserPostViewer({ post }: UserPostViewer) {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleLongPress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };
  const userInfo = useAppSelector(state => state.userReducer.userInfo);
  const roleType = userInfo?.role.role_type;

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
      {roleType === RoleType.USER_MONTHLY_PRO &&
        <ScrollView
          style={{
            position: 'absolute',
            bottom: 5,
            right: 20,
            height: height - 25
          }}
        >
          {post.reactions.map(reaction =>
            <View key={reaction.user_id} style={{ marginTop: 5 }}>
              <Entypo
                name={mapReactionTypeToEnum(reaction.reaction_type)}
                size={30}
                color={Colors.lightBlue}
                style={{
                  marginBottom: 5
                }}
              />
              <Image
                source={{ uri: reaction.user.file.file_url }}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 100,
                  position: 'absolute',
                  bottom: 0,
                  right: 0
                }}
              />
            </View>
          )}
        </ScrollView>
      }
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
    resizeMode: 'contain'
  },
});