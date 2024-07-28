import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  userId: string; // Added userId
  nickname: string;
  yearOfStudy: string;
  faculty: string;
  major: string;
  hobby: string;
  cca: string;
  birthday: Date | null;
  todayXP: number;
  totalXP: number;
}

const initialUserState: UserState = {
  userId: "", // Initialize with an empty string or any default value
  nickname: "",
  yearOfStudy: "",
  faculty: "",
  major: "",
  hobby: "",
  cca: "",
  birthday: null,
  todayXP: 0,
  totalXP: 0,
};

export const userProfileSlice = createSlice({
  name: "userProfile",
  initialState: initialUserState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    setNickname: (state, action: PayloadAction<string>) => {
      state.nickname = action.payload;
    },
    setYearOfStudy: (state, action: PayloadAction<string>) => {
      state.yearOfStudy = action.payload;
    },
    setFaculty: (state, action: PayloadAction<string>) => {
      state.faculty = action.payload;
    },
    setMajor: (state, action: PayloadAction<string>) => {
      state.major = action.payload;
    },
    setHobby: (state, action: PayloadAction<string>) => {
      state.hobby = action.payload;
    },
    setCca: (state, action: PayloadAction<string>) => {
      state.cca = action.payload;
    },
    setBirthday: (state, action: PayloadAction<Date>) => {
      state.birthday = action.payload;
    },
    setTodayXP: (state, action: PayloadAction<number>) => {
      state.todayXP = action.payload;
    },
    setTotalXP: (state, action: PayloadAction<number>) => {
      state.totalXP = action.payload;
    },
  },
});

export const {
  setUserId,
  setNickname,
  setYearOfStudy,
  setFaculty,
  setMajor,
  setHobby,
  setCca,
  setBirthday,
  setTodayXP,
  setTotalXP,
} = userProfileSlice.actions;

export default userProfileSlice.reducer;
