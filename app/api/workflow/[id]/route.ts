import { WorkflowItem } from "@/lib/workflow/builder-types";
import { CreateOrUpdateWorkflowSchema } from "@/lib/workflow/schema";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const body = await req.json();

    const parsed = CreateOrUpdateWorkflowSchema.parse({
      ...body,
      id: Number(id),
    });
    console.log("parsed", parsed);

    const res = await fetch(
      `https://builder-dev.up.railway.app/workflow/update`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      }
    );

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const res = await fetch(
      `https://builder-dev.up.railway.app/workflow/${id}`,
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

    const data: WorkflowItem = await res.json();
    return NextResponse.json<WorkflowItem>(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Server error", message: (err as Error).message },
      { status: 500 }
    );
  }
}
