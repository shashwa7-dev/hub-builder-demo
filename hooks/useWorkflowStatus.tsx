import { useEffect, useState } from "react";

export interface Step {
  stepIndex: number;
  toolId: number;
  status: string;
  executionTime: string | null;
  toolName: string;
  toolDescription: string;
  mcpName: string;
  mcpImageUrl: string;
}

export interface WorkflowStatus {
  sessionId: string;
  workflowName: string;
  status: string;
  currentStep: number;
  totalSteps: number;
  progress: number;
  steps: Step[];
}

export function useWorkflowStatus(workflowId?: string) {
  const [data, setData] = useState<WorkflowStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasValidData, setHasValidData] = useState(false);

  const fetchStatus = async (controller?: AbortController) => {
    if (!workflowId) return; // ⛔ skip fetch

    try {
      const res = await fetch(
        `https://builder-dev.up.railway.app/workflow/${workflowId}/status`,
        { signal: controller?.signal }
      );

      if (res.status === 404) {
        setData(null);
        setError("No active workflow.");
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch");

      const json = await res.json();
      setData(json);
      setError(null);
      setHasValidData(true);
    } catch (e: any) {
      if (e.name !== "AbortError") {
        setError("Failed to load workflow status.");
      }
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    // reset whenever workflowId changes
    setData(null);
    setError(null);
    setHasValidData(false);
    setInitialLoading(true);

    if (!workflowId) return; // ⛔ skip polling entirely

    const controller = new AbortController();
    fetchStatus(controller);

    const interval = setInterval(() => {
      const c = new AbortController();
      fetchStatus(c);
    }, 2500);

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [workflowId]);

  return {
    data,
    error,
    initialLoading,
    hasValidData,
  };
}
