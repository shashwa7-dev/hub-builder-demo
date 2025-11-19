"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import WorkflowBuilder from "@/components/app/(home)/sections/workflow-builder/WorkflowBuilder";

export default function WorkflowsPage() {
  const router = useRouter();

  return (
    <WorkflowBuilder
      onBack={() => router.push("/")}
      initialWorkflowId={null}
      initialTemplateId={null}
    />
  );
}
