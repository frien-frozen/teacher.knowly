import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
    const authCookie = request.cookies.get('knowly_auth');
    const { pathname, searchParams } = request.nextUrl;

    // 1. Auth Logic
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
      if (!authCookie) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    if (pathname === '/' || pathname === '/login' || pathname === '/apply') {
      if (authCookie) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    // 2. Language Logic
    if (!searchParams.has('lang')) {
        const url = request.nextUrl.clone();
        url.searchParams.set('lang', 'en');
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next|favicon.ico|logos|teachers|.*\\..*).*)'],
};
