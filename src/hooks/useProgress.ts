import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProgress } from "@/lib/firestore";

export function useProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    if (!user) return;
    setLoading(true);
    const data = await getUserProgress(user.uid);
    setProgress(data);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, [user]);

  return { progress, loading, refresh };
}
