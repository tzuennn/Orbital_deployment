import { useRouter } from "next/navigation";
export default function StudyLandingPage({
  userSetTime,
}: {
  userSetTime: () => void;
}) {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center mb-8 mt-20">
        <h1 className="text-5xl font-bold mb-10 mt-20">
          Deep study starts here
        </h1>
        <p className="text-3xl mb-10">Are you ready to focus?</p>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full mb-5"
        onClick={userSetTime}
      >
        Start to Study
      </button>
      <button
        className="text-blue-500 hover:text-blue-700"
        onClick={() => router.push("/home")}
      >
        Go back
      </button>
    </div>
  );
}
