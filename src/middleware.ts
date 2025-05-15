import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req: request, secret });
  const { pathname } = request.nextUrl;

  // Ignora rotas da API de autenticação
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Redireciona usuários autenticados que tentam acessar "/login"
  if (pathname.startsWith("/login")) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Se não houver token, redireciona para a página de login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/formacao/:path*"], // Adiciona a proteção para "/formacao"
};
