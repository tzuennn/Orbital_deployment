import { MdOutlineQueryStats } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
export default function VirtualSpace() {
  const router = useRouter();
  return (
    <div className="col-span-2 md:col-span-1 ml-5 mb-4 mt-3 rounded-xl p-4 md:px-4 py-10 bg-[url('/images/notebook.jpg')] bg-cover bg-center">
      <div>
        <div className="text-sm md:text-lg">
          Wanna check your study progress?
        </div>

        <div className="flex justify-center">
          <Button
            leftIcon={<FaArrowRightLong />}
            rightIcon={<MdOutlineQueryStats />}
            colorScheme="none"
            textColor={"red.500"}
            variant="solid"
            size={{ base: "xs", lg: "lg" }}
            onClick={() => router.push("/stats")}
            className="mt-2 md:mt-10 hover:text-red-800"
          >
            Get My Stats
          </Button>
        </div>
      </div>
    </div>
  );
}
