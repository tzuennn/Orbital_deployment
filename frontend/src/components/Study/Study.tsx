import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/store/store";
import {
  setIsFullscreen,
  setIsUserTime,
  setCountdownSeconds,
  setpomodoroCycleLeft,
} from "@/store/timerSlice";
import CustomSetTimerModal from "../Modal/CustomSetTimerModal";
import ProtectedRoute from "../ProtectedRoute";
import TimeZeroAlert from "../Modal/TimeZeroAlert";
import StudyLandingPage from "./StudyLandingPage";
import StudyPatternModal from "../Modal/StudyPatternModal";
import PomodoroModal from "../Modal/PomodoroModal";
export default function Study() {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [isCustomPattern, setCustomPattern] = useState(false);
  const [hasSelectedPattern, setSelectedPattern] = useState(false);
  const backgroundImages = ["", "autumn", "grass", "sea", "mountain", "moon"];

  const dispatch: AppDispatch = useDispatch();
  const { isFullscreen, isUserTime } = useSelector(
    (state: RootState) => state.timer
  );

  useEffect(() => {
    dispatch(setpomodoroCycleLeft(0));
  }, []);
  const handleFullscreenToggle = () => {
    dispatch(setIsFullscreen(!isFullscreen));
  };

  const handleUserTimeToggle = () => {
    dispatch(setIsUserTime(!isUserTime));
  };

  const handleCountdownChange = (seconds: number) => {
    dispatch(setCountdownSeconds(seconds));
  };

  const handlePomodoroChange = (cycles: number) => {
    dispatch(setpomodoroCycleLeft(cycles));
  };

  useEffect(() => {
    if (isFullscreen) {
      handleFullscreenToggle();
    }
    if (isUserTime) {
      handleUserTimeToggle();
    }
    handleCountdownChange(0);
  }, []);

  const userSetTime = () => {
    if (!isUserTime) {
      handleUserTimeToggle();
    }
  };

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const minutes = Number(
      (form.elements.namedItem("minutes") as HTMLInputElement).value
    );
    const seconds = Number(
      (form.elements.namedItem("seconds") as HTMLInputElement).value
    );

    if (minutes === 0 && seconds === 0) {
      setShowAlert(true); // Show alert if both minutes and seconds are zero
      return;
    }

    const totalSeconds = minutes * 60 + seconds;
    handleCountdownChange(totalSeconds);
    if (isUserTime) {
      handleUserTimeToggle();
    }
    enterFullscreen();
  };

  const handleConfirmPattern = () => {
    setSelectedPattern(true);
  };

  const handleStudyPattern = (e: string) => {
    if (e !== "custom") {
      setCustomPattern(true);
    } else {
      setCustomPattern(false);
    }
  };

  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen();
    }
    handleFullscreenToggle();
    router.push("/study/background");
  };
  const handleCloseForm = () => {
    if (isUserTime) {
      handleUserTimeToggle();
    }
    setSelectedPattern(false);
    setCustomPattern(false);
  };

  const handlePomodoroConfirm = (num: number) => {
    handlePomodoroChange(num);
    if (isUserTime) {
      handleUserTimeToggle();
    }
    setSelectedPattern(false);
    setCustomPattern(false);
    enterFullscreen();
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center">
        {isUserTime ? (
          <StudyPatternModal
            onConfirm={handleConfirmPattern}
            onClose={handleCloseForm}
            setStudyPattern={handleStudyPattern}
          />
        ) : (
          <StudyLandingPage userSetTime={userSetTime} />
        )}
        {hasSelectedPattern && !isCustomPattern && (
          <CustomSetTimerModal
            submitHandler={handleSubmitForm}
            closeHandler={handleCloseForm}
            backgroundImages={backgroundImages}
          />
        )}
        {hasSelectedPattern && isCustomPattern && (
          <PomodoroModal
            onConfirm={handlePomodoroConfirm}
            onClose={handleCloseForm}
            backgroundImages={backgroundImages}
          />
        )}
        {showAlert && (
          <TimeZeroAlert
            message="Time can't be set as 0. Please enter a valid time."
            onClose={() => setShowAlert(false)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
