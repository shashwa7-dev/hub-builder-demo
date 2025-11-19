import { useEffect, useState } from "react";
import { WorkflowResponse } from "../builder-types";

export function useWorflows(page = 1, limit = 20) {
  const [data, setData] = useState<WorkflowResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/workflow?page=${page}&limit=${limit}`);
        if (!res.ok) throw new Error("Failed to fetch workflows");
        const json = await res.json();

        if (isMounted) setData(json);
      } catch (err: any) {
        if (isMounted) setError(err.message || "Something went wrong");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [page, limit]);

  return { data, loading, error };
}
