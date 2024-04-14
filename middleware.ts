import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

const publicOnlyUrls = new Set(["/", "/login", "/sms", "/create-account"]);

export async function middleware(request: NextRequest) {
  const session = await getSession();

  const pathname = request.nextUrl.pathname;
  const onPublic = publicOnlyUrls.has(pathname);

  if (session.id) {
    if (onPublic) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
  } else {
    if (!onPublic) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
