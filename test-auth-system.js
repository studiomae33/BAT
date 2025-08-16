#!/usr/bin/env node

/**
 * Script de test complet pour le système d'authentification
 */

console.log('🔐 Test complet du système d\'authentification BAT\n');

const BASE_URL = 'http://localhost:3000';

// Test 1: Accès sans authentification à /admin
async function testUnauthenticatedAccess() {
  console.log('📋 Test 1: Accès non authentifié à /admin');
  
  try {
    const response = await fetch(`${BASE_URL}/admin`, {
      redirect: 'manual' // Ne pas suivre les redirections automatiquement
    });
    
    console.log('   Status:', response.status);
    console.log('   Headers Location:', response.headers.get('location'));
    
    if (response.status === 302 || response.status === 307) {
      console.log('   ✅ Redirection détectée (middleware fonctionne)');
    } else if (response.status === 200) {
      console.log('   ⚠️  Pas de redirection (protection côté client uniquement)');
    } else {
      console.log('   ❌ Comportement inattendu');
    }
  } catch (error) {
    console.log('   ❌ Erreur:', error.message);
  }
}

// Test 2: API de vérification sans token
async function testVerifyAPI() {
  console.log('\n📋 Test 2: API de vérification sans token');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/verify`);
    const status = response.status;
    
    console.log('   Status:', status);
    
    if (status === 401) {
      console.log('   ✅ API refuse l\'accès sans token');
    } else {
      console.log('   ❌ API devrait refuser l\'accès');
    }
  } catch (error) {
    console.log('   ❌ Erreur:', error.message);
  }
}

// Test 3: Connexion avec les bons identifiants
async function testLogin() {
  console.log('\n📋 Test 3: Connexion avec identifiants valides');
  
  const credentials = {
    email: process.env.ADMIN_EMAIL || 'thomas@guy.fr',
    password: process.env.ADMIN_PASSWORD || 'antoinelebg'
  };
  
  console.log(`   Email: ${credentials.email}`);
  console.log(`   Password: ${credentials.password}`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    console.log('   Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Connexion réussie');
      
      // Extraire le cookie de session
      const setCookieHeader = response.headers.get('set-cookie');
      if (setCookieHeader && setCookieHeader.includes('auth-token')) {
        console.log('   ✅ Token d\'authentification reçu');
        return setCookieHeader;
      } else {
        console.log('   ⚠️  Token manquant dans la réponse');
      }
    } else {
      const error = await response.json();
      console.log('   ❌ Échec de la connexion:', error.error);
    }
  } catch (error) {
    console.log('   ❌ Erreur:', error.message);
  }
  
  return null;
}

// Test 4: Vérification avec token valide
async function testVerifyWithToken(cookie) {
  if (!cookie) return;
  
  console.log('\n📋 Test 4: Vérification avec token valide');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/verify`, {
      headers: {
        'Cookie': cookie
      }
    });
    
    console.log('   Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Token valide, utilisateur:', data.user.email);
    } else {
      console.log('   ❌ Token rejeté');
    }
  } catch (error) {
    console.log('   ❌ Erreur:', error.message);
  }
}

// Test 5: Configuration des services email
async function testEmailServiceConfig() {
  console.log('\n📋 Test 5: Configuration des services email');
  
  const hasEmailJS = !!(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID && 
                        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);
  const hasSMTP = !!(process.env.EMAIL_HOST && 
                     process.env.EMAIL_USER && 
                     process.env.EMAIL_PASS);
  
  console.log('   EmailJS configuré:', hasEmailJS ? '✅' : '❌');
  console.log('   SMTP configuré:', hasSMTP ? '✅' : '❌');
  
  if (!hasEmailJS && !hasSMTP) {
    console.log('   ⚠️  Aucun service email configuré - Les notifications ne fonctionneront pas');
  } else {
    console.log('   ✅ Au moins un service email est disponible');
  }
}

// Exécuter tous les tests
async function runAllTests() {
  console.log('🚀 Serveur de test:', BASE_URL);
  console.log('📅 Date:', new Date().toLocaleDateString('fr-FR'));
  console.log('=' .repeat(60));
  
  await testUnauthenticatedAccess();
  await testVerifyAPI();
  
  const cookie = await testLogin();
  await testVerifyWithToken(cookie);
  
  await testEmailServiceConfig();
  
  console.log('\n' + '='.repeat(60));
  console.log('🎯 Tests terminés !');
  console.log('\n💡 Pour tester l\'interface:');
  console.log('   1. Ouvrez http://localhost:3000');
  console.log('   2. Connectez-vous avec thomas@guy.fr / antoinelebg');
  console.log('   3. Essayez d\'accéder à http://localhost:3000/admin');
  console.log('\n📧 Pour configurer les emails:');
  console.log('   - EmailJS: Voir CONFIGURATION-EMAILJS.md');
  console.log('   - SMTP: Configurez les variables EMAIL_* dans .env.local');
}

// Charger les variables d'environnement si disponible
try {
  require('dotenv').config({ path: '.env.local' });
} catch (error) {
  console.log('⚠️  dotenv non disponible, utilisation des variables par défaut');
}

runAllTests().catch(console.error);
