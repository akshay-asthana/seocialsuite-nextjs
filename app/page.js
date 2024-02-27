"use client";
import { useSession, signOut, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@chakra-ui/react";
import axios from "axios";
import Loading from "./loading";

export default function Component() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status == "loading") return <Loading />;

  if (!session) {
    return signIn();
  } else {
    return <div>This is home</div>;
  }
}
