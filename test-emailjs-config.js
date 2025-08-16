/**
 * 🧪 Script de test EmailJS
 * Permet de vérifier que la configuration EmailJS est correcte
 */

const fs = require('fs');
const path = require('path');

// Charger les variables d'environnement depuis .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  for (const line of lines) {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  }
}

console.log('🧪 Test de configuration EmailJS\n');

// Vérifier les variables d'environnement
const requiredVars = [
  'NEXT_PUBLIC_EMAILJS_SERVICE_ID',
  'NEXT_PUBLIC_EMAILJS_TEMPLATE_BAT', 
  'NEXT_PUBLIC_EMAILJS_TEMPLATE_VALIDATION',
  'NEXT_PUBLIC_EMAILJS_TEMPLATE_REJECTION',
  'NEXT_PUBLIC_EMAILJS_PUBLIC_KEY'
];

console.log('📋 Vérification des variables d\'environnement :');
let allConfigured = true;

for (const varName of requiredVars) {
  const value = process.env[varName];
  const isConfigured = value && value !== `VOTRE_${varName.split('_').pop()}_ICI` && !value.includes('your_');
  
  console.log(`${isConfigured ? '✅' : '❌'} ${varName}: ${isConfigured ? '✓ Configuré' : '⚠️  À configurer'}`);
  
  if (!isConfigured) {
    allConfigured = false;
  }
}

console.log('\n📊 Résultat de la vérification :');

if (allConfigured) {
  console.log('🎉 Toutes les variables EmailJS sont configurées !');
  console.log('\n🔧 Configuration détectée :');
  console.log(`   📧 Service ID: ${process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID}`);
  console.log(`   📝 Template BAT: ${process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_BAT}`);
  console.log(`   ✅ Template Validation: ${process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_VALIDATION}`);
  console.log(`   ❌ Template Rejet: ${process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_REJECTION}`);
  console.log(`   🔑 Public Key: ${process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY?.substring(0, 10)}...`);
  
  console.log('\n🚀 Prochaines étapes :');
  console.log('   1. Démarrez le serveur : npm run dev');
  console.log('   2. Allez sur http://localhost:3000');
  console.log('   3. Connectez-vous avec thomas@guy.fr / antoinelebg');
  console.log('   4. Testez l\'envoi d\'un BAT');
  
} else {
  console.log('⚠️  Configuration EmailJS incomplète');
  console.log('\n🔧 Actions requises :');
  console.log('   1. Allez sur https://www.emailjs.com/');
  console.log('   2. Créez votre compte et configurez vos services');  
  console.log('   3. Créez vos templates d\'email');
  console.log('   4. Mettez à jour le fichier .env.local avec vos vraies valeurs');
  console.log('   5. Relancez ce test : node test-emailjs-config.js');
  
  console.log('\n📖 Guide détaillé disponible dans : GUIDE-EMAILJS-SETUP.md');
}

console.log('\n' + '='.repeat(60));
