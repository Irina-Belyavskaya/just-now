import React, { useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useStorageState } from './useStorageState';
import JWT from 'expo-jwt';

type AuthContexttype = {
  signIn: (token: string) => void;
  signUp: (token: string) => void;
  signOut: () => void;
  token?: string | null;
  user?: string | null;
}

const AuthContext = React.createContext<AuthContexttype>({
  signIn: () => null,
  signUp: () => null,
  signOut: () => null,
  token: null,
  user: null
});

export function useAuth() {
  return React.useContext(AuthContext);
}

type JwtPayload = {
  user_id: string;
  user_email: string;
  user_entry_data:string; 
}

export function AuthProvider(props: React.PropsWithChildren) {
  const [[isLoadingToken, token], setToken] = useStorageState('token');
  const [[isLoadingUser, user], setUser] = useStorageState('user');
  const rootSegment = useSegments()[0];
  const router = useRouter();

  useEffect(() => {
    if (token === undefined) return;

    if (isLoadingToken) {
      router.replace("/loader");
    } else if (!token && rootSegment !== "(auth)") {
      router.replace("/(auth)/sign-in");
    } else if (token && rootSegment !== "(app)") {
      router.replace("/");
    }
  }, [token, rootSegment])

  return (
    <AuthContext.Provider
      value={{
        signIn: (token: string) => {
          setToken(token);
          console.log("token: ", token);
          const key = 'SECRET';
          const decoded: JwtPayload = JWT.decode(token, key);
          setUser(decoded.user_id);
        },
        signUp: (token: string) => {
          setToken(token);
          const key = 'SECRET';
          const decoded: JwtPayload = JWT.decode(token, key);
          setUser(decoded.user_id);
        },
        signOut: () => {
          setToken("");
          setUser("");
        },
        token,
        user
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}
