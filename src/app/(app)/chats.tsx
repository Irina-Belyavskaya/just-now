
import Colors from '@/src/constants/Colors';
import { useAuth } from '@/src/context/auth-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { Link, Stack, router } from 'expo-router';
import { ChannelList } from 'stream-chat-expo';
import LoaderScreen from '../loader';

export default function ChatsScreen() {
  const { user } = useAuth();
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
      <ChannelList
        filters={{ members: { $in: [user] } }}
        onSelect={(channel) => router.push(`/channel/${channel.cid}`)}
        LoadingIndicator={() => <LoaderScreen />}
      />
    </>

  );
}
