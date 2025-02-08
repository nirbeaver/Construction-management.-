import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public paths that don't require authentication
const publicPaths = ['/', '/auth/signin', '/auth/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicPath = publicPaths.includes(pathname);

  // Get the token from cookies
  const token = request.cookies.get('session')?.value;

  // If the path is public and user is logged in, redirect to projects
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/projects', request.url));
  }

  // If the path is protected and user is not logged in, redirect to login
  if (!isPublicPath && !token) {
    const response = NextResponse.redirect(new URL('/auth/signin', request.url));
    response.cookies.delete('session');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 