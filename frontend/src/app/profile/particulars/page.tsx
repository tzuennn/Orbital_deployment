// pages/index.tsx or another parent component
import React from "react";
import ParticularForm from "../../../components/Profile/ProfileForm";

const ParentComponent: React.FC = (): JSX.Element => {
  return (
    <div>
      <h1 className="flex justify-center w-full text-2xl font-bold mb-4">
        User Particulars
      </h1>
      <ParticularForm />
    </div>
  );
};

export default ParentComponent;
