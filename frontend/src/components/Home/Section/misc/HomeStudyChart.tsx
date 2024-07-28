import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { firestore, auth } from '../../../../../firebase/firebase';
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface StudyData {
  name: string;
  study_minutes: number;
}

export default function Home() {
  const [weeklyStudyData, setWeeklyStudyData] = useState<StudyData[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
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
        
        const studyData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const date = new Date(data.date);
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          return {
            name: `${day}-${month}`,
            study_minutes: Math.round(data.dailyTime / 60 || 0),
          };
        }).reverse();

        setWeeklyStudyData(studyData);
      } catch (error) {
        console.error("Error fetching study data: ", error);
      }
    }

    fetchStudyData();
  }, [userId]);

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer>
        <LineChart
          data={weeklyStudyData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            label={{
              value: "Minutes",
              angle: 0,
              position: "top",
              offset: 10,
              style: { fontSize: 14 },
            }}
          />
          <Line
            type="monotone"
            dataKey="study_minutes"
            stroke="#8884d8"
            dot={{ fill: "#ff7300", r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
