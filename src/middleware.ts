import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PROTECTED = ["/belajar", "/tantangan", "/proyek", "/profil", "/papan-peringkat", "/admin"];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("kk_session")?.value;
  let authed = false;
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-secret");
      await jwtVerify(token, secret);
      authed = true;
    } catch {
      authed = false;
    }
  }
  const { pathname } = req.nextUrl;
  if (PROTECTED.some((p) => pathname === p || pathname.startsWith(p + "/")) && !authed) {
    const url = new URL("/masuk", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
};

export const config = {
  matcher: ["/belajar/:path*", "/tantangan/:path*", "/proyek/:path*", "/profil", "/papan-peringkat", "/admin/:path*"],
};
