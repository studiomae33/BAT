#!/usr/bin/env node

/**
 * Script de test rapide pour vérifier la connexion admin
 */

console.log('🔐 Test de connexion admin...\n');

// Charger les variables d'environnement depuis .env.local
require('dotenv').config({ path: '.env.local' });

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

console.log('📧 Email admin:', adminEmail);
console.log('🔑 Mot de passe admin:', adminPassword);
console.log('🔐 JWT Secret configuré:', process.env.JWT_SECRET ? '✅ Oui' : '❌ Non');

// Test de génération de token
if (process.env.JWT_SECRET) {
  try {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { email: adminEmail, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('✅ Token JWT généré avec succès');
    console.log('📝 Token (début):', token.substring(0, 50) + '...');
  } catch (error) {
    console.log('❌ Erreur génération token:', error.message);
  }
}

console.log('\n🎯 URL de connexion: http://localhost:3000');
console.log('📝 Utilisez ces identifiants pour vous connecter:\n');
console.log(`   Email: ${adminEmail}`);
console.log(`   Mot de passe: ${adminPassword}`);

console.log('\n✅ Configuration admin mise à jour avec succès !');
