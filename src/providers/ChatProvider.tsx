import { PropsWithChildren, useEffect, useState } from "react";
import { StreamChat } from 'stream-chat';
import { OverlayProvider, Chat } from "stream-chat-expo";
import { useAppSelector } from "../redux/hooks";
import { RoleType } from "../types/role.type";

const client = StreamChat.getInstance(`${process.env.EXPO_PUBLIC_STREAM_API_KEY}`);

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

    if (client.user === undefined) {
      connect();
    }

    return () => {
      if (isReady) {
        client.disconnectUser();
      }
      setIsReady(false);
    }
  }, [userInfo?.user_id]);

  return (
    <OverlayProvider>
      <Chat client={client}>
        {children}
      </Chat>
    </OverlayProvider>
  )
}