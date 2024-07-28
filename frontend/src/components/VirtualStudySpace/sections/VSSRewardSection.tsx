import React, { useEffect, useState } from "react";
import { firestore, auth } from '../../../../firebase/firebase';
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const VSSRewardSection: React.FC = () => {
  const [totalXp, setTotalXp] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    console.log("Setting up auth state change listener");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is logged in:", user.uid);
        setUserId(user.uid);
      } else {
        console.log("User is logged out");
        setUserId(null);
      }
    });

    return () => {
      console.log("Cleaning up auth state change listener");
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!userId) {
      console.log("No user ID, skipping fetch");
      return;
    }

    async function fetchXpData() {
      try {
        console.log("Fetching XP data for user:", userId);
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

        let totalXp = 0;

        querySnapshot.docs.forEach(doc => {
          const data = doc.data();
          console.log("Document data:", data);
          if (data.dailyXP) {
            totalXp += data.dailyXP;
          } else {
            console.log("No dailyXP field found in document:", doc.id);
          }
        });

        console.log("Total XP calculated:", totalXp);
        setTotalXp(totalXp);
      } catch (error) {
        console.error("Error fetching XP data:", error);
      }
    }

    fetchXpData();
  }, [userId]);

  return (
    <div className="w-full p-5 border-2 rounded-xl">
      <div className="flex justify-center text-xl mb-2 pb-2 border-b-2 border-teal-500">
        Weekly XP Summary
      </div>
      <div className="flex justify-center my-5 text-center">
        For this whole week you have earned {totalXp} XP
      </div>
    </div>
  );
};

export default VSSRewardSection;
