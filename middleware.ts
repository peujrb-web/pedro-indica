import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthRoute = request.nextUrl.pathname === '/admin/login';
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin') && !isAuthRoute;

  const sessionCookie = request.cookies.get('pedro_admin_session_token');
  const isAuthenticated = Boolean(
    sessionCookie && sessionCookie.value === 'sec_token_pedro_indica_admin_authenticated_8829'
  );

  // Redireciona usuários não autorizados tentando acessar o painel
  if (isAdminRoute && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  // Redireciona usuários já autenticados se tentarem entrar na página de login novamente
  if (isAuthRoute && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
