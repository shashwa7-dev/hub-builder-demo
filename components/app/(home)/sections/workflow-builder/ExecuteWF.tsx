"use client";

import { WorkflowStatus } from "@/hooks/useWorkflowStatus";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

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
              active ? "bg-heat-8 border-heat-100" : "bg-gray-50"
            }`}
          >
            {active && (
              <Loader2 className="absolute top-4 right-4 w-15 h-15 text-black-alpha-48 animate-spin" />
            )}
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
              </div>

              <div>
                <p className="text-xs text-black-alpha-48">
                  {step.toolDescription}
                </p>
              </div>
              <span className="text-xs capitalize">{`Status: ${step.status}`}</span>
            </div>
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
              <h2 className="text-label-large text-accent-black">
                Workflow Execution
              </h2>
              <div className="text-sm">
                <h2 className="text-label-large text-accent-black font-medium italic">
                  {data.workflowName}
                </h2>
                <div className="!capitalize">
                  <strong>Status:</strong> {data.status}
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
