"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useSignOutAndRedirect() {
  const router = useRouter();

  return async function signOutAndRedirect() {
    await signOut({ redirect: false });
    router.replace("/");
  };
}
