"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../Auth/AuthContext";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { Progress, Box, Flex, Text, Tooltip } from "@chakra-ui/react";
import { FaInfoCircle } from "react-icons/fa";
import { setUserId, setTodayXP, setTotalXP } from "@/store/userProfileSlice";
import { firestore } from "../../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth() || {};
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { todayXP, totalXP } = useSelector(
    (state: RootState) => state.userInfo
  );

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        dispatch(setUserId(currentUser.uid));
        console.log("Fetching data for user:", currentUser.uid);

        try {
          const today = new Date().toISOString().split("T")[0];
          console.log("Today's date:", today);
          const q = query(
            collection(firestore, "rewards"),
            where("userId", "==", currentUser.uid),
            where("date", "==", today)
          );
          const querySnapshot = await getDocs(q);
          console.log("Query snapshot size:", querySnapshot.size);

          let userTotalXP = 0;
          let userTodayXP = 0;

          querySnapshot.forEach((doc) => {
            console.log("Document found:", doc.id);
            const data = doc.data();
            console.log("Document data:", data);
            userTotalXP = data.totalXP;
            userTodayXP = data.dailyXP;
          });

          // console.log("User total XP:", userTotalXP);
          // console.log("User today XP:", userTodayXP);

          dispatch(setTodayXP(userTodayXP));
          dispatch(setTotalXP(userTotalXP));
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
        }
      } else {
        console.log("No current user");
      }
    };

    fetchUserData();
  }, [currentUser, dispatch]);

  const handleLogout = async () => {
    try {
      if (logout) {
        await logout();
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const dailyXPTarget = 40;

  const xpTooltipContent = (
    <Box>
      <Text>Ways to earn XP:</Text>
      <Text>
        • Sign in <span style={{ color: "green" }}>+10XP</span>
      </Text>
      <Text>
        • Spend one hour in study mode or 2 cycles of Pomodoro{" "}
        <span style={{ color: "green" }}>+10XP</span>
      </Text>
      <Text>
        • Answer one question posted in chat groups{" "}
        <span style={{ color: "green" }}>+10XP</span>
      </Text>
      <Text>
        • Complete one quest posted in chat groups{" "}
        <span style={{ color: "green" }}>+10XP</span>
      </Text>
    </Box>
  );

  return (
    <nav className="bg-gray-800 p-4 w-full">
      <div className="container mx-auto flex justify-between items-center w-full">
        <div className="flex items-center space-x-4">
          <Link href="/home" className="text-gray-300 hover:text-white">
            <img
              src="/images/logo-horizontal-white.png"
              alt="Study Sphere"
              className="h-8"
            />
          </Link>
          {currentUser && (
            <Box>
              <Flex alignItems="center">
                <Progress
                  value={(todayXP / dailyXPTarget) * 100}
                  hasStripe
                  isAnimated
                  width={["50px", "50px", "100px"]}
                  borderRadius="md"
                />
                <Flex alignItems="center" ml={2}>
                  <Text
                    fontFamily="Roboto"
                    className="sm:text-xs"
                    color={"white"}
                  >{`${todayXP}/${dailyXPTarget} daily XP earned`}</Text>
                  <Tooltip label={xpTooltipContent}>
                    <Box ml={2}>
                      <FaInfoCircle className="cursor-pointer" color="white" />
                    </Box>
                  </Tooltip>
                </Flex>
              </Flex>
            </Box>
          )}
        </div>

        <div className="space-x-4">
          {currentUser ? (
            <>
              <button
                onClick={() => router.push("/todos")}
                className="text-gray-300 hover:text-white"
              >
                Todos
              </button>
              <button
                onClick={() => router.push("/study")}
                className="text-gray-300 hover:text-white"
              >
                Study
              </button>
              <button
                onClick={() => router.push("/chatrooms")}
                className="text-gray-300 hover:text-white"
              >
                Community
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="text-gray-300 hover:text-white">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
