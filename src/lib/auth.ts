import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "./db";

const SESSION_COOKIE = "kk_session";
const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-secret");

export type SessionUser = {
  id: string;
  email: string;
  username: string;
  avatarUrl: string | null;
  nameColor: string;
  nameEffect: string;
  preferredLang: string;
  role: string;
  xp: number;
  streakCount: number;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string) {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function verifySessionToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const userId = await verifySessionToken(token);
  if (!userId) return null;
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      avatarUrl: true,
      nameColor: true,
      nameEffect: true,
      preferredLang: true,
      role: true,
      banned: true,
      xp: true,
      streakCount: true,
    },
  });
  // akun yang dibekukan diperlakukan seperti belum masuk di seluruh aplikasi
  if (!user || user.banned) return null;
  const { banned: _banned, ...session } = user;
  return session;
}

/** Untuk route admin: kembalikan user bila admin, selain itu null. */
export async function getAdminUser(): Promise<SessionUser | null> {
  const user = await getSessionUser();
  return user && user.role === "admin" ? user : null;
}
