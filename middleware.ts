import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Get the pathname from the URL
  const pathname = req.nextUrl.pathname;
  
  // Skip middleware for API routes and public assets
  if (pathname.startsWith('/api') || 
      pathname.includes('.') || 
      pathname === '/') {
    return NextResponse.next();
  }

  // Get the token
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // If trying to access admin routes but not admin, redirect
  if (pathname.startsWith('/admin') && token.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

// Apply middleware to protected routes
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
