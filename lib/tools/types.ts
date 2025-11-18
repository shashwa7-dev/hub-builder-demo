export interface Tool {
  id: number;
  name: string;
  description: string;
  mcpId: number;
  inputSchema: any | null;
  outputSchema: any | null;
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

export interface ToolRecord {
  tool: Tool;
  mcp: Mcp;
}

export interface ToolsResponse {
  page: number;
  limit: number;
  total: number;
  data: ToolRecord[];
}
