"use client";
import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const SummaryTime = (num: number) => {
  if (num < 60) {
    return `${num} seconds`;
  } else {
    const minutes = Math.floor(num / 60);
    const seconds = num % 60;
    return `${minutes} minutes ${seconds} seconds`;
  }
};

export default function SummaryPage() {
  const { studyTime, pomodoroCycleCompleted, pomodoroCycleLeft } = useSelector(
    (state: RootState) => state.timer
  );
  const summaryRendering = () => {
    if (pomodoroCycleLeft > 0) {
      return `Congratulations! You have studied for ${pomodoroCycleCompleted} cycles`;
    } else {
      return `Congratulations! You have studied for ${SummaryTime(studyTime)}`;
    }
  };

  return (
    <div
      className="flex flex-col justify-center items-center"
      style={{ minHeight: "calc(100vh - 100px)" }}
    >
      <div className="text-4xl font-bold text-center">{summaryRendering()}</div>
      <Link
        href="/study"
        className="absolute bottom-5 right-10 text-blue-500 hover:text-blue-700 text-lg"
      >
        Go back
      </Link>
    </div>
  );
}
