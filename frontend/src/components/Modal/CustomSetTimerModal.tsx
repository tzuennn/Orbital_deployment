"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { setShowAdditionalSetting } from "@/store/timerSlice";
import AdditionalSettingsModal from "./AdditionalSetting";
import { BackgroundImageType } from "@/store/timerSlice";

type UserSetStudyTimerProps = {
  submitHandler: (
    e: React.FormEvent<HTMLFormElement>,
    minutes: number,
    seconds: number
  ) => void;
  closeHandler: () => void;
  backgroundImages: string[];
};

export default function UserSetStudyTimer({
  submitHandler,
  closeHandler,
  backgroundImages,
}: UserSetStudyTimerProps) {
  const dispatch: AppDispatch = useDispatch();
  const { showAdditionalSetting } = useSelector(
    (state: RootState) => state.timer
  );

  const [minutes, setMinutes] = useState<string>("0");
  const [seconds, setSeconds] = useState<string>("0");
  const [error, setError] = useState<string | null>(null);

  const handleMoreSettings = () => {
    dispatch(setShowAdditionalSetting(true));
  };

  const handleCloseSettings = () => {
    dispatch(setShowAdditionalSetting(false));
  };

  const handleSettingsSubmit = (settings: {
    backgroundImage: BackgroundImageType;
  }) => {
    handleCloseSettings();
    localStorage.setItem("backgroundImage", settings.backgroundImage);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinutes(e.target.value);
    if (error) setError(null); // Clear error when user changes input
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeconds(e.target.value);
    if (error) setError(null); // Clear error when user changes input
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const charCode = e.charCode;
    if (charCode < 48 || charCode > 57) {
      e.preventDefault();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const minutesValue = Number(minutes);
    const secondsValue = Number(seconds);
    if (minutesValue > 100) {
      setError("Minutes cannot exceed 100");
      return;
    }
    if (secondsValue > 59) {
      setError("Seconds cannot exceed 59");
      return;
    }
    submitHandler(e, minutesValue, secondsValue);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-h-screen overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <label className="text-lg font-medium">Study Timer:</label>
          <div className="flex space-x-2">
            <div className="flex flex-col items-center">
              <label htmlFor="minutes" className="text-sm">
                Minutes
              </label>
              <input
                type="text"
                id="minutes"
                name="minutes"
                value={minutes}
                onChange={handleMinutesChange}
                pattern="[0-9]*"
                inputMode="numeric"
                placeholder="0 minutes"
                onKeyPress={handleKeyPress}
                className="p-2 border rounded w-20"
              />
            </div>
            <div className="flex flex-col items-center">
              <label htmlFor="seconds" className="text-sm">
                Seconds
              </label>
              <input
                type="text"
                id="seconds"
                name="seconds"
                value={seconds}
                onChange={handleSecondsChange}
                pattern="[0-9]*"
                inputMode="numeric"
                placeholder="0 seconds"
                onKeyPress={handleKeyPress}
                className="p-2 border rounded w-20"
              />
            </div>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="px-1 ">
            <h1
              className="hover:cursor-pointer hover:text-blue-500"
              onClick={handleMoreSettings}
            >
              More settings
            </h1>
          </div>
          <div className="flex space-x-8">
            <button
              type="submit"
              className="p-2 bg-green-500 text-white rounded hover:scale-105"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={closeHandler}
              className="p-2 bg-red-500 text-white rounded hover:scale-105"
            >
              Close
            </button>
          </div>
        </form>
        {showAdditionalSetting && (
          <AdditionalSettingsModal
            onClose={handleCloseSettings}
            onSettingsSubmit={handleSettingsSubmit}
            backgroundImages={backgroundImages}
          />
        )}
      </div>
    </div>
  );
}
