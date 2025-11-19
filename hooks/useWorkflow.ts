import { useState, useEffect, useCallback, useRef } from "react";
import {
  Workflow,
  WorkflowNode,
  WorkflowEdge,
  MCPServer,
} from "@/lib/workflow/types";
import {
  saveWorkflow as saveWorkflowToStorage,
  deleteWorkflow as deleteWorkflowFromStorage,
  saveMCPServer,
  getMCPServers,
} from "@/lib/workflow/storage";
import { useWorkflow as useGetWFDetails } from "@/lib/workflow/hooks/useGetWF";
import { cleanupInvalidEdges } from "@/lib/workflow/edge-cleanup";

const NODE_X = 250;
const NODE_GAP = 160;

const positionNode = (index: number) => ({
  x: NODE_X,
  y: 100 + index * NODE_GAP,
});
export function useWorkflow(workflowId?: string) {
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const {
    data: backendWorkflow,
    loading: backendLoading,
    error,
  } = useGetWFDetails(Number(workflowId ?? 0));
  const API_BASE = "/api/workflows";

  // Load a single workflow
  useEffect(() => {
    if (!workflowId || !backendWorkflow) {
      createNewWorkflow();
      return;
    }
    const wf = backendWorkflow;

    // ---------------------------
    // 1. Start node
    // ---------------------------
    const startNode: WorkflowNode = {
      id: "start",
      type: "start",
      position: { x: 250, y: 100 },
      data: { label: "Start", nodeType: "start", nodeName: "Start" },
    };
    // ---------------------------
    // 2. MCP Tool nodes
    // ---------------------------
    const toolNodes: WorkflowNode[] = wf.tools.map((entry, index) => {
      const { tool, mcp } = entry;

      return {
        id: `tool_${tool.id}`,
        type: "mcp",
        position: positionNode(index + 1),
        data: {
          nodeType: "mcp",
          mcpServerId: tool.id,
          toolName: tool.name,
          toolIcon: `https://builder-dev.up.railway.app${mcp.imageUrl}`,
          label: "MCP",
        },
      };
    });

    // ---------------------------
    // 3. End node
    // ---------------------------
    const endNode: WorkflowNode = {
      id: "end",
      type: "end",
      position: positionNode(toolNodes.length + 1),
      data: { label: "End", nodeType: "end", nodeName: "End" },
    };

    const nodes = [startNode, ...toolNodes, endNode];

    // ---------------------------
    // 4. Auto-generate edges
    // ---------------------------
    const edges: WorkflowEdge[] = [];

    // start → first
    edges.push({
      id: "start_to_first",
      source: "start",
      target: toolNodes.length ? toolNodes[0].id : "end",
    });

    // tool → tool
    toolNodes.forEach((node, i) => {
      const next = toolNodes[i + 1];
      if (next) {
        edges.push({
          id: `edge_${node.id}_${next.id}`,
          source: node.id,
          target: next.id,
        });
      }
    });

    // last → end
    edges.push({
      id: "last_to_end",
      source: toolNodes.length ? toolNodes[toolNodes.length - 1].id : "start",
      target: "end",
    });

    // Cleanup
    const cleaned = cleanupInvalidEdges(nodes, edges);

    setWorkflow({
      id: String(wf.id),
      name: wf.name,
      description: wf.description,
      nodes: cleaned.nodes,
      edges: cleaned.edges,
      createdAt: wf.createdAt,
      updatedAt: new Date().toISOString(),
    });
  }, [backendWorkflow, backendLoading, workflowId]);

  // useEffect(() => {
  //   loadWorkflows();
  // }, [loadWorkflows]);

  // Create new workflow (local only)
  const createNewWorkflow = useCallback((): Workflow => {
    const wf: Workflow = {
      id: `workflow_${Date.now()}`,
      name: "New Workflow",
      nodes: [
        {
          id: "node_0",
          type: "start",
          position: { x: 250, y: 100 },
          data: { label: "Start", nodeType: "start", nodeName: "Start" },
        },
      ],
      edges: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setWorkflow(wf);
    return wf;
  }, []);

  // Save workflow
  const saveWorkflow = useCallback(
    async (updates?: Partial<Workflow>) => {
      if (!workflow) {
        return;
      }

      const updated: Workflow = {
        ...workflow,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      setWorkflow(updated);

      //async save if req
    },
    [workflow]
  );

  // // Delete workflow
  // const deleteWorkflow = useCallback(
  //   async (id: string) => {
  //     try {
  //       await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  //     } catch (err) {
  //       console.error("Failed to delete workflow:", err);
  //     }

  //     loadWorkflows();
  //     if (workflow?.id === id) setWorkflow(null);
  //   },
  //   [workflow, loadWorkflows]
  // );

  // Update nodes
  const updateNodes = useCallback(
    (nodes: WorkflowNode[]) => {
      if (!workflow) return;
      saveWorkflow({ nodes });
    },
    [workflow, saveWorkflow]
  );

  // Update edges
  const updateEdges = useCallback(
    (edges: WorkflowEdge[]) => {
      if (!workflow) return;
      saveWorkflow({ edges });
    },
    [workflow, saveWorkflow]
  );

  // Update node data
  const updateNodeData = useCallback(
    (nodeId, data) => {
      if (!workflow) return;

      const nodes = workflow.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
      );

      updateNodes(nodes);
    },
    [workflow, updateNodes]
  );

  return {
    workflow,
    loading: backendLoading,
    error: error,
    saveWorkflow,
    updateNodes,
    updateEdges,
    updateNodeData,
    createNewWorkflow,
  };
}

export function useMCPServers() {
  const [servers, setServers] = useState<MCPServer[]>([]);

  useEffect(() => {
    loadServers();
  }, []);

  const loadServers = () => {
    const loaded = getMCPServers();
    setServers(loaded);
  };

  const addServer = useCallback((server: MCPServer) => {
    saveMCPServer(server);
    loadServers();
  }, []);

  const updateServer = useCallback(
    (id: string, updates: Partial<MCPServer>) => {
      const existing = servers.find((s) => s.id === id);
      if (existing) {
        saveMCPServer({ ...existing, ...updates });
        loadServers();
      }
    },
    [servers]
  );

  return {
    servers,
    addServer,
    updateServer,
    loadServers,
  };
}
