import React, { useCallback, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useStorageState } from './useStorageState';
import JWT from 'expo-jwt';
import { getUser } from '../redux/user/users.actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setUserReset } from '../redux/user/user.reducer';

type AuthContexttype = {
  signIn: (accessToken: string, refreshToken: string) => void;
  signUp: (accessToken: string, refreshToken: string) => void;
  signOut: () => void;
  user: string | null;
}

const AuthContext = React.createContext<AuthContexttype>({
  signIn: () => null,
  signUp: () => null,
  signOut: () => null,
  user: null,
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
  const [[isLoadingAccessToken, accessToken], setAccessToken] = useStorageState('accessToken');
  const [[isLoadingRefreshToken, refreshToken], setRefreshToken] = useStorageState('refreshToken');
  const [[isLoadingUser, user], setUser] = useStorageState('user');

  const rootSegment = useSegments()[0];

  const router = useRouter();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (accessToken === undefined) return;

    console.log("-----------------------------------------------");
    console.log("TOKEN IN AUTH PROVIDER: ", accessToken);
    console.log("USER IN AUTH PROVIDER: ", user);
    console.log("IS LOADING TOKEN IN AUTH PROVIDER: ", isLoadingAccessToken);
    console.log("IS LOADING USER IN AUTH PROVIDER: ", isLoadingUser);
    console.log("-----------------------------------------------");

    if (isLoadingAccessToken || isLoadingUser) {
      router.replace("/loader");
    } else if (!accessToken && rootSegment !== "(auth)") {
      router.replace("/(auth)/sign-in");
    } else if (accessToken && rootSegment !== "(app)") {
      router.replace("/");
    }
  }, [accessToken, rootSegment, isLoadingAccessToken, isLoadingUser])

  return (
    <AuthContext.Provider
      value={{
        signIn: async (accessToken: string, refreshToken: string) => {
          try {
            console.log('SIGN IN AUTH PROVIDER');
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);

            // TODO: remove
            const key = 'SECRET';
            const decoded: JwtPayload = JWT.decode(accessToken, key);
            setUser(decoded.user_id);
          } catch (error) {
            console.log(error)
          }
        },
        signUp: (accessToken: string, refreshToken: string) => {
          try {
            console.log('SIGN IN AUTH PROVIDER');
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);

            // TODO: remove
            const key = 'SECRET';
            const decoded: JwtPayload = JWT.decode(accessToken, key);
            setUser(decoded.user_id);
          } catch (error) {
            console.log(error)
          }
        },
        signOut: () => {
          setAccessToken(null);
          setRefreshToken(null);
          setUser(null);
          dispatch(setUserReset());
        },
        user,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}
