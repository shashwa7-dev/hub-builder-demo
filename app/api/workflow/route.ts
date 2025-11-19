import { WorkflowResponse } from "@/lib/workflow/builder-types";
import { CreateOrUpdateWorkflowSchema } from "@/lib/workflow/schema";
import { NextResponse } from "next/server";
export const BASE_URL = "https://builder-dev.up.railway.app";
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = CreateOrUpdateWorkflowSchema.parse(body);

    const res = await fetch(`${BASE_URL}/workflow/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";

    const res = await fetch(
      `${BASE_URL}/workflow?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Upstream API failed", status: res.status },
        { status: 500 }
      );
    }

    const data: WorkflowResponse = await res.json();
    return NextResponse.json<WorkflowResponse>(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Server error", message: (err as Error).message },
      { status: 500 }
    );
  }
}
