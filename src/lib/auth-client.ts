"use client";

import { signOut } from "next-auth/react";

export function useSignOutAndRedirect() {
  return async function signOutAndRedirect() {
    await signOut({ redirect: false });
    window.location.replace("/");
  };
}
