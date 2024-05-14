import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import UserListItem from '../../components/UserListItem';
import { useAuth } from '@/src/context/auth-context';
import repository from '@/src/repository';
import { FriendRequest } from '@/src/types/friend-requests.type';
import { RoleType } from '@/src/types/role.type';
import { User } from '@/src/types/user.type';
import { getUserFriend } from '@/src/utils/getUserFriend';

export default function UsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user)
      return;

    const fetchUsers = async () => {
      const { data: friends } = await repository.get(`/friend-requests/friends/${user}`);
      const userFriends = friends.map((friend: FriendRequest) => getUserFriend(friend, user));
      setUsers(userFriends.filter((friend: User) => friend.role.role_type !== RoleType.USER_START));
    };
    fetchUsers();

  }, []);

  return (
    <FlatList
      data={users}
      contentContainerStyle={{ gap: 5 }}
      renderItem={({ item }) => <UserListItem user={item} />}
    />
  );
}