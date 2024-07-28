import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type BackgroundImageType =
  | "autumn"
  | "grass"
  | "sea"
  | "mountain"
  | "moon"
  | "";

export interface TimerState {
  isFullscreen: boolean;
  isUserTime: boolean;
  pomodoroCycleLeft: number;
  pomodoroCycleCompleted: number;
  countdownSeconds: number;
  studyTime: number;
  backgroundSettings: {
    backgroundImage: BackgroundImageType;
  };
  showAdditionalSetting: boolean;
  todayXP: number; // New property for today's XP
  totalXP: number; // New property for total XP
  hasAwardedDailyTimeXP: boolean; // New property
  hasAwardedCycleXP: boolean; // New property
}

const initialTimerState: TimerState = {
  isFullscreen: false,
  isUserTime: false,
  pomodoroCycleLeft: 0,
  pomodoroCycleCompleted: 0,
  countdownSeconds: 0,
  backgroundSettings: {
    backgroundImage: "",
  },
  showAdditionalSetting: false,
  studyTime: 0,
  todayXP: 0, // Initialize to 0
  totalXP: 0, // Initialize to 0
  hasAwardedDailyTimeXP: false, // Initialize to false
  hasAwardedCycleXP: false, // Initialize to false
};

export const timerSlice = createSlice({
  name: "timer",
  initialState: initialTimerState,
  reducers: {
    setIsFullscreen(state, action: PayloadAction<boolean>) {
      state.isFullscreen = action.payload;
    },
    setIsUserTime(state, action: PayloadAction<boolean>) {
      state.isUserTime = action.payload;
    },
    setpomodoroCycleLeft(state, action: PayloadAction<number>) {
      state.pomodoroCycleLeft = action.payload;
    },
    setpomodoroCycleCompleted(state, action: PayloadAction<number>) {
      state.pomodoroCycleCompleted = action.payload;
    },
    setCountdownSeconds(state, action: PayloadAction<number>) {
      state.countdownSeconds = action.payload;
    },
    setStudyTime(state, action: PayloadAction<number>) {
      state.studyTime = action.payload;
    },
    setBackgroundImage(state, action: PayloadAction<BackgroundImageType>) {
      state.backgroundSettings.backgroundImage = action.payload;
    },
    setShowAdditionalSetting(state, action: PayloadAction<boolean>) {
      state.showAdditionalSetting = action.payload;
    },
    setTodayXP(state, action: PayloadAction<number>) { // New reducer
      state.todayXP = action.payload;
    },
    setTotalXP(state, action: PayloadAction<number>) { // New reducer
      state.totalXP = action.payload;
    },
    setHasAwardedDailyTimeXP(state, action: PayloadAction<boolean>) { // New reducer
      state.hasAwardedDailyTimeXP = action.payload;
    },
    setHasAwardedCycleXP(state, action: PayloadAction<boolean>) { // New reducer
      state.hasAwardedCycleXP = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setIsFullscreen,
  setIsUserTime,
  setpomodoroCycleLeft,
  setpomodoroCycleCompleted,
  setCountdownSeconds,
  setBackgroundImage,
  setShowAdditionalSetting,
  setStudyTime,
  setTodayXP, // Export new action
  setTotalXP, // Export new action
  setHasAwardedDailyTimeXP, // Export new action
  setHasAwardedCycleXP, // Export new action
} = timerSlice.actions;

export default timerSlice.reducer;
