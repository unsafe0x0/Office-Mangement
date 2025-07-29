import { NextResponse, NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface MyJwtPayload {
  role?: string;
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    if (path !== "/login") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  let role: string | undefined;

  try {
    const decoded = jwtDecode<MyJwtPayload>(token);
    role = decoded.role?.toLowerCase();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!role || (role !== "admin" && role !== "employee")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (path === "/login") {
    return NextResponse.redirect(new URL(`/${role}`, request.url));
  }

  if (path === "/admin" && role !== "admin") {
    return NextResponse.redirect(new URL("/employee", request.url));
  }

  if (path === "/employee" && role !== "employee") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/employee", "/admin"],
};
