import "server-only";
import { db } from "./db";
import { getAdminUser } from "./auth";
import type { SessionUser } from "./auth";

/** Guard route admin: kembalikan admin bila sah, null bila bukan. */
export async function requireAdmin(): Promise<SessionUser | null> {
  return getAdminUser();
}

/** Catat aksi admin untuk jejak audit yang tampil di panel. */
export async function catatAksi(
  adminUsername: string,
  action: string,
  targetUsername?: string,
  detail?: string
) {
  await db.adminAction.create({
    data: { adminUsername, action, targetUsername, detail },
  });
}
