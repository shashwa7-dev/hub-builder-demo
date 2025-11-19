export interface WorkflowItem {
  id: number;
  name: string;
  description: string;
  workflow: number[];
  createdAt: string;
}

export interface WorkflowResponse {
  page: number;
  limit: number;
  total: number;
  data: WorkflowItem[];
}

export interface JsonSchema {
  $schema: string;
  type: string;
  properties?: Record<string, any>;
  required?: string[];
  additionalProperties?: boolean;
}

export interface Tool {
  id: number;
  name: string;
  description: string;
  mcpId: number;
  inputSchema: JsonSchema | null;
  outputSchema: JsonSchema | null;
  endpoint: string | null;
  createdAt: string;
}

export interface Mcp {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

export interface WorkflowTool {
  tool: Tool;
  mcp: Mcp;
}

export interface WorkflowItem {
  id: number;
  name: string;
  description: string;
  workflow: number[];
  createdAt: string;
  tools: WorkflowTool[];
}