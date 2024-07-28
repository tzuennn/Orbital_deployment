import React, { useEffect, useState } from "react";
import HomeStudyChart from "@/components/Home/Section/misc/HomeStudyChart";
import { firestore, auth } from "../../../../firebase/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface StudyData {
  name: string;
  study_minutes: number;
}

const VSSstudySection: React.FC = () => {
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [weeklyStudyData, setWeeklyStudyData] = useState<StudyData[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;

    async function fetchStudyData() {
      try {
        const rewardsRef = collection(firestore, "rewards");
        const q = query(
          rewardsRef,
          where("userId", "==", userId),
          orderBy("date", "desc"),
          limit(7)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("No matching documents.");
          return;
        }

        const studyData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const date = new Date(data.date.seconds * 1000); // Assuming Firestore timestamp
          const day = date.getDate().toString().padStart(2, "0");
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          return {
            name: `${day}-${month}`,
            study_minutes: Math.round(data.dailyTime || 0),
          };
        }).reverse();

        setWeeklyStudyData(studyData);

        const totalStudyTime = studyData.reduce(
          (total, entry) => total + entry.study_minutes,
          0
        );
        setTotalStudyTime(totalStudyTime);
      } catch (error) {
        console.error("Error fetching study data: ", error);
      }
    }

    fetchStudyData();
  }, [userId]);

  return (
    <div className="w-full mr-10 p-5 rounded-xl border-2 ">
      <div className="flex justify-center text-xl mb-2 pb-2 border-b-2 border-teal-500">
        Weekly Study Summary
      </div>
      <div className="flex justify-center mb-5 mt-3">
        For this whole week you have studied for more than {totalStudyTime} minutes
      </div>
      <HomeStudyChart/>
    </div>
  );
};

export default VSSstudySection;
