"use client";
import { Button } from "@chakra-ui/react";
import { MdArrowForward } from "react-icons/md";
import { FC } from "react";
import { useRouter } from "next/navigation";

interface HomeButtonProps {
  web: string;
  buttonText: string;
}

const HomeButton: FC<HomeButtonProps> = ({ web, buttonText }) => {
  const router = useRouter();
  return (
    <div onClick={() => router.push(web)} className="flex justify-end mt-2">
      <Button
        rightIcon={<MdArrowForward />}
        colorScheme="teal"
        variant="outline"
        size={"xs"}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default HomeButton;
