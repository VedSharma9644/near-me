import { NextResponse } from 'next/server';

export function middleware(req) {
    const token = req.cookies.get('token') || req.headers.get('authorization');

    if (!token) {
        return NextResponse.redirect(new URL('/salon-admin/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/salon-admin/:path*'], // Apply middleware to all routes under /salon-admin
};
