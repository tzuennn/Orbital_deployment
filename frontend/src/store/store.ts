import { configureStore } from "@reduxjs/toolkit";
import timerReducer from "./timerSlice";
import todoReducer from "./todoSlice";
import userProfileReducer from "./userProfileSlice";

export const store = configureStore({
  reducer: {
    timer: timerReducer,
    todo: todoReducer,
    userInfo: userProfileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
