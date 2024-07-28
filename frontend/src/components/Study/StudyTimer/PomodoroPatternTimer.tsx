import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setpomodoroCycleLeft, setTodayXP, setTotalXP, setHasAwardedCycleXP } from "@/store/timerSlice"; // Import XP actions
import { useTimer } from "react-timer-hook";
import { FaPause, FaPlay } from "react-icons/fa6";
import { collection, getDocs, query, updateDoc, where, Timestamp, addDoc } from "firebase/firestore";
import { firestore } from "../../../../firebase/firebase";
import { useAuth } from "../../Auth/AuthContext";

type PomodoroPatternTimerProps = {
  onTimeUp: () => void;
  isStudyCycle: boolean;
  setStudyCycle: React.Dispatch<React.SetStateAction<boolean>>;
  onCycleComplete: () => void;
};

export default function PomodoroPatternTimer({
  onTimeUp,
  isStudyCycle,
  setStudyCycle,
  onCycleComplete,
}: PomodoroPatternTimerProps) {
  const router = useRouter();
  const [isPaused, setIsPaused] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const { pomodoroCycleLeft, hasAwardedCycleXP } = useSelector((state: RootState) => state.timer);
  const { currentUser } = useAuth();

  const studyTimer = new Date();
  studyTimer.setSeconds(studyTimer.getSeconds() + 1500);

  const { seconds, minutes, pause, resume, restart } = useTimer({
    expiryTimestamp: studyTimer,
    onExpire: async () => {
      const today = getTodayDate();
      if (isStudyCycle) {
        try {
          const q = query(collection(firestore, "rewards"), where("userId", "==", currentUser?.uid), where("date", "==", today));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            const data = querySnapshot.docs[0].data();
            const currentDailyCycle = data.dailyCycle || 0;
            const totalDailyCycle = currentDailyCycle + 1;

            const updates: any = {
              dailyCycle: totalDailyCycle,
              timestamp: Timestamp.now(),
            };

            if (totalDailyCycle >= 2 && !hasAwardedCycleXP) {
              updates.dailyXP = (data.dailyXP || 0) + 10;
              updates.totalXP = (data.totalXP || 0) + 10;
              dispatch(setTodayXP((data.dailyXP || 0) + 10));
              dispatch(setTotalXP((data.totalXP || 0) + 10));
              dispatch(setHasAwardedCycleXP(true)); // Set state to true
            }

            await updateDoc(docRef, updates);
          } else {
            // Create a new document for today
            await addDoc(collection(firestore, "rewards"), {
              userId: currentUser?.uid,
              dailyXP: 0,
              totalXP: 0,
              dailyTime: 0,
              date: today,
              dailyCycle: 1,
              hasAwardedDailyTimeXP: false,
              hasAwardedCycleXP: false,
              timestamp: Timestamp.now(),
            });
          }
        } catch (error) {
          console.error("Error updating daily cycle in Firestore: ", error);
        }

        const restTimer = new Date();
        restTimer.setSeconds(restTimer.getSeconds() + 300);
        setStudyCycle(false);
        restart(restTimer);
        resume();
        router.push("/study/background/break");
      } else {
        onCycleComplete();
        if (pomodoroCycleLeft == 1) {
          onTimeUp();
          router.push("/study/summary");
        } else {
          dispatch(setpomodoroCycleLeft(pomodoroCycleLeft - 1));
          setStudyCycle(true);
          const studyTimer = new Date();
          studyTimer.setSeconds(studyTimer.getSeconds() + 1500);
          restart(studyTimer);
          resume();
          router.push("/study/background");
        }
      }
    },
  });

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

  const handlePause = () => {
    pause();
    setIsPaused(true);
  };

  const handleResume = () => {
    resume();
    setIsPaused(false);
  };

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes > 9 ? minutes : `0${minutes}`}:${
      seconds < 10 ? `0${seconds}` : seconds
    }`;
  };

  const isTimeLow = minutes === 0 && seconds < 10;

  return (
    <div className="flex flex-col items-center justify-center bg-gray-800 text-white rounded-lg shadow-md px-3 py-1 max-w-xs mx-auto">
      <h1 className="text-sm font-bold mb-2 tracking-wider">Time Left</h1>
      <div className="flex items-center">
        <span className="text-lg font-mono mr-2">
          {isStudyCycle ? "Study Time:" : "Break Time:"}
        </span>
        <div
          className={`flex items-center bg-gray-900 py-2 px-4 rounded-lg shadow-inner ${
            isTimeLow ? "text-red-500" : ""
          } ${isTimeLow && !isPaused ? "animate-blink" : ""}`}
        >
          <span className="text-lg font-mono">
            {formatTime(minutes, seconds)}
          </span>
        </div>
      </div>
      <div className="flex flex-row justify-between w-3/4 mt-1">
        <FaPause onClick={handlePause} className="cursor-pointer" />
        <FaPlay onClick={handleResume} className="cursor-pointer" />
      </div>
    </div>
  );
}
