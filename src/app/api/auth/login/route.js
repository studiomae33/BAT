import { NextResponse } from 'next/server';
import { CONFIG, generateAuthToken, verifyPassword, hashPassword } from '@/lib/auth';

/**
 * API de connexion admin
 * POST /api/auth/login
 */
export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    // Validation des champs
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }
    
    // Vérification des identifiants admin
    // Note: Dans un vrai projet, les identifiants seraient hachés en base
    if (email === CONFIG.ADMIN_EMAIL && password === CONFIG.ADMIN_PASSWORD) {
      const token = generateAuthToken(email);
      
      const response = NextResponse.json({ 
        success: true, 
        message: 'Connexion réussie' 
      });
      
      // Définir le cookie JWT
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 heures
        path: '/',
      });
      
      return response;
    } else {
      return NextResponse.json(
        { error: 'Identifiants incorrects' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Erreur login:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
