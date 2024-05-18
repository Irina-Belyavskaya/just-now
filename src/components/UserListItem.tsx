import { Image, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { useChatContext } from 'stream-chat-expo';
import { Stack, router } from 'expo-router';
import { useAuth } from '../context/auth-context';
import { User } from '../types/user.type';
import Colors from '../constants/Colors';
import { Text } from './Themed';

type UserListItemProps = {
  user: User
}

const UserListItem = ({ user }: UserListItemProps) => {
  const { client } = useChatContext();
  const { user: me } = useAuth();

  const onPress = async () => {
    try {
      if (!me)
        return;

      // Start a chat with him
      const channel = client.channel('messaging', {
        members: [me, user.user_id],
      });
      await channel.watch();
      router.replace(`/(app)/channel/${channel.cid}`);
    } catch (error) {
      console.error('ERROR IN UserListItem: ', error);
    }
  };

  return (
    user &&
    <Pressable
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: Colors.lightBlue,
      }}
      onPress={onPress}
    >
      <Stack.Screen options={{ headerTitle: 'Friends' }} />
      <Image
        style={styles.userImage}
        source={{ uri: user.file.file_url }}
      />
      <Text style={{ fontSize: 20, marginLeft: 10 }}>
        {user.user_nickname}
      </Text>
    </Pressable>
  );
};

export default UserListItem;

const styles = StyleSheet.create({
  userImage: {
    width: 55,
    height: 55,
    borderRadius: 100,
    marginRight: 15
  }
});