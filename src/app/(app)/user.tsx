import ProfileHead from '@/src/components/ProfileInfo';
import repository from '@/src/repository';
import { User } from '@/src/types/user.type';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import LoaderScreen from '../loader';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/src/components/Themed';
import { Feather } from '@expo/vector-icons';
import { FriendRequestStatus, FriendRequest } from '@/src/types/friend-requests.type';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/src/constants/Colors';

export default function UserScreen() {
  const { user_id } = useLocalSearchParams<{ user_id: string }>();

  const [userInfo, setUserInfo] = useState<User>();
  const [friendRequest, setFriendRequest] = useState<FriendRequest>();
  const [isLoading, setLoading] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [numberOfPhotoPosts, setNumberOfPhotoPosts] = useState<number>(0);
  const [numberOfVideoPosts, setNumberOfVideoPosts] = useState<number>(0);
  const [numberOfUserFriends, setNumberOfUserFriends] = useState<number>(0);

  const checkFriendshipStatus = useCallback(async () => {
    try {
      setLoading(true);
      setIsRequestSent(false);
      const body = {
        friend_id: user_id
      }
      console.log('CHECK FRIENDSHIP STATUS');
      const { data } = await repository.post('/friend-requests/check-friendship-status', body);
      setFriendRequest(data);
      if (!data) {
        setIsFriend(false);
        setIsRequestSent(false);
      }

      if (data.friend_request_status === FriendRequestStatus.REQUEST) {
        setIsFriend(false);
        setIsRequestSent(true);
      }
      if (data.friend_request_status === FriendRequestStatus.ACCEPTED) setIsFriend(true);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [user_id])

  const getUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      console.log('GET USER PROFILE');
      const params = {
        user_id
      }
      const { data } = await repository.get('/users/user-info', { params });
      setUserInfo(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [user_id])

  const getUserPosts = useCallback(async () => {
    try {
      setLoading(true);
      console.log('GET POSTS INFO FOR PROFILE');
      const params = {
        user_id
      }
      const { data } = await repository.get('posts/profile-posts-info', { params });
      setNumberOfPhotoPosts(data.numberOfPhotoPosts);
      setNumberOfVideoPosts(data.numberOfVideoPosts);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [])

  useEffect(() => {
    getUserProfile();
    getUserPosts();
  }, [getUserProfile])

  useEffect(() => {
    checkFriendshipStatus();
  }, [checkFriendshipStatus])

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        console.log('GET FREINDS');
        const params = {
          user_id
        }
        const { data: userFriends } = await repository.get('/friend-requests/friends', { params });
        setNumberOfUserFriends(userFriends.length);
        setLoading(false);
      } catch (error) {
        console.error('ERROR IN GET FRIENDS: ', error);
        setLoading(false);
      }
    })();
  }, [])

  const handleAddFriend = async () => {
    try {
      setLoading(true);
      const body = {
        receiver_id: user_id
      }
      console.log('CREATE FRIEND REQUEST');
      await repository.post('/friend-requests/create', body);
      checkFriendshipStatus();
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  const handleRemoveFriend = async () => {
    if (!friendRequest)
      return;
    try {
      setLoading(true);
      console.log('DELETE FRIEND REQUEST');
      await repository.delete(`/friend-requests/remove-friend/${friendRequest.friend_request_id}`);
      checkFriendshipStatus();
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {isLoading &&
        <LoaderScreen />
      }
      {!isLoading && userInfo && isFriend &&
        <TouchableOpacity style={styles.requestWrap} onPress={handleRemoveFriend}>
          <Text style={{ textTransform: 'uppercase', marginRight: 10 }}>Remove friend</Text>
          <Ionicons name="person-remove" size={24} color="black" />
        </TouchableOpacity>
      }
      {!isFriend && userInfo && !isRequestSent &&
        <TouchableOpacity style={styles.requestWrap} onPress={handleAddFriend}>
          <Text style={{ textTransform: 'uppercase', marginRight: 10 }}>Send Request</Text>
          <Ionicons name="person-add" size={24} color="black" />
        </TouchableOpacity>
      }
      {!isFriend && userInfo && isRequestSent &&
        <View style={styles.requestWrap}>
          <Text style={{ textTransform: 'uppercase', marginRight: 10 }}>Waiting for answer</Text>
          <Feather name="loader" size={24} color="black" />
        </View>
      }
      {userInfo &&
        <ProfileHead
          userInfo={userInfo}
          numberOfUserFriends={numberOfUserFriends}
          numberOfPhotos={numberOfPhotoPosts}
          numberOfVideo={numberOfVideoPosts}
        />
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightBlue,
    flex: 1
  },
  requestWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    padding: 20
  }
});
