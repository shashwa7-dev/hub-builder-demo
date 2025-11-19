"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";

// Import hero section components
import WorkflowBuilder from "@/components/app/(home)/sections/workflow-builder/WorkflowBuilder";
import { useWorflows } from "@/lib/workflow/hooks/useGetAllWFs";
import { Loader2 } from "lucide-react";

function StyleGuidePageContent() {
  const router = useRouter();
  const [loadWorkflowId, setLoadWorkflowId] = useState<number | null>(null);
  const { data: workflows_data, loading: loading_workflows } = useWorflows();

  const handleReset = () => {
    setLoadWorkflowId(null);
    router.push("/");
  };

  return (
    <div className="border min-h-screen flex items-center justify-center">
      <div className="max-w-xl w-full">
        <h3 className="text-lg border-b pb-4 font-medium text-accent-black mb-10">
          Your Workflows
        </h3>
        {loading_workflows ? (
          <div className="flex items-center justify-center py-20 gap-2 text-label-medium min-h-[30dvh] w-full border rounded-xl">
            <Loader2 className="flex-shrink-0 w-15 h-15 animate-spin text-heat-100" />
            <p>Loading Workflows ...</p>
          </div>
        ) : workflows_data?.data.length === 0 ? (
          <p className="text-xs text-black-alpha-48">No workflow available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
            {workflows_data?.data.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  router.push(`/workflows/${item.id}`);
                }}
                className={`p-16 rounded-12 border transition-all text-left hover:border-heat-100 hover:shadow-sm ${
                  loadWorkflowId === item.id
                    ? "border-heat-100 shadow bg-heat-4"
                    : "border-border-faint"
                }`}
              >
                <div className="space-y-1 mb-5">
                  <p className="text-xs">{item.name}</p>
                  <p className="text-xs text-black-alpha-32">{`Total Tools: ${item.workflow.length}`}</p>
                </div>

                <p className="text-xs text-black-alpha-48 line-clamp-3">
                  {item.description}
                </p>
              </button>
            ))}
          </div>
        )}{" "}
      </div>
    </div>
  );
}

export default function StyleGuidePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StyleGuidePageContent />
    </Suspense>
  );
}
