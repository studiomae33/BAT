import { NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';

/**
 * API pour vérifier l'authentification
 * GET /api/auth/verify
 */
export async function GET(request) {
  try {
    // Récupérer le token depuis les cookies
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Token manquant' },
        { status: 401 }
      );
    }

    // Vérifier la validité du token
    const decoded = verifyAuthToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    // Token valide
    return NextResponse.json({
      authenticated: true,
      user: {
        email: decoded.email,
        role: decoded.role
      }
    });

  } catch (error) {
    console.error('Erreur vérification auth:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
