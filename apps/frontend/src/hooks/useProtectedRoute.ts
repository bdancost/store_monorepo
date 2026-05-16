/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export function useProtectedRoute() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      void router.push("/auth");
    } else {
      setChecking(false);
    }
  }, [router]);

  return { checking };
}
