import EmptyScreen from '@/src/components/EmptyScreen';
import ProfileHead from '@/src/components/ProfileHead';
import Sizes from '@/src/constants/Sizes';
import { useAuth } from '@/src/context/auth-context';
import repository from '@/src/repository';
import { User } from '@/src/types/user.type';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import LoaderScreen from '../loader';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/src/components/Themed';
import { Feather } from '@expo/vector-icons';
import { FriendRequestStatus, FriendRequest } from '@/src/types/friend-requests.type';

export default function UserScreen() {
  const {user_id} = useLocalSearchParams<{ user_id: string }>();
  const {user} = useAuth();

  const [userInfo, setUserInfo] = useState<User>();
  const [friendRequest, setFriendRequest] = useState<FriendRequest>();
  const [isLoading, setLoading] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);
 
  const checkFriendshipStatus = useCallback(async () => {
    try {
      setLoading(true);
      setIsRequestSent(false);
      const body = {
        user_id: user,
        friend_id: user_id
      }
      const {data} = await repository.post('/friend-requests/check-friendship-status', body);
      setFriendRequest(data);
      if (!data) {
        setIsFriend(false);
        setIsRequestSent(false);
      }
      if (data.friend_request_status === FriendRequestStatus.rejected) setIsFriend(false);
      if (data.friend_request_status === FriendRequestStatus.request) {
        setIsFriend(false);
        setIsRequestSent(true);
      }
      if (data.friend_request_status === FriendRequestStatus.accepted) setIsFriend(true);
      
      console.log(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [user_id, user])

  const getUserInfo = useCallback(async () => {
    try {
      setLoading(true);
      const {data} = await repository.get(`/users/${user_id}`);
      setUserInfo(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [user_id])

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo])

  useEffect(() => {
    checkFriendshipStatus();
  }, [checkFriendshipStatus])

  const handleAddFriend = async () => {
    try {
      setLoading(true);
      const body = {
        sender_id: user,
        receiver_id: user_id
      }
      const {data} = await repository.post('/friend-requests/create', body);
      checkFriendshipStatus();
      console.log(data);
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
      const {data} = await repository.delete(`/friend-requests/remove-friend/${friendRequest.friend_request_id}`);
      console.log(data);
      checkFriendshipStatus();
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }
  
  return (
    <>
      {isLoading && 
        <LoaderScreen />
      }
      {!isLoading && userInfo &&
        <ImageBackground
          style={styles.backgroundImage}
          source={require("../../../assets/yellow_background.jpg")}
          blurRadius={8}
        >
          {isFriend &&
            <TouchableOpacity style={styles.requestWrap} onPress={handleRemoveFriend}>
              <Text style={{textTransform: 'uppercase', marginRight: 10}}>Remove friend</Text>
              <Ionicons name="person-remove" size={24} color="black"/>
            </TouchableOpacity>
          }
          {!isFriend && !isRequestSent &&
            <TouchableOpacity style={styles.requestWrap} onPress={handleAddFriend}>
              <Text style={{textTransform: 'uppercase', marginRight: 10}}>Send Request</Text>
              <Ionicons name="person-add" size={24} color="black"/>
            </TouchableOpacity>
          }
          {!isFriend && isRequestSent &&
            <View style={styles.requestWrap}>
              <Text style={{textTransform: 'uppercase', marginRight: 10}}>Waiting for answer</Text>
              <Feather name="loader" size={24} color="black" />
            </View>
          }
          { userInfo && <ProfileHead userInfo={userInfo} /> }
        </ImageBackground>
      }
    </>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    marginHorizontal: Sizes.medium,
    marginTop: Sizes.safe,
  },
  requestWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    padding: 20
  }
});
