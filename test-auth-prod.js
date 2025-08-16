/**
 * 🔍 Test d'authentification en production
 * Vérifie si l'authentification fonctionne avec les mêmes identifiants
 */

const https = require('https');

console.log('🔍 Test d\'authentification en production\n');

const prodUrl = 'bat-orcin.vercel.app';
const credentials = {
  email: 'thomas@guy.fr',
  password: 'antoinelebg'
};

function testAuth() {
  console.log('📡 Test de connexion à: https://' + prodUrl);
  console.log('📧 Email:', credentials.email);
  console.log('🔐 Mot de passe:', credentials.password);
  console.log('');

  const postData = JSON.stringify(credentials);
  
  const options = {
    hostname: prodUrl,
    port: 443,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(options, (res) => {
    console.log('📊 Status HTTP:', res.statusCode);
    console.log('📋 Headers:', res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        console.log('📄 Réponse:', jsonData);
        
        if (res.statusCode === 200) {
          console.log('✅ AUTHENTIFICATION RÉUSSIE !');
          console.log('🔑 Token reçu:', !!jsonData.token);
        } else {
          console.log('❌ AUTHENTIFICATION ÉCHOUÉE');
          console.log('⚠️ Erreur:', jsonData.error || 'Erreur inconnue');
        }
      } catch (err) {
        console.log('📄 Réponse brute:', data);
        console.log('💥 Erreur parsing JSON:', err.message);
      }
    });
  });

  req.on('error', (error) => {
    console.log('💥 ERREUR DE CONNEXION:', error.message);
  });

  req.write(postData);
  req.end();
}

testAuth();
