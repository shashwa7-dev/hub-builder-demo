import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Call your backend workflow engine
    const res = await fetch(
      `https://builder-dev.up.railway.app/workflow/${id}/status`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
      }
    );
    console.log("res", res);

    // If workflow is not active / session expired
    if (res.status === 404) {
      return NextResponse.json(
        { error: "Workflow session not active" },
        { status: 404 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch session status" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Error in session GET:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
