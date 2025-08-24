import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  try {
    // Create response object
    const response = NextResponse.next({
      request: {
        headers: req.headers,
      },
    });

    // Create a Supabase client configured to use cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    // Get the user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.warn('Middleware: Session fetch error:', sessionError.message);
    }

    const { pathname } = req.nextUrl;

    // Define path categories
    const publicPaths = [
      '/auth/login',
      '/auth/register', 
      '/auth/forgot-password',
      '/auth/verify',
      '/auth/reset-password'
    ];
    
    const alwaysAccessiblePaths = [
      '/',
      '/test-db',
      '/test-auth',
      '/api',
      '/_next',
      '/favicon.ico'
    ];

    // Define paths that require business role
    const businessPaths = [
      '/dashboard'
    ];

    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
    const isAlwaysAccessible = alwaysAccessiblePaths.some(path => 
      pathname === path || pathname.startsWith(path)
    );
    const isBusinessPath = businessPaths.some(path => pathname.startsWith(path));

    // Case 1: User is not authenticated
    if (!session) {
      // Allow access to public and always accessible paths
      if (isPublicPath || isAlwaysAccessible) {
        return response;
      }
      
      // Redirect to login for protected routes
      const redirectUrl = new URL('/auth/login', req.url);
      redirectUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Case 2: User is authenticated
    if (session.user) {
      // Get user role from the database
      let userRole = 'customer';
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();
          
        if (!userError && userData) {
          userRole = userData.role || 'customer';
        }
      } catch (error) {
        console.warn('Could not fetch user role:', error);
      }

      // Redirect authenticated users away from auth pages
      if (isPublicPath) {
        const redirectUrl = new URL(userRole === 'business' ? '/dashboard' : '/', req.url);
        return NextResponse.redirect(redirectUrl);
      }
      
      // Check if user has access to business paths
      if (isBusinessPath && userRole !== 'business') {
        const redirectUrl = new URL('/', req.url);
        return NextResponse.redirect(redirectUrl);
      }
      
      // Allow access to all other routes
      return response;
    }

    // Fallback: Allow the request to proceed
    return response;

  } catch (error) {
    console.error('Middleware error:', error);
    
    // In case of error, allow the request to proceed
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};