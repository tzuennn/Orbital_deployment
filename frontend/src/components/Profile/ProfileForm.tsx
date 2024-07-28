"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Select,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { firestore } from "../../../firebase/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../Auth/AuthContext";

type FormValues = {
  nickname: string;
  yearOfStudy: string;
  faculty: string;
  major: string;
  hobby: string;
  cca: string;
  birthday: string;
};

const ProfileForm: React.FC = (): JSX.Element => {
  const router = useRouter();
  const { currentUser, updateProfileData } = useAuth() || {};
  const [formValues, setFormValues] = useState<FormValues>({
    nickname: "",
    yearOfStudy: "",
    faculty: "",
    major: "",
    hobby: "",
    cca: "",
    birthday: "",
  });

  const toast = useToast();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (currentUser) {
        try {
          const profileDoc = await getDoc(doc(firestore, "profiles", currentUser.uid));
          if (profileDoc.exists()) {
            setFormValues(profileDoc.data() as FormValues);
          }
        } catch (error) {
          toast({
            title: "Error loading profile data.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    };

    fetchProfileData();
  }, [currentUser, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleProfileUpdate = async () => {
    if (!currentUser) {
      return;
    }

    const updatedProfileData = {
      ...formValues,
      userId: currentUser.uid,
      profileCompleted: true,
    };

    console.log("Updating profile data:", updatedProfileData);

    try {
      await setDoc(doc(firestore, "profiles", currentUser.uid), updatedProfileData, { merge: true });

      if (updateProfileData) {
        await updateProfileData(updatedProfileData);
      }

      const updatedDoc = await getDoc(doc(firestore, "profiles", currentUser.uid));
      console.log("Updated profile data from Firestore:", updatedDoc.data());

      toast({
        title: "Profile updated successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      router.push("/home");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const requiredFields = ["nickname", "yearOfStudy", "faculty", "major", "birthday"];
    const missingFields = requiredFields.filter((field) => !formValues[field as keyof FormValues]);

    if (missingFields.length > 0) {
      toast({
        title: "Please fill out all required fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    handleProfileUpdate();
  };

  return (
    <Box maxWidth="500px" mx="auto" p={5} borderWidth={1} borderRadius="lg">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="nickname" isRequired>
            <FormLabel>Nickname</FormLabel>
            <Input
              type="text"
              name="nickname"
              value={formValues.nickname}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="yearOfStudy" isRequired>
            <FormLabel>Year of Study</FormLabel>
            <Select
              name="yearOfStudy"
              onChange={handleChange}
              value={formValues.yearOfStudy}
            >
              <option value="">Select Year</option>
              <option value="Year 1">1</option>
              <option value="Year 2">2</option>
              <option value="Year 3">3</option>
              <option value="Year 4">4</option>
              <option value="Year 5">5</option>
              <option value="Master">Master</option>
              <option value="PhD">PhD</option>
            </Select>
          </FormControl>

          <FormControl id="faculty" isRequired>
            <FormLabel>Faculty</FormLabel>
            <Input
              type="text"
              name="faculty"
              value={formValues.faculty}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="major" isRequired>
            <FormLabel>Major</FormLabel>
            <Input
              type="text"
              name="major"
              value={formValues.major}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="hobby">
            <FormLabel>Hobby</FormLabel>
            <Input
              type="text"
              name="hobby"
              value={formValues.hobby}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="cca">
            <FormLabel>CCA</FormLabel>
            <Input
              type="text"
              name="cca"
              value={formValues.cca}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="birthday" isRequired>
            <FormLabel>Birthday</FormLabel>
            <Input
              type="date"
              name="birthday"
              value={formValues.birthday}
              onChange={handleChange}
            />
          </FormControl>

          <Button type="submit" colorScheme="blue" width="full">
            Submit
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default ProfileForm;
