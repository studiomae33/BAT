import { NextResponse } from 'next/server'

export function middleware(request) {
  console.log('🔥 MIDDLEWARE ACTIVÉ - URL:', request.url)
  console.log('🔥 MIDDLEWARE ACTIVÉ - PATHNAME:', request.nextUrl.pathname)
  
  const pathname = request.nextUrl.pathname
  
  // Test simple : redirection de /admin vers /
  if (pathname === '/admin') {
    console.log('🚨 REDIRECTION DE /admin VERS /')
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  console.log('✅ Passage normal pour:', pathname)
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin']
}
