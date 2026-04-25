import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;
    const auth = request.cookies.get('knowly_auth')?.value;
    const role = request.cookies.get('knowly_role')?.value;

    // Protected routes: require valid session
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
        if (!auth) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        // Admin routes require ADMIN role
        if (pathname.startsWith('/admin') && role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    // Already logged in: redirect away from public auth pages
    if (pathname === '/' || pathname === '/login' || pathname === '/apply') {
        if (auth) {
            const dest = role === 'ADMIN' ? '/admin' : '/dashboard';
            return NextResponse.redirect(new URL(dest, request.url));
        }
    }

    // Inject lang param if missing
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
