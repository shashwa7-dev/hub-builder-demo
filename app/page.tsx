"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";

// Import hero section components
import WorkflowBuilder from "@/components/app/(home)/sections/workflow-builder/WorkflowBuilder";
import { useWorflows } from "@/lib/workflow/hooks/useGetAllWFs";
import { BadgePlus, Loader2 } from "lucide-react";

function StyleGuidePageContent() {
  const router = useRouter();
  const [loadWorkflowId, setLoadWorkflowId] = useState<number | null>(null);
  const { data: workflows_data, loading: loading_workflows } = useWorflows();

  const handleReset = () => {
    setLoadWorkflowId(null);
    router.push("/");
  };

  return (
    <div className="min-h-screen flex">
      <div className="max-w-4xl w-full relative flex-1  mx-auto py-12">
        <h3 className="text-lg border-b p-4 font-medium text-accent-black mb-10 sticky top-0 bg-background-base">
          Your Workflows
        </h3>
        {loading_workflows ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
            <WorkflowItemSkeleton />
            <WorkflowItemSkeleton /> <WorkflowItemSkeleton />
            <WorkflowItemSkeleton /> <WorkflowItemSkeleton />
            <WorkflowItemSkeleton />
          </div>
        ) : workflows_data?.data.length === 0 ? (
          <p className="text-xs text-black-alpha-48">No workflow available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
            <button
              onClick={() => {
                router.push(`/workflows`);
              }}
              className={`p-16 rounded-12 border transition-all text-left hover:border-heat-100 hover:shadow-sm border-border-faint`}
            >
              <div className="mb-5 flex flex-col items-center justify-center gap-2">
                <BadgePlus className="w-20 h-20" />
                <p className="text-sm">Create New Workflow</p>
              </div>
            </button>
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
        )}
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

export function WorkflowItemSkeleton() {
  return (
    <div
      className={`p-16 rounded-12 border border-border-faint bg-black-alpha-4 animate-pulse`}
    >
      <div className="space-y-1 mb-5">
        <div className="h-10 w-24 bg-black-alpha-12 rounded" />
        <div className="h-10 w-32 bg-black-alpha-8 rounded" />
      </div>

      <div className="space-y-2">
        <div className="h-10 w-full bg-black-alpha-8 rounded" />
        <div className="h-10 w-5/6 bg-black-alpha-8 rounded" />
        <div className="h-10 w-4/6 bg-black-alpha-8 rounded" />
      </div>
    </div>
  );
}
