"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";

import { doc, onSnapshot } from "firebase/firestore";

import { auth, db } from "@/lib/firebase";
import { logoutUser } from "@/lib/auth";

import type { CampusUser } from "@/types";

type AuthContextType = {
  user: FirebaseUser | null;
  profile: CampusUser | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  const [profile, setProfile] = useState<CampusUser | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);

        if (!firebaseUser) {
          setProfile(null);
          setLoading(false);
          return;
        }

        const userRef = doc(db, "users", firebaseUser.uid);

        const unsubscribeProfile = onSnapshot(
          userRef,
          (snapshot) => {
            if (snapshot.exists()) {
              setProfile(
                snapshot.data() as CampusUser
              );
            } else {
              setProfile(null);
            }

            setLoading(false);
          },
          () => {
            setProfile(null);
            setLoading(false);
          }
        );

        return () => unsubscribeProfile();
      }
    );

    return () => unsubscribeAuth();
  }, []);

  async function logout() {
    await logoutUser();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
