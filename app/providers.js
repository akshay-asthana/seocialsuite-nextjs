// app/providers.tsx
"use client";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
  darkTheme: {},
  lightTheme: {},
};

export const theme = extendTheme({ colors });

export function Providers({ children }) {
  return (
    <CacheProvider>
      <SessionProvider>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </SessionProvider>
    </CacheProvider>
  );
}
