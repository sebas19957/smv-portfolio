import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Obtiene la ruta actual
  const path = request.nextUrl.pathname;

  // Si ya está en la página principal, no hacer nada
  if (path === "/") {
    return NextResponse.next();
  }

  // Redireccionar a la página principal para cualquier otra ruta
  return NextResponse.redirect(new URL("/", request.url));
}

// Configurar en qué rutas se ejecutará el middleware
export const config = {
  // Ejecutar en todas las rutas excepto api, _next/static, _next/image, favicon.ico
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
