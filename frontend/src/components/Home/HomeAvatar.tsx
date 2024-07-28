import React from "react";
import { Avatar, Stack, Tooltip } from "@chakra-ui/react";
import Link from "next/link";
import { useAuth } from "../Auth/AuthContext";

export default function HomeAvatar({
  classes,
  isHome,
}: {
  classes: string;
  isHome: boolean;
}) {
  const { profile } = useAuth() || {};

  return (
    <>
      {isHome ? (
        <Tooltip label="Profile" fontSize="xs">
          <Link href="/profile">
            <Stack direction="row">
              <Avatar
                name={profile?.displayName ?? ""}
                src={profile?.photoURL ?? ""}
                size={"md"}
                bg={"red"}
                className={classes}
              />
            </Stack>
          </Link>
        </Tooltip>
      ) : (
        <Stack direction="row">
          <Avatar
            name={profile?.displayName ?? ""}
            src={profile?.photoURL ?? ""}
            size={"xl"}
            bg={"red"}
            className={classes}
          />
        </Stack>
      )}
    </>
  );
}
