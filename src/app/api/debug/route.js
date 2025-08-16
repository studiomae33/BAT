// Debug endpoint temporaire - À SUPPRIMER après test
import { NextResponse } from 'next/server'

export async function GET() {
  // NE JAMAIS exposer les mots de passe en production !
  // Ceci est un debug temporaire
  
  const adminEmail = process.env.ADMIN_EMAIL
  const hasPassword = !!process.env.ADMIN_PASSWORD
  const hasJWT = !!process.env.JWT_SECRET
  
  // Logs côté serveur pour debug
  console.log('🔍 DEBUG - Variables d\'environnement:')
  console.log('ADMIN_EMAIL:', adminEmail)
  console.log('ADMIN_PASSWORD exists:', hasPassword)
  console.log('ADMIN_PASSWORD length:', process.env.ADMIN_PASSWORD?.length)
  console.log('JWT_SECRET exists:', hasJWT)
  
  return NextResponse.json({
    debug: true,
    adminEmail,
    hasPassword,
    passwordLength: process.env.ADMIN_PASSWORD?.length || 0,
    hasJWT,
    env: process.env.NODE_ENV
  })
}
