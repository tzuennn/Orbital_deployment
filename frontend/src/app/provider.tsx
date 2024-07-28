"use client";
import React from "react";
import { store, RootState } from "../store/store";
import { Provider, useSelector } from "react-redux";
import { AuthProvider } from "@/components/Auth/AuthContext";
import { FullScreenTopBar } from "@/components/Study/FullScreenTopBar";
import Navbar from "@/components/Home/Navbar";

import { ChakraProvider } from "@chakra-ui/react";

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { isFullscreen } = useSelector((state: RootState) => state.timer);

  return (
    <>
      {!isFullscreen ? <Navbar /> : <FullScreenTopBar />}
      <div className={`container mx-auto ${!isFullscreen ? "mt-4" : "mt-1"}`}>
        {children}
      </div>
    </>
  );
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Provider store={store}>
        <ChakraProvider>
          <LayoutContent>{children}</LayoutContent>
        </ChakraProvider>
      </Provider>
    </AuthProvider>
  );
}
