import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { Text, View as ViewThemed } from '@/src/components/Themed';
import Colors from '@/src/constants/Colors';
import repository from '@/src/repository';
import { User } from '@/src/types/user.type';
import { router, useFocusEffect } from 'expo-router';
import { useAuth } from '@/src/context/auth-context';
import { FriendRequestSenders } from '@/src/types/friend-requests.type';

export default function SearchScreen() {;
  const {user} = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [friends, setFriends] = useState<FriendRequestSenders[]>([]);
  const [filteredData, setFilteredData] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      try {
        // setLoading(true);
        const {data} = await repository.get('/users');
        setUsers(data.filter((item: User) => item.user_id !== user));
        console.log(data);
        // setLoading(false);
      } catch (error) {
        console.error(error);
        // setLoading(false);
      }
    })();
  }, [user])

  useFocusEffect(
    useCallback(() => {
      if (!user)
        return;
  
      (async () => {
        try {
          // setLoading(true);
          const {data} = await repository.get(`/friend-requests/friends/${user}`);
          setFriends(data);
          console.log("friends: ", data);
          // setLoading(false);
        } catch (error) {
          console.error(error);
          // setLoading(false);
        }
      })();
    }, [])
  );

  // useFocusEffect(() => {
    // if (!user)
    //   return;

    // (async () => {
    //   try {
    //     // setLoading(true);
    //     const {data} = await repository.get(`/friend-requests/friends/${user}`);
    //     setFriends(data);
    //     console.log("friends: ", data);
    //     // setLoading(false);
    //   } catch (error) {
    //     console.error(error);
    //     // setLoading(false);
    //   }
    // })();
  // })

  const handleSearch = (text: string) => {
    const query = text.toLowerCase();
    setSearchQuery(text);


    if (query === '') {
      setFilteredData([]);
      return;
    }

    const filteredUsers = users.filter((user) =>
      user.user_nickname.toLowerCase().includes(query)
    );

    setFilteredData([...filteredUsers]);
  };

  const handleItemSelected = (user_id: string) => {
    router.push('/user');
    router.setParams({user_id: user_id})
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search"
        onChangeText={handleSearch}
        value={searchQuery}
        autoCapitalize='none'
      />
      { filteredData.length > 0 && 
        <FlatList
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
          data={filteredData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 8
              }}
              onPress={() => handleItemSelected(item.user_id)}
            >
              <Image 
                style={styles.userImage} 
                source={{uri: item.user_profile_picture_url}}
              />
              <Text style={{fontSize: 18, marginLeft: 20}}>
                {item.user_nickname}
              </Text>
            </TouchableOpacity>
          )}
        />
      }
      <ViewThemed style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View >
        <Text style={styles.friendsTitle}>
          Friends
        </Text>
       
          {friends.map((friend) => 
            <TouchableOpacity 
              style={styles.friendWrap}
              key={friend.friend_request_id}
              onPress={() => handleItemSelected(friend.sender.user_id)}
            >
              <Image 
                style={styles.userImage} 
                source={{uri: friend.sender.user_profile_picture_url}}
              />
              <Text style={{fontSize: 18}}>
                {friend.sender.user_nickname}
              </Text>
            </TouchableOpacity>
          )}
        
      </View>
    </View>    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    backgroundColor: Colors.pickedYelllow
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '100%',
  },
  friendsTitle: {
    fontFamily: 'Raleway_700Bold', 
    fontSize: 25,
    textAlign: 'center'
  },
  userImage: {
    width: 40, 
    height: 40,
    borderRadius: 100,
    marginRight: 15
  },
  friendWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 2
  }
});
