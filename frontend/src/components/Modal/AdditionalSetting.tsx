// AdditionalSettingsModal.tsx
import React, { useEffect } from "react";
import { BackgroundImageType } from "@/store/timerSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { setBackgroundImage } from "../../store/timerSlice";

type AdditionalSettingsModalProps = {
  onClose: () => void;
  backgroundImages: string[];
  onSettingsSubmit: (settings: {
    backgroundImage: BackgroundImageType;
  }) => void;
};

export default function AdditionalSettingsModal({
  onClose,
  backgroundImages,
  onSettingsSubmit,
}: AdditionalSettingsModalProps) {
  const dispatch: AppDispatch = useDispatch();
  const { backgroundImage } = useSelector(
    (state: RootState) => state.timer.backgroundSettings
  );

  useEffect(() => {
    // Check if there is a previously selected background image in localStorage
    // ❗localstorage change to backend storage
    let savedBackgroundImage = localStorage.getItem("backgroundImage");
    if (savedBackgroundImage && isBackgroundImageType(savedBackgroundImage)) {
      dispatch(setBackgroundImage(savedBackgroundImage));
    }
  }, []);

  function isBackgroundImageType(value: string): value is BackgroundImageType {
    return ["autumn", "grass", "sea", "mountain", "moon", ""].includes(value);
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSettingsSubmit({ backgroundImage });
    onClose();
  };

  const extractFileName = (url: string) => {
    if (url.length === 0) return "None";
    const urlParts = url.split("/");
    return urlParts[urlParts.length - 1].split(".")[0];
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <form onSubmit={handleFormSubmit} className="flex flex-col space-y-4">
          <label className="text-lg font-medium">Additional Settings:</label>
          <div className="flex flex-col space-y-2">
            <div className="flex flex-col items-start">
              <label htmlFor="backgroundImage" className="text-sm">
                Background Image
              </label>
              <select
                id="backgroundImage"
                name="backgroundImage"
                className="p-2 border rounded w-full"
                value={localStorage.getItem("backgroundImage") || ""}
                onChange={(e) => {
                  if (isBackgroundImageType(e.target.value)) {
                    dispatch(setBackgroundImage(e.target.value));
                    localStorage.setItem("backgroundImage", e.target.value); // Save selected image to localStorage
                  }
                }}
              >
                {backgroundImages.map((image, index) => (
                  <option key={index} value={image}>
                    {extractFileName(image)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="p-2 bg-green-500 text-white rounded hover:scale-105"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-red-500 text-white rounded hover:scale-105"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
