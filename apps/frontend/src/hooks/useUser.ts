/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

export function useUser(): User | null {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw) as User);
    } catch {
      setUser(null);
    }
  }, []);

  return user;
}
