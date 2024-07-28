import HomeStudyChart from "./misc/HomeStudyChart";
import HomeButton from "../HomeButton";

export default function HomeStudySection({ style }: { style: string }) {
  return (
    <div className={style}>
      <div className="mb-3 ml-2 font-bold text-xl border-b-2 border-white pb-1">
        Study
      </div>
      <div style={{ height: "270px" }}>
        <HomeStudyChart></HomeStudyChart> 
      </div>
      <HomeButton web={"/study"} buttonText={"Continue to study"} />
    </div>
  );
}
