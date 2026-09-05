import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { progress } from "../../../db/schema";

async function userId() {
  return (await headers()).get("oai-authenticated-user-id");
}

export async function GET() {
  const id = await userId();
  if (!id) return Response.json({ error: "Sign in required" }, { status: 401 });
  try {
    const rows = await getDb().select().from(progress).where(eq(progress.userId, id));
    return Response.json({ completed: rows.filter((r) => r.completed).map((r) => r.itemId) });
  } catch {
    return Response.json({ error: "Progress is temporarily unavailable." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const id = await userId();
  if (!id) return Response.json({ error: "Sign in required" }, { status: 401 });
  const body = await request.json() as { itemId?: string; completed?: boolean };
  if (!body.itemId || !/^week-[1-8]$/.test(body.itemId)) return Response.json({ error: "Invalid item" }, { status: 400 });
  try {
    const db = getDb();
    const existing = await db.select({ id: progress.id }).from(progress)
      .where(and(eq(progress.userId, id), eq(progress.itemId, body.itemId))).limit(1);
    if (existing[0]) {
      await db.update(progress).set({ completed: Boolean(body.completed), updatedAt: new Date().toISOString() }).where(eq(progress.id, existing[0].id));
    } else {
      await db.insert(progress).values({ userId: id, itemId: body.itemId, completed: Boolean(body.completed), updatedAt: new Date().toISOString() });
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Could not save progress." }, { status: 503 });
  }
}
