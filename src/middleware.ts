import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Route groups don't appear in URLs: student pages live at /dashboard, /catalog,
// /profile and admin pages at /courses, /analytics, /settings.
const PUBLIC_PATHS = ['/login', '/register'];
const ADMIN_PATHS = ['/courses', '/analytics', '/settings'];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const isPublic =
    pathname === '/' || PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (!session && !isPublic) {
    const loginUrl = new URL('/login', req.nextUrl);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (
    session &&
    ADMIN_PATHS.some((p) => pathname.startsWith(p)) &&
    session.user?.role !== 'admin'
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|ico)$).*)'],
};
