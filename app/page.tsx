"use client";

import { useState,  Suspense } from "react";
import { useRouter, } from "next/navigation";

// Import hero section components
import WorkflowBuilder from "@/components/app/(home)/sections/workflow-builder/WorkflowBuilder";

function StyleGuidePageContent() {
  const router = useRouter();
  const [loadWorkflowId, setLoadWorkflowId] = useState<string | null>(null);
  const [loadTemplateId, setLoadTemplateId] = useState<string | null>(null);


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
