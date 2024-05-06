import React, { useCallback, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useStorageState } from './useStorageState';
import JWT from 'expo-jwt';
import { getUser } from '../redux/user/users.actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setUserReset } from '../redux/user/user.reducer';

type AuthContexttype = {
  signIn: (token: string, expiredAt: string) => void;
  signUp: (token: string, expiredAt: string) => void;
  signOut: () => void;
  token: string | null;
  user: string | null;
  expiredAt: string | null;
}

const AuthContext = React.createContext<AuthContexttype>({
  signIn: () => null,
  signUp: () => null,
  signOut: () => null,
  token: null,
  user: null,
  expiredAt: null
});

export function useAuth() {
  return React.useContext(AuthContext);
}

export type JwtPayload = {
  user_id: string;
  user_email: string;
  user_entry_data: string;
}

export function AuthProvider(props: React.PropsWithChildren) {
  const [[isLoadingToken, token], setToken] = useStorageState('token');
  const [[isLoadingUser, user], setUser] = useStorageState('user');
  const [[isLoadingExpiredAt, expiredAt], setExpiredAt] = useStorageState('expiredAt');

  const rootSegment = useSegments()[0];

  const router = useRouter();

  const userState = useAppSelector(state => state.userReducer.userInfo);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token === undefined) return;

    console.log("-----------------------------------------------");
    console.log("TOKEN IN AUTH PROVIDER: ", token);
    console.log("USER IN AUTH PROVIDER: ", user);
    console.log("IS LOADING TOKEN IN AUTH PROVIDER: ", isLoadingToken);
    console.log("IS LOADING USER IN AUTH PROVIDER: ", isLoadingUser);
    console.log("-----------------------------------------------");

    if (isLoadingToken || isLoadingUser || isLoadingExpiredAt) {
      router.replace("/loader");
    } else if (!token && rootSegment !== "(auth)") {
      router.replace("/(auth)/sign-in");
    } else if (token && rootSegment !== "(app)") {
      router.replace("/");
    }
  }, [token, rootSegment, isLoadingToken, isLoadingUser, isLoadingExpiredAt])

  useEffect(() => {
    if (user && !userState) {
      console.log('*********** GET USER IN AUTH CONTEXT ***********');
      console.log('*********** USER STATE IN AUTH CONTEXT ***********', userState);
      dispatch(getUser({ id: user }));
    }
  }, [user, userState]);

  return (
    <AuthContext.Provider
      value={{
        signIn: async (token: string, expiredAt: string) => {
          try {
            console.log('SIGN IN AUTH PROVIDER');
            setToken(token);
            const key = 'SECRET';
            const decoded: JwtPayload = JWT.decode(token, key);
            setUser(decoded.user_id);
            setExpiredAt(expiredAt);
          } catch (error) {
            console.log(error)
          }
        },
        signUp: (token: string, expiredAt: string) => {
          try {
            console.log('SIGN IN AUTH PROVIDER');
            setToken(token);
            const key = 'SECRET';
            const decoded: JwtPayload = JWT.decode(token, key);
            setUser(decoded.user_id);
            setExpiredAt(expiredAt);
          } catch (error) {
            console.log(error)
          }
        },
        signOut: () => {
          setToken(null);
          setUser(null);
          setExpiredAt(null);
          dispatch(setUserReset());
        },
        token,
        user,
        expiredAt
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}
