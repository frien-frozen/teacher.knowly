import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    // Only redirect if no lang param is set
    if (!searchParams.has('lang')) {
        const url = request.nextUrl.clone();
        url.searchParams.set('lang', 'en');
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    // Run on all routes except Next.js internals and static files
    matcher: ['/((?!_next|favicon.ico|logos|teachers|.*\\..*).*)'],
};
