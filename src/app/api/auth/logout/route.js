import { NextResponse } from 'next/server';

/**
 * API de déconnexion admin
 * POST /api/auth/logout
 */
export async function POST() {
  const response = NextResponse.json({ 
    success: true, 
    message: 'Déconnexion réussie' 
  });
  
  // Supprimer le cookie d'authentification
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  });
  
  return response;
}
