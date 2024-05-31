import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import UserListItem from '../../components/UserListItem';
import repository from '@/src/repository';
import { FriendRequest } from '@/src/types/friend-requests.type';
import { RoleType } from '@/src/types/role.type';
import { User } from '@/src/types/user.type';
import { getUserFriend } from '@/src/utils/getUserFriend';
import Colors from '@/src/constants/Colors';
import { useAppSelector } from '@/src/redux/hooks';

export default function UsersScreen() {
  const [users, setUsers] = useState<User[]>([]);

  const userInfo = useAppSelector(state => state.userReducer.userInfo);

  useEffect(() => {
    if (!userInfo)
      return;

    const fetchUsers = async () => {
      const { data: friends } = await repository.get('/friend-requests/friends');
      const userFriends = friends.map((friend: FriendRequest) => getUserFriend(friend, userInfo.user_id));
      setUsers(userFriends.filter((friend: User) => friend.role.role_type !== RoleType.USER_START));
    };
    fetchUsers();
  }, []);

  return (
    <FlatList
      data={users}
      contentContainerStyle={{ gap: 5, backgroundColor: Colors.lightBlue, flex: 1 }}
      renderItem={({ item }) => <UserListItem user={item} />}
    />
  );
}