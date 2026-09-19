import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/', '/login',  '/forgot-password', '/reset-password'];

export function middleware(request: NextRequest) {
  const adminToken = request.cookies.get('adminToken')?.value;
  const role = request.cookies.get('role')?.value; // 'worker' | 'super_admin'

  const { pathname } = request.nextUrl;

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  // कुकी/टोकन नभएको अवस्थामा
  if (!adminToken) {
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // पहिल्यै लगइन भइसकेको प्रयोगकर्ताले पब्लिक रुट (जस्तै /login) खोल्न खोजेमा
  if (isPublicRoute) {
    if (role === 'super_admin') {
      return NextResponse.redirect(new URL('/cms', request.url));
    } else {
      // worker role को लागि profile मा Redirect
      return NextResponse.redirect(new URL('/cms/profile', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register-restaurant', '/cms/:path*'],
};