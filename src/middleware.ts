// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "accessToken"; // essa variável deve ser EXATAMENTE como no AuthController do Spring

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(`\n[MIDDLEWARE] Interceptando rota: ${pathname}`);

  const authCookie = request.cookies.get(AUTH_COOKIE_NAME);

  if (authCookie) {
    console.log("[MIDDLEWARE] Cookie de autenticação ENCONTRADO.");
  } else {
    console.log("[MIDDLEWARE] Cookie de autenticação NÃO ENCONTRADO.");
  }

  const privateRoutes = ["/dashboard"];
  const publicOnlyRoutes = ["/auth/login", "/auth/register"];

  const isAccessingPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAccessingPublicOnlyRoute = publicOnlyRoutes.includes(pathname);

  if (!authCookie && isAccessingPrivateRoute) {
    console.log("[MIDDLEWARE] Acesso negado. Redirecionando para /auth/login");
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (authCookie && isAccessingPublicOnlyRoute) {
    console.log(
      "[MIDDLEWARE] Usuário já logado. Redirecionando para /dashboard"
    );
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  console.log(
    "[MIDDLEWARE] Acesso permitido. Continuando para a rota solicitada."
  );
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login", "/auth/register"],
};
