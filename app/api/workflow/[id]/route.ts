export const runtime = "edge";
import { CreateOrUpdateWorkflowSchema } from "@/lib/workflow/schema";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const parsed = CreateOrUpdateWorkflowSchema.parse({
      ...body,
      id: Number(params.id),
    });

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
