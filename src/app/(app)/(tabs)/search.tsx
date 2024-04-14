import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { Text, View as ViewThemed } from '@/src/components/Themed';
import Colors from '@/src/constants/Colors';
import repository from '@/src/repository';
import { User } from '@/src/types/user.type';
import { useNavigation } from 'expo-router';

export default function SearchScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredData, setFilteredData] = useState<User[]>([]);

  useEffect(() => {
    setUsers([]);
    setFilteredData([]);
    (async () => {
      try {
        // setLoading(true);
        const {data} = await repository.get('/users');
        setUsers(data);
        console.log(data);
        // setLoading(false);
      } catch (error) {
        console.error(error);
        // setLoading(false);
      }
    })();
  }, [])

  const handleSearch = (text: string) => {
    const query = text.toLowerCase();

    if (query === '') {
      setFilteredData([]);
      setSearchQuery(text);
      return;
    }

    const filteredUsers = users.filter((user) =>
      user.user_nickname.toLowerCase().includes(query)
    );

    // const filteredFiles = files.filter((file) =>
    //   file.title.toLowerCase().includes(query)
    // );

    setFilteredData([...filteredUsers]);
    setSearchQuery(text);
  };

  const handleItemSelected = (item: any) => {
    // // Check the type of the item and navigate accordingly
    // if (item.type === 'user') {
    //   navigation.navigate('UserProfile', { user: item });
    // } else if (item.type === 'file') {
    //   navigation.navigate('FileScreen', { file: item });
    // }
    // // Add more conditions for other types/screens as needed
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
          data={filteredData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleItemSelected(item)}>
              <Text>{item.user_nickname}</Text>
            </TouchableOpacity>
          )}
        />
      }
      <View>
        <Text style={{fontFamily: 'Raleway_700Bold', fontSize: 20}}>
          Friends Requests
        </Text>
      </View>
      <ViewThemed style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View>
        <Text style={{fontFamily: 'Raleway_700Bold', fontSize: 20}}>
          Friends
        </Text>
        {users.map((user) => <Text key={user.user_id}>{user.user_nickname}</Text>)}
      </View>
    </View>    
  );
}





// export default function SearchScreen()  {
//   const navigation = useNavigation();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [users, setUsers] = useState<User[]>([]);
//   const [filteredData, setFilteredData] = useState(users);

//   useEffect(() => {
//     (async () => {
//       try {
//         // setLoading(true);
//         const {data} = await repository.get('/users');
//         setUsers(data);
//         console.log(data);
//         // setLoading(false);
//       } catch (error) {
//         console.error(error);
//         // setLoading(false);
//       }
//     })();
//   }, [])

//   const handleSearch = (text: string) => {
//     const query = text.toLowerCase();

//     const filteredUsers = users.filter((user) =>
//       user.user_nickname.toLowerCase().includes(query)
//     );

//     // const filteredFiles = files.filter((file) =>
//     //   file.title.toLowerCase().includes(query)
//     // );

//     setFilteredData([...filteredUsers]);
//     setSearchQuery(text);
//   };

//   const handleItemSelected = (item: any) => {
//     // // Check the type of the item and navigate accordingly
//     // if (item.type === 'user') {
//     //   navigation.navigate('UserProfile', { user: item });
//     // } else if (item.type === 'file') {
//     //   navigation.navigate('FileScreen', { file: item });
//     // }
//     // // Add more conditions for other types/screens as needed
//   };

//   return (
//     <View>
//       <Searchbar
//         placeholder="Search"
//         onChangeText={handleSearch}
//         value={searchQuery}
//         autoCapitalize={'none'}
//       />
//       <FlatList
//         data={filteredData}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <TouchableOpacity onPress={() => handleItemSelected(item)}>
//             <Text>{item.user_nickname}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };


const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.pickedYelllow
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '100%',
  },
});
