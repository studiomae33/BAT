import { NextResponse } from 'next/server'
import { verifyAuthToken } from './src/lib/auth.js'

/**
 * Middleware pour protéger les routes d'administration
 */
export function middleware(request) {
  const { pathname } = request.nextUrl

  // Protéger les routes d'administration
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value

    if (!token || !verifyAuthToken(token)) {
      // Redirection vers la page d'accueil (qui est maintenant le login) si non authentifié
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

// Configuration des routes à protéger
export const config = {
  matcher: ['/admin/:path*']
}
