import EmptyScreen from '@/src/components/EmptyScreen';
import { useAuth } from '@/src/context/auth-context';
import repository from '@/src/repository';
import { FriendRequestSenders, FriendRequestStatus } from '@/src/types/friend-requests.type';
import { useCallback, useEffect, useState } from 'react';
import LoaderScreen from '../loader';
import { Text, View } from '@/src/components/Themed';
import { ImageBackground, StyleSheet, Image } from 'react-native';
import Colors from '@/src/constants/Colors';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationssScreen() {
  const { user } = useAuth();
  const [isLoading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<FriendRequestSenders[]>([]);

  const getNotifications = useCallback(async () => {
    try {
      setLoading(true);
      console.log('GET NOTIFICATIONS');
      const { data } = await repository.get(`/friend-requests/${user}`);
      setNotifications(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [])

  const handleAcceptStatus = async (
    friend_request_id: string,
    friend_request_status: FriendRequestStatus
  ) => {
    try {
      const body = {
        friend_request_status: friend_request_status,
        friend_request_id: friend_request_id
      }
      console.log('UPDATE FRIENDS REQUEST STATUS');
      await repository.put('/friend-requests/update-status', body);
      getNotifications();
    } catch (error) {
      console.error(error);
    }
  }

  const handleDeniedStatus = async (
    friend_request_id: string,
  ) => {
    try {
      console.log('DELETE FRIENDS REQUEST');
      await repository.delete(`/friend-requests/remove-friend/${friend_request_id}`);
      getNotifications();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getNotifications();
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      {isLoading &&
        <LoaderScreen />
      }
      {!isLoading && notifications.length === 0 &&
        <EmptyScreen text='No notifications(' />
      }
      {!isLoading && notifications.length !== 0 &&
        notifications.map((notification) => (
          <View
            key={notification.friend_request_id}
            style={styles.requestWrap}
          >
            <View
              key={notification.friend_request_id}
              style={styles.nicknameWrap}
            >
              <Image
                style={styles.userImage}
                source={{ uri: notification.sender.file.file_url }}
              />
              <Text style={styles.requestText}>
                {notification.sender.user_nickname}
              </Text>
            </View>
            <View style={styles.btnWrap}>
              <Button
                textColor={Colors.white}
                style={styles.acceptBtn}
                onPress={() => handleAcceptStatus(notification.friend_request_id, FriendRequestStatus.ACCEPTED)}
              >
                Accept
              </Button>
              <Button
                textColor={Colors.white}
                style={styles.deniedBtn}
                onPress={() => handleDeniedStatus(notification.friend_request_id)}
              >
                Denied
              </Button>
            </View>
          </View>
        ))
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBlue
  },
  requestWrap: {
    margin: 10,
    backgroundColor: Colors.darkBlue,
    padding: 10,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  requestText: {
    color: Colors.white,
    fontSize: 16
  },
  nicknameWrap: {
    backgroundColor: Colors.darkBlue,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.darkBlue,
  },
  acceptBtn: {
    backgroundColor: Colors.acceptColor,
    marginRight: 10,
    borderRadius: 10
  },
  deniedBtn: {
    backgroundColor: Colors.deniedColor,
    borderRadius: 10
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 100,
    marginRight: 15
  },
});