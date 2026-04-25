import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const auth = request.cookies.get('knowly_auth')?.value;
  const role = request.cookies.get('knowly_role')?.value;

  // No session → kick to login
  if (!auth) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Teacher trying to access admin → kick to dashboard
  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
