import { Stack, useLocalSearchParams } from 'expo-router';
import { Channel as ChannelType } from 'stream-chat';
import { useEffect, useState } from 'react';
import LoaderScreen from '../../loader';
import { Channel, MessageList, MessageInput, useChatContext } from 'stream-chat-expo';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChannelScreen() {
  const [channel, setChannel] = useState<ChannelType | null>(null);
  const { cid } = useLocalSearchParams<{ cid: string }>();

  const { client } = useChatContext();

  useEffect(() => {
    const fetchChannel = async () => {
      const channels = await client.queryChannels({ cid });
      setChannel(channels[0]);
    }

    fetchChannel();
  }, [cid]);

  if (!channel) {
    return <LoaderScreen />
  }

  const otherMember = Object.values(channel.state.members).find(
    (member: any) => member.user_id !== client.userID
  );

  const channelTitle = otherMember ? otherMember.user?.name : "Chat";

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: channelTitle,
        }}
      />
      <Channel channel={channel} audioRecordingEnabled keyboardVerticalOffset={60}>
        <MessageList />
        <SafeAreaView edges={['bottom']}>
          <MessageInput />
        </SafeAreaView>
      </Channel>
    </>
  )
}