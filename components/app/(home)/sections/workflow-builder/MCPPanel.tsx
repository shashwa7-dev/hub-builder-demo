"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import type { Node } from "@xyflow/react";
import { toast } from "sonner";
import { fetchTools } from "@/lib/tools/tools";
import { ToolRecord, ToolsResponse } from "@/lib/tools/types";
import Button from "@/components/ui/button";

interface MCPPanelProps {
  node: Node | null;
  onClose: () => void;
  onUpdate: (nodeId: string, data: any) => void;
  mode?: "configure" | "add-to-agent";
  onAddToAgent?: (mcpConfig: any) => void;
  onOpenSettings?: () => void;
}

export default function MCPPanel({
  node,
  onClose,
  onUpdate,
  mode = "configure",
  onAddToAgent,
  onOpenSettings,
}: MCPPanelProps) {
  const nodeData = node?.data as any;

  const [tools, setTools] = useState<ToolRecord[]>([]);
  const [loadingTools, setLoadingTools] = useState(true);

  const [selectedServerId, setSelectedServerId] = useState<number | null>(
    () => nodeData?.mcpServerId || null
  );
  const [selectedServer, setSelectedServer] = useState<ToolRecord|null>(
    null
  );
  console.log("selected server", selectedServerId);

  useEffect(() => {
    async function loadTools() {
      try {
        const res = await fetchTools();
        setTools(res.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load tools");
      } finally {
        setLoadingTools(false);
      }
    }
    loadTools();
  }, []);

  // Auto-save only in configure mode
  // useEffect(() => {
  //   if (!node || mode === "add-to-agent") return;

  //   const timeoutId = setTimeout(() => {
  //     try {
  //       onUpdate(node.id, { mcpServerId: selectedServerId });
  //     } catch (error) {
  //       console.error("Error saving selection:", error);
  //       toast.error("Failed to save MCP server selection");
  //     }
  //   }, 500);

  //   return () => clearTimeout(timeoutId);
  // }, [selectedServerId, node, onUpdate, mode]);

  return (
    <AnimatePresence>
      {(node || mode === "add-to-agent") && (
        <motion.aside
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed right-20 top-80 bottom-20 w-[calc(100vw-240px)] max-w-520 bg-accent-white border border-border-faint shadow-lg overflow-y-auto z-50 rounded-16 flex flex-col"
        >
          {/* Header */}
          <div className="p-20 border-b border-border-faint">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-accent-black">
                {mode === "add-to-agent" ? "Add MCP to Agent" : "MCP Node"}
              </h2>
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
            <p className="text-sm text-black-alpha-48">
              Select an MCP tool from your registry
            </p>
          </div>

          {/* Body */}
          <div className="p-20 space-y-20">
            {/* Tool Cards */}
            <div>
              <h3 className="text-sm font-medium text-accent-black mb-10">
                Available Tools
              </h3>

              {loadingTools ? (
                <div className="flex items-center justify-center py-20 gap-2 text-label-medium">
                  <Loader2 className="flex-shrink-0 w-15 h-15 animate-spin text-heat-100" />
                  <p>Loading tools ...</p>
                </div>
              ) : tools.length === 0 ? (
                <p className="text-xs text-black-alpha-48">
                  No tools available.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
                  {tools.map((item) => (
                    <button
                      key={item.tool.id}
                      onClick={() => {
                        setSelectedServerId(item.tool.id);
                        setSelectedServer(item);
                        if (mode === "add-to-agent" && onAddToAgent) {
                          onAddToAgent({
                            mcpServerId: item.tool.id,
                            name: item.mcp.name,
                            tools: item.tool || [],
                          });

                          toast.success(`Added ${item.mcp.name} to agent`);
                          setTimeout(() => onClose(), 800);
                        }
                      }}
                      className={`p-16 rounded-12 border transition-all text-left hover:border-heat-100 hover:shadow-sm ${
                        selectedServerId === item.tool.id
                          ? "border-heat-100 shadow bg-heat-4"
                          : "border-border-faint"
                      }`}
                    >
                      <div className="flex items-center gap-12 mb-5">
                        <img
                          src={`https://builder-dev.up.railway.app${item.mcp.imageUrl}`}
                          alt={item.mcp.name}
                          className="w-28 h-28"
                        />
                        <div>
                          <h4 className="text-sm font-semibold text-accent-black">
                            {item.tool.name}
                          </h4>
                          <p className="text-xs text-black-alpha-32">
                            {item.mcp.name}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-black-alpha-48 line-clamp-3">
                        {item.tool.description}
                      </p>
                    </button>
                  ))}
                </div>
              )}
              {selectedServer && node?.id && !loadingTools && (
                <Button
                  className="mt-12"
                  onClick={() => {
                    onUpdate(node.id, { mcpServerId: selectedServer.tool.id, toolName: selectedServer.tool.name,
                            toolIcon:`https://builder-dev.up.railway.app${selectedServer.mcp.imageUrl}`, });
                    onClose();
                  }}
                >
                  Save
                </Button>
              )}
            </div>

            {/* Add New MCP */}
            <div className="pt-16 border-t border-border-faint">
              <p className="text-xs text-black-alpha-48 mb-8">
                Need to add a new MCP server?
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenSettings?.();
                }}
                className="text-xs text-heat-100 hover:text-heat-200 font-medium"
              >
                Go to Settings → MCP Registry
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
