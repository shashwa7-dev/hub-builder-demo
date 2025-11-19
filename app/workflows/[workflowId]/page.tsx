"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WorkflowBuilder from "@/components/app/(home)/sections/workflow-builder/WorkflowBuilder";

export default function WorkflowPage({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) {
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    params.then(({ workflowId }) => {
      setWorkflowId(workflowId);
    });
  }, [params]);

  return (
    <WorkflowBuilder
      onBack={() => router.push("/")}
      initialWorkflowId={workflowId}
      initialTemplateId={null}
    />
  );
}
