import React, { useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';

// const AuthContext = React.createContext<{
//   signIn: () => void;
//   signOut: () => void;
//   user?: string | null;
// }>({
//   signIn: () => null,
//   signOut: () => null,
//   user: null,
// });

const AuthContext = React.createContext<any>(null);

export function useAuth() {
  return React.useContext(AuthContext);
}

export function AuthProvider(props: React.PropsWithChildren) {
  const [user, setUser] = useState<string | undefined>("");
  const rootSegment = useSegments()[0];
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) return;

    if (!user && rootSegment !== "(auth)") {
      router.replace("/(auth)/sign-in");
    } else if (user && rootSegment !== "(app)") {
      router.replace("/");
    }
  }, [user, rootSegment])

  return (
    <AuthContext.Provider
      value={{
        signIn: () => {
          setUser('123456');
        },
        signOut: () => {
          setUser("");
        },
        user,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}
