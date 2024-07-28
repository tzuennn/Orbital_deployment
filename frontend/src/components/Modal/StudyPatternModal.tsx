import React, { useState } from "react";
export default function StudyPatternModal({
  onConfirm,
  onClose,
  setStudyPattern,
}: {
  onConfirm: () => void;
  onClose: () => void;
  setStudyPattern: (studyPattern: string) => void;
}) {
  const [selectedPattern, setSelectedPattern] = useState("custom");

  const handlePatternChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPattern(e.target.value);
    setStudyPattern(e.target.value);
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-h-screen overflow-y-auto">
        <label htmlFor="study-pattern" className="text-lg">
          Study pattern
        </label>
        <select
          id="study-pattern"
          name="study-pattern"
          className="p-2 border rounded w-full"
          value={selectedPattern}
          onChange={handlePatternChange}
        >
          <option value="custom">Custom</option>
          <option value="pomodoro">Pomodoro</option>
        </select>
        <div className="flex justify-between mt-5">
          <button
            onClick={onConfirm}
            className="p-2 bg-green-500 text-white rounded hover:scale-105"
          >
            Confirm
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-red-500 text-white rounded hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
