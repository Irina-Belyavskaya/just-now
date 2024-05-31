import { PropsWithChildren, useEffect, useState } from "react";
import { StreamChat } from 'stream-chat';
import { OverlayProvider, Chat } from "stream-chat-expo";
import { useAppSelector } from "../redux/hooks";
import { RoleType } from "../types/role.type";
import Colors from "../constants/Colors";

const client = StreamChat.getInstance(`${process.env.EXPO_PUBLIC_STREAM_API_KEY}`);

const theme = {
  channelListMessenger: {
    flatListContent: {
      backgroundColor: Colors.lightBlue
    }
  },
  channelPreview: {
    container: {
      backgroundColor: Colors.lightBlue
    },
    contentContainer: {
      backgroundColor: Colors.lightBlue

    },
  },
  messageSimple: {
    content: {
      textContainer: {
        backgroundColor: Colors.darkBlue,
      },
      markdown: {
        text: {
          color: Colors.white
        }
      },
    },

  },
  messageList: {
    contentContainer: {
      backgroundColor: Colors.lightBlue
    }
  },
  messageInput: {
    container: {
      backgroundColor: Colors.lightBlue
    },
    inputBoxContainer: {
      backgroundColor: Colors.white,
      borderColor: Colors.white
    }
  }
};


export default function ChatProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const userInfo = useAppSelector(state => state.userReducer.userInfo);

  useEffect(() => {
    if (!userInfo || isReady)
      return;

    if (userInfo.role.role_type === RoleType.USER_START)
      return;

    const connect = async () => {
      await client.connectUser(
        {
          id: userInfo.user_id,
          name: userInfo.user_nickname,
          image: userInfo.file.file_url,
        },
        client.devToken(userInfo.user_id),
      );
      console.log('User connect!')
      setIsReady(true);
    }

    const update = async () => {
      try {
        if (!client.user)
          return;
        await client.partialUpdateUser({
          id: client.user.id,
          set: {
            name: userInfo.user_nickname,
            image: userInfo.file.file_url,
          }
        });
        console.log('User updated!');
        setIsReady(true);
      } catch (error) {
        console.error('Update failed: ', error);
      }
    }

    if (client.user === undefined) {
      connect();
    } else {
      update();
    }

    return () => {
      if (isReady) {
        client.disconnectUser();
      }
      setIsReady(false);
    }
  }, [userInfo?.user_id]);

  return (
    <OverlayProvider value={{ style: theme }}>
      <Chat client={client}>
        {children}
      </Chat>
    </OverlayProvider>
  )
}