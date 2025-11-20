"use client";

import Check from "@/components/shared/icons/check";
import { WorkflowStatus } from "@/hooks/useWorkflowStatus";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";

function ExecutionStatus({ data }: { data: WorkflowStatus }) {
  return (
    <ul className="space-y-20 pt-5">
      {data.steps.map((step) => {
        const active =
          step.stepIndex === data.currentStep - 1 &&
          data?.status !== "completed";
        return (
          <li
            key={step.stepIndex}
            className={`p-3  border rounded-lg relative ${
              active ? "bg-white-alpha-56 border-heat-100" : "bg-gray-50"
            }`}
          >
            <div className="p-4 space-y-4">
              <div className="flex gap-4">
                <img
                  src={`https://builder-dev.up.railway.app${step.mcpImageUrl}`}
                  alt={step.mcpName}
                  className="w-[40px] h-[40px]"
                />
                <div>
                  <h4 className="text-sm font-semibold text-accent-black">
                    {step.toolName}
                  </h4>
                  <p className="text-xs text-black-alpha-32">{step.mcpName}</p>
                </div>
                <div className="flex ml-auto gap-2 items-center h-fit">
                  {active && (
                    <Loader2 className="w-12 h-12 text-black-alpha-48 animate-spin" />
                  )}
                  {step.status === "completed" && (
                    <CheckCircle className="w-12 h-12 text-heat-100" />
                  )}
                  <span className="text-xs capitalize">{`${step.status}`}</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-black-alpha-48">
                  {step.toolDescription}
                </p>
              </div>
            </div>
            {step?.result && (
              <div className="px-4 border-t py-4">
                <label className="block text-xs text-label-small text-black-alpha-48 mb-8">
                  Output Data (JSON)
                </label>
                <textarea
                  value={JSON.stringify(step?.result)}
                  rows={3}
                  disabled={true}
                  className={`w-full px-12 py-10 bg-background-base text-black-alpha-48  border rounded-8 text-body-small font-mono focus:outline-none focus:border-heat-100 transition-colors resize-none ${"border-border-faint"}`}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

interface ExecutionStatusPanelProps {
  data: WorkflowStatus;
  onClose: () => void;
}

export default function ExecutionStatusPanel({
  data,
  onClose,
}: ExecutionStatusPanelProps) {
  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed right-20 top-80 h-[calc(100vh-100px)] w-480 bg-accent-white border border-border-faint shadow-lg overflow-y-auto z-50 rounded-16"
      >
        {/* Header */}
        <div className="p-10 pb-5 px-20 border-b border-border-faint sticky top-0 bg-accent-white">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-label-x-large text-accent-black">
                Workflow Execution
              </h3>
              <div className="text-sm">
                <h2 className="text-label-large text-accent-black font-medium italic">
                  {data.workflowName}
                </h2>
                <div className="!capitalize text-sm flex items-center gap-4">
                  <p>Status: {data.status}</p>
                  {data.status === "completed" && (
                    <CheckCircle className="w-12 h-12 text-heat-100" />
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-32 h-32 rounded-6 hover:bg-black-alpha-4 transition-colors flex items-center justify-center"
            >
              <svg
                className="w-16 h-16 text-black-alpha-48"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Status Badge */}
          {/* {execution && (
            <div
              className={`inline-flex items-center gap-8 px-12 py-6 rounded-8 text-body-small ${
                execution.status === "running"
                  ? "bg-heat-4 text-heat-100"
                  : execution.status === "completed"
                    ? "bg-heat-4 text-heat-100"
                    : execution.status === "failed"
                      ? "bg-black-alpha-4 text-accent-black"
                      : "bg-gray-50 text-gray-600"
              }`}
            >
              {execution.status === "running" && (
                <svg
                  className="w-12 h-12 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              )}
              {execution.status}
            </div>
          )} */}
        </div>

        {/* Content */}
        <div className="pt-10 px-20">
          <ExecutionStatus data={data} />
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
