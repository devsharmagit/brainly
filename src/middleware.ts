import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt';

 

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    console.log({token, url})

    // user is logged but on landing page
    if(token && url.pathname === "/" ){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // user is not logged in but on dashboard page
    if(!token && url.pathname.includes("dashboard")){
        return NextResponse.redirect(new URL('/', request.url))
    }
}
 

export const config = {
  matcher: ['/', '/dashboar', '/dashboard/:path*'],
}