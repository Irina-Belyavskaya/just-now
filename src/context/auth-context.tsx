import React, { useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useStorageState } from './useStorageState';

type AuthContexttype = {
  signIn: (token: string) => void;
  signOut: () => void;
  session?: string | null;
}

const AuthContext = React.createContext<AuthContexttype>({
  signIn: () => null,
  signOut: () => null,
  session: null
});

export function useAuth() {
  return React.useContext(AuthContext);
}

export function AuthProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');
  const rootSegment = useSegments()[0];
  const router = useRouter();

  useEffect(() => {
    if (session === undefined) return;

    if (!session && rootSegment !== "(auth)") {
      router.replace("/(auth)/sign-in");
    } else if (session && rootSegment !== "(app)") {
      router.replace("/");
    }
  }, [session, rootSegment])

  return (
    <AuthContext.Provider
      value={{
        signIn: (token: string) => {
          setSession(token);
        },
        signOut: () => {
          setSession("");
        },
        session,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}
