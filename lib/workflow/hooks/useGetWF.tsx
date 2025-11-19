import { useEffect, useState } from "react";
import { WorkflowItem } from "../builder-types";

export function useWorkflow(id: number) {
  const [data, setData] = useState<WorkflowItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/workflow/${id}`);
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
  }, [id]);

  return { data, loading, error };
}
