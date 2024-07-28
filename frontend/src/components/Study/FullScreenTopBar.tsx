import React, { useState } from "react";
import Link from "next/link";
import CountdownTimer from "./StudyTimer/CustomTimer";
import PomodoroPatternTimer from "./StudyTimer/PomodoroPatternTimer";
import { Tabs, TabList, Tab, TabIndicator, Box } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  setIsFullscreen,
  setIsUserTime,
  setStudyTime,
  setpomodoroCycleCompleted,
} from "@/store/timerSlice";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
  doc,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import { useAuth } from "../Auth/AuthContext";

export const FullScreenTopBar = () => {
  const [isStudyCycle, setStudyCycle] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const {
    isFullscreen,
    countdownSeconds,
    isUserTime,
    pomodoroCycleLeft,
    pomodoroCycleCompleted,
  } = useSelector((state: RootState) => state.timer);
  const { currentUser } = useAuth();

  const handleFullscreenToggle = () => {
    dispatch(setIsFullscreen(!isFullscreen));
  };

  const handleUserTimeToggle = () => {
    dispatch(setIsUserTime(!isUserTime));
  };

  const exitFullscreen = () => {
    handleFullscreenToggle();
    if (isUserTime) {
      handleUserTimeToggle();
    }
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const handleToggleCycle = () => {
    setStudyCycle(!isStudyCycle);
  };

  const handleEndStudy = async () => {
    dispatch(setStudyTime(elapsedTime));
    if (currentUser) {
      const today = new Date().toISOString().split("T")[0];
      try {
        const q = query(
          collection(firestore, "rewards"),
          where("userId", "==", currentUser.uid),
          where("date", "==", today)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;
          const currentDailyTime = querySnapshot.docs[0].data().dailyTime || 0;
          await updateDoc(docRef, {
            dailyTime: currentDailyTime + elapsedTime,
            timestamp: Timestamp.now(),
          });
        }
      } catch (error) {
        console.error("Error updating daily time in Firestore: ", error);
      }
    }
    exitFullscreen();
  };

  const handleTotalSecondsUpdate = (totalSeconds: number) => {
    setElapsedTime(countdownSeconds - totalSeconds);
  };

  const handleCycleComplete = () => {
    dispatch(setpomodoroCycleCompleted(pomodoroCycleCompleted + 1));
  };

  return (
    <nav className="bg-gray-400 p-7 relative w-screen rounded-sm">
      <div className="container mx-auto flex justify-center items-center h-16">
        <div className="absolute left-0 top-0 mt-4 ml-4">
          {pomodoroCycleLeft == 0 ? (
            <CountdownTimer
              onTimeUp={exitFullscreen}
              initialTime={countdownSeconds}
              onTotalSecondsUpdate={handleTotalSecondsUpdate}
            />
          ) : (
            <div className="flex flex-row items-center">
              <PomodoroPatternTimer
                onTimeUp={exitFullscreen}
                isStudyCycle={isStudyCycle}
                setStudyCycle={handleToggleCycle}
                onCycleComplete={handleCycleComplete}
              />
              {pomodoroCycleLeft > 0 && (
                <span className="ml-4 font-secondary text-white">
                  No. of cycles left : {pomodoroCycleLeft - 1}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="absolute right-5 top-8 mt-4 mr-4">
          <Link
            href={"/study/summary"}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full"
            onClick={handleEndStudy}
          >
            End Study
          </Link>
        </div>
        {pomodoroCycleLeft !== 0 && !isStudyCycle ? (
          <div className="text-6xl font-secondary font-bold animate-bounce">
            Break Time
          </div>
        ) : (
          <Box width="100%" display="flex" justifyContent="center">
            <Tabs position="relative" variant="unstyled">
              <TabList>
                <Link href="/study/background">
                  <Tab>None</Tab>
                </Link>
                <Link href="/todos">
                  <Tab>Todo</Tab>
                </Link>
                <Link href="/chatrooms">
                  <Tab>Community</Tab>
                </Link>
              </TabList>
              <TabIndicator
                mt="-1.5px"
                height="2px"
                bg="blue.500"
                borderRadius="1px"
              />
            </Tabs>
          </Box>
        )}
      </div>
    </nav>
  );
};
