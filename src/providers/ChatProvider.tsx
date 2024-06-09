import { PropsWithChildren, useEffect, useState } from "react";
import { StreamChat } from 'stream-chat';
import { OverlayProvider, Chat } from "stream-chat-expo";
import { useAppSelector } from "../redux/hooks";
import { RoleType } from "../types/role.type";
import Colors from "../constants/Colors";
import messaging from '@react-native-firebase/messaging';
import { User } from "../types/user.type";
import repository from "../repository";

const client = StreamChat.getInstance(`panhwp4pcwu3`);

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

// 💭✉️ 📩

export default function ChatProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const userInfo = useAppSelector(state => state.userReducer.userInfo);

  const registerDevice = async (user_id: string) => {
    console.log('-----------Register-------------');
    const token = await messaging().getToken();

    await repository.post('notifications/check-device-token', { token });
    const push_provider = 'firebase';
    const push_provider_name = 'JustNowFirebaseConfiguration';
    // client.setLocalDevice({
    //   id: token,
    //   push_provider,
    //   push_provider_name,
    // });

    const response = await client.addDevice(
      token,
      push_provider,
      user_id,
      push_provider_name,
    );
    console.log('response from addDevice: ', response);
  }

  const requestPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };

  const connectUser = async (user_id: string, user_nickname: string, image: string) => {
    try {
      console.log('Connect: ', user_id);
      await client.connectUser(
        {
          id: user_id,
          name: user_nickname,
          image,
        },
        client.devToken(user_id),
      );
      console.log('User connect!');
    } catch (error) {
      console.error('Connect user failed: ', error);
    }
  }

  const updateUser = async (user_nickname: string, image: string) => {
    try {
      if (!client.user)
        return;

      console.log('Update: ', user_nickname);

      await client.partialUpdateUser({
        id: client.user.id,
        set: {
          name: user_nickname,
          image,
        }
      });
      console.log('User updated!');
    } catch (error) {
      console.error('Update user failed: ', error);
    }
  }

  const init = async (userInfo: User) => {
    try {
      requestPermission();
      if (client.user === undefined) {
        await connectUser(userInfo.user_id, userInfo.user_nickname, userInfo.file.file_url);
      } else {
        await updateUser(userInfo.user_nickname, userInfo.file.file_url);
      }
      await registerDevice(userInfo.user_id);
      setIsReady(true);
    } catch (error) {
      console.error('ERROR IN init: ', error);
    }
  }

  useEffect(() => {
    if (!userInfo || !userInfo.user_id || isReady)
      return;

    if (userInfo.role.role_type === RoleType.USER_START)
      return;

    init(userInfo);

    return () => {
      if (isReady) {
        console.log('Disconnect!')
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