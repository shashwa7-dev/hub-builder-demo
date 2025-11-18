export const runtime = "edge";
// app/api/tools/route.ts
import { ToolsResponse } from "@/lib/tools/types";
import { NextResponse } from "next/server";

const BASE_URL = "https://builder-dev.up.railway.app/workflow/tools";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";

    const res = await fetch(`${BASE_URL}?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Upstream API failed", status: res.status },
        { status: 500 }
      );
    }

    const data: ToolsResponse = await res.json();
    return NextResponse.json<ToolsResponse>(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Server error", message: (err as Error).message },
      { status: 500 }
    );
  }
}
