
import Colors from '@/src/constants/Colors';
import { FontAwesome6 } from '@expo/vector-icons';
import { Link, Stack, router } from 'expo-router';
import { ChannelList } from 'stream-chat-expo';
import LoaderScreen from '../loader';
import { useAppSelector } from '@/src/redux/hooks';

export default function ChatsScreen() {
  const userInfo = useAppSelector(state => state.userReducer.userInfo);

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Link href={'/users'} asChild>
              <FontAwesome6
                name="users"
                size={20}
                color={Colors.white}
              />
            </Link>
          )
        }}
      />
      {userInfo &&
        <ChannelList
          filters={{ members: { $in: [userInfo.user_id] } }}
          onSelect={(channel) => router.push(`/channel/${channel.cid}`)}
          LoadingIndicator={() => <LoaderScreen />}
        />
      }
    </>

  );
}
