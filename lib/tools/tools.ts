import type { ToolsResponse } from "./types";

export async function fetchTools(page = 1, limit = 20): Promise<ToolsResponse> {
  const res = await fetch(`/api/tools?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch tools");
  return res.json();
}
