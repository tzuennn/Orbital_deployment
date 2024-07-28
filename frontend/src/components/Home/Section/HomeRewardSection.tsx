"use client";
import { Box, Flex, Progress, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import HomeButton from "../HomeButton";
export default function HomeRewardSection({ style }: { style: string }) {
  const { totalXP, todayXP } = useSelector(
    (state: RootState) => state.userInfo
  );
  return (
    <div className={`relative ${style}`}>
      <div className="mb-3 ml-2 font-bold text-xl border-b-2 border-white pb-1">
        Reward
      </div>
      <div className="grid grid-cols-2">
        <div className="ml-2 mt-5">
          <Text as="b" fontSize="lg">
            Total XP: {totalXP}
          </Text>
        </div>
        <Box className="py-4 mt-2 ml-2">
          <Flex alignItems="center">
            <Progress
              value={(todayXP / 40) * 100}
              hasStripe
              isAnimated
              width="100px"
              minWidth="100px"
              borderRadius="md"
            />
            <Flex alignItems="center" ml={4}>
              <Text as="b">{`${todayXP}/40 daily XP earned`}</Text>
            </Flex>
          </Flex>
        </Box>
        <div className="absolute bottom-2 right-4">
          <HomeButton web={"/profile"} buttonText={"Find out More"} />
        </div>
      </div>
    </div>
  );
}
