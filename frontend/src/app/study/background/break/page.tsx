import Image from "next/image";
import breakGif from "../../../../../public/images/taking_break.gif";

export default function BreakPage() {
  return (
    <div className="flex justify-center items-center">
      <Image src={breakGif} alt="Break" />
    </div>
  );
}
