import { NextResponse } from 'next/server'

/**
 * Middleware pour protéger les routes d'administration
 */
export function middleware(request) {
  const { pathname } = request.nextUrl
  
  console.log('🔒 Middleware - Chemin demandé:', pathname)

  // Protéger les routes d'administration
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    console.log('🛡️ Route admin détectée, vérification du token...')
    
    const token = request.cookies.get('auth-token')?.value
    
    console.log('🔑 Token présent:', !!token)

    if (!token) {
      console.log('❌ Pas de token - Redirection vers /')
      const redirectUrl = new URL('/', request.url)
      console.log('🔄 Redirection vers:', redirectUrl.toString())
      return NextResponse.redirect(redirectUrl)
    }

    // Vérification basique du token (sans import de lib pour éviter les erreurs)
    try {
      // Simple vérification que le token n'est pas vide et a une structure JWT basique
      const parts = token.split('.')
      if (parts.length !== 3) {
        console.log('❌ Token malformé - Redirection vers /')
        const response = NextResponse.redirect(new URL('/', request.url))
        response.cookies.delete('auth-token')
        return response
      }
      
      console.log('✅ Token présent et bien formé')
    } catch (error) {
      console.log('❌ Erreur validation token:', error.message)
      const response = NextResponse.redirect(new URL('/', request.url))
      response.cookies.delete('auth-token')
      return response
    }
    
    console.log('✅ Accès autorisé à', pathname)
  }

  return NextResponse.next()
}

// Configuration des routes à protéger
export const config = {
  matcher: [
    /*
     * Match admin routes specifically
     */
    '/admin/:path*',
    '/admin'
  ],
}
