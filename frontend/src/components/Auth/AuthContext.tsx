"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  User,
  UserCredential,
  updateProfile,
} from "firebase/auth";
import { auth, firestore } from "../../../firebase/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

type ProfileData = {
  nickname: string;
  yearOfStudy: string;
  faculty: string;
  major: string;
  hobby: string;
  cca: string;
  birthday: string;
  profileCompleted: boolean;
};

type AuthContextType = {
  currentUser: User | null;
  profile: { displayName: string; photoURL: string };
  profileData: ProfileData | null;
  signup: (
    email: string,
    password: string,
    displayName: string,
    photoURL: string
  ) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  updateProfileData: (profileData: ProfileData) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ displayName: "", photoURL: "" });
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        const profileDoc = await getDoc(doc(firestore, "profiles", user.uid));
        if (profileDoc.exists()) {
          const data = profileDoc.data() as ProfileData;
          setProfile({ displayName: user.displayName || "", photoURL: user.photoURL || "" });
          setProfileData(data);
          if (data && !data.profileCompleted) {
            router.push("/profile/particulars");
          } else {
            router.push("/home");
          }
        } else {
          setProfile({ displayName: user.displayName || "", photoURL: user.photoURL || "" });
          setProfileData(null);
          router.push("/profile/particulars");
        }
      } else {
        setProfile({ displayName: "", photoURL: "" });
        setProfileData(null);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const signup = async (
    email: string,
    password: string,
    displayName: string,
    photoURL: string
  ): Promise<UserCredential> => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await updateProfile(user, { displayName, photoURL });

    await setDoc(doc(firestore, "users", user.uid), {
      displayName,
      photoURL,
      email,
    });

    await setDoc(doc(firestore, "profiles", user.uid), {
      userId: user.uid,
      profileCompleted: false,
      nickname: "",
      yearOfStudy: "",
      faculty: "",
      major: "",
      hobby: "",
      cca: "",
      birthday: "",
    });

    setProfile({ displayName, photoURL });
    setProfileData({
      nickname: "",
      yearOfStudy: "",
      faculty: "",
      major: "",
      hobby: "",
      cca: "",
      birthday: "",
      profileCompleted: false,
    });

    return userCredential;
  };

  const login = (email: string, password: string): Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = (): Promise<void> => {
    setCurrentUser(null);
    setProfile({ displayName: "", photoURL: "" });
    setProfileData(null);
    return signOut(auth);
  };

  const loginWithGoogle = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(firestore, "users", user.uid), {
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
      });

      const profileDoc = await getDoc(doc(firestore, "profiles", user.uid));
      if (!profileDoc.exists()) {
        await setDoc(doc(firestore, "profiles", user.uid), {
          userId: user.uid,
          profileCompleted: false,
          nickname: "",
          yearOfStudy: "",
          faculty: "",
          major: "",
          hobby: "",
          cca: "",
          birthday: "",
        });
        router.push("/profile/particulars");
      } else {
        const data = profileDoc.data() as ProfileData;
        setProfileData(data);
        if (data && data.profileCompleted) {
          router.push("/home");
        } else {
          router.push("/profile/particulars");
        }
      }

      setCurrentUser(user);
      setProfile({ displayName: user.displayName || "", photoURL: user.photoURL || "" });
    } catch (error) {
      console.error("Failed to log in with Google", error);
    }
  };

  const updateProfileData = async (data: ProfileData) => {
    if (currentUser) {
      console.log("Updating profile data in Firestore:", data);
      await updateDoc(doc(firestore, "profiles", currentUser.uid), data);
      setProfileData(data);
    }
  };

  const value: AuthContextType = {
    currentUser,
    profile,
    profileData,
    signup,
    login,
    logout,
    loginWithGoogle,
    updateProfileData,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
