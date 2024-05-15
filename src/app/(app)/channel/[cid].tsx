import { useLocalSearchParams } from 'expo-router';
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

  return (
    <Channel channel={channel} audioRecordingEnabled keyboardVerticalOffset={60}>
      <MessageList />
      <SafeAreaView edges={['bottom']}>
        <MessageInput />
      </SafeAreaView>
    </Channel>
  )
}