"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Import hero section components
import WorkflowBuilder from "@/components/app/(home)/sections/workflow-builder/WorkflowBuilder";

function StyleGuidePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loadWorkflowId, setLoadWorkflowId] = useState<string | null>(null);
  const [loadTemplateId, setLoadTemplateId] = useState<string | null>(null);

  // Handle URL params
  useEffect(() => {
    if (!searchParams) return;

    const view = searchParams.get("view");
    const workflowId = searchParams.get("workflow");
    const templateId = searchParams.get("template");

    if (view === "workflows") {
    } else if (workflowId) {
      setLoadWorkflowId(workflowId);
    } else if (templateId) {
      setLoadTemplateId(templateId);
    }
  }, [searchParams]);

  const handleReset = () => {
    setLoadWorkflowId(null);
    setLoadTemplateId(null);
    router.push("/");
  };

  return (
    <WorkflowBuilder
      onBack={handleReset}
      initialWorkflowId={loadWorkflowId}
      initialTemplateId={loadTemplateId}
    />
  );
}

export default function StyleGuidePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StyleGuidePageContent />
    </Suspense>
  );
}
