import { useState } from "react";
import { toast } from "sonner";

export function useSaveWorkflow() {
  const [loading, setLoading] = useState(false);

  async function saveWorkflow(payload) {
    setLoading(true);

    try {
      const url = payload.id ? `/api/workflow/${payload.id}` : `/api/workflow`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong");
      }

      toast.success(
        payload.id
          ? "Workflow updated successfully"
          : "Workflow created successfully"
      );

      return data;
    } catch (err: any) {
      toast.error(err.message || "Failed to save workflow");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    saveWorkflow,
    loading,
  };
}
