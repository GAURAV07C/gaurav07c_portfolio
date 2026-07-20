import { NextResponse } from "next/server";
import { invalidateCache } from "@/lib/cache";

export function invalidateClientCache() {
  invalidateCache();
}

export function ok(body: unknown, status = 200) {
  invalidateClientCache();
  return NextResponse.json(body, { status });
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function serverError(message = "Server error") {
  return NextResponse.json({ error: message }, { status: 500 });
}
