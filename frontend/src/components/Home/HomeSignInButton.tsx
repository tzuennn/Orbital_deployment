"use client";
import React, { useEffect, useState, useRef } from "react";
import { MdCheckCircleOutline } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { setTodayXP, setTotalXP } from "@/store/userProfileSlice";
import { firestore } from "../../../firebase/firebase";
import { collection, addDoc, getDocs, query, where, updateDoc, doc, getDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "../Auth/AuthContext";

export default function HomeSignInButton() {
  const { currentUser } = useAuth();
  const userProfile = useSelector((state: RootState) => state.userInfo);
  const { totalXP, todayXP } = userProfile;
  const dispatch: AppDispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(false);
  const [docRefId, setDocRefId] = useState<string | null>(null);
  const initialLoad = useRef(true); 

  const getTodayDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Singapore'
    };
    const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(today).split('/').reverse().join('-');
    return formattedDate;
  };

  const today = getTodayDate();
  console.log('Formatted Today\'s Date:', today);

  const checkLastSignIn = async () => {
    if (!currentUser) {
      console.error("User is not authenticated.");
      return;
    }

    try {
      const q = query(
        collection(firestore, "rewards"),
        where("userId", "==", currentUser.uid),
        where("date", "==", today)
      );
      const querySnapshot = await getDocs(q);
      console.log('Query snapshot size:', querySnapshot.size);

      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();
        setDocRefId(querySnapshot.docs[0].id);
        setIsDisabled(docData.clickedSignIn);
        console.log('Existing document for today found:', docData);
        dispatch(setTodayXP(docData.dailyXP));
        dispatch(setTotalXP(docData.totalXP));
      } else {
        console.log('No document found for today.');
        const docRef = await addDoc(collection(firestore, "rewards"), {
          userId: currentUser.uid,
          dailyXP: 0,
          totalXP: totalXP,
          dailyTime: 0,
          dailyCycle:0,
          date: today,
          clickedSignIn: false,
          hasAnsweredQuestion: false,
          timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' })
        });
        setDocRefId(docRef.id);
        setIsDisabled(false);
        dispatch(setTodayXP(0));
        dispatch(setTotalXP(totalXP));
        console.log('New document created:', docRef.id);
      }
    } catch (error) {
      console.error("Error checking last sign-in date from Firestore:", error);
    }
  };

  useEffect(() => {
    if (initialLoad.current) {
      checkLastSignIn();
      initialLoad.current = false;
    }
  }, [currentUser, totalXP, today, dispatch]);

  useEffect(() => {
    const resetSignInStatus = () => {
      const lastSignInDate = localStorage.getItem("lastSignInDate");

      if (lastSignInDate !== today) {
        setIsDisabled(false);
        setDocRefId(null);
        localStorage.setItem("lastSignInDate", today);
      }
    };

    resetSignInStatus();
    const intervalId = setInterval(resetSignInStatus, 1000 * 60 * 60); // Check every hour

    return () => clearInterval(intervalId);
  }, [today]);

  const handleSignIn = async () => {
    if (!currentUser) {
      console.error("User is not authenticated.");
      return;
    }

    if (isDisabled) {
      return;
    }

    setIsDisabled(true);

    try {
      if (docRefId) {
        const docRef = doc(firestore, "rewards", docRefId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          await updateDoc(docRef, {
            dailyXP: data.dailyXP + 10,
            totalXP: data.totalXP + 10,
            clickedSignIn: true,
            timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' })
          });

          dispatch(setTodayXP(data.dailyXP + 10));
          dispatch(setTotalXP(data.totalXP + 10));
          console.log('Document updated successfully:', data);
        } else {
          console.error("Document does not exist.");
        }
      } else {
        console.error("Document reference ID is null.");
      }
    } catch (error) {
      console.error("Error updating XP document:", error);
    }
  };

  return (
    <div
      className={`flex items-center cursor-pointer border-2 p-2 pt-1 border-slate-400 rounded-lg hover:scale-105 ${
        isDisabled ? "cursor-not-allowed opacity-50 hover:scale-100" : ""
      }`}
      onClick={!isDisabled ? handleSignIn : undefined}
    >
      <div className="mr-2 font-bold">sign in</div>
      <MdCheckCircleOutline className="mt-1" />
    </div>
  );
}
