/**
 * Test de diagnostic EmailJS - à exécuter en local et en production
 */

// Simuler les variables d'environnement comme elles seraient en production
const mockEnvVars = {
  NEXT_PUBLIC_EMAILJS_SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
  NEXT_PUBLIC_EMAILJS_TEMPLATE_BAT: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_BAT,
  NEXT_PUBLIC_EMAILJS_TEMPLATE_VALIDATION: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_VALIDATION,
  NEXT_PUBLIC_EMAILJS_TEMPLATE_REJECTION: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_REJECTION,
};

console.log('🔍 Diagnostic EmailJS Configuration');
console.log('=====================================');

// Vérifier les variables d'environnement
console.log('Variables d\'environnement:');
Object.entries(mockEnvVars).forEach(([key, value]) => {
  console.log(`${key}: ${value ? `✅ [${value.substring(0, 10)}...]` : '❌ MANQUANT'}`);
});

// Test de la fonction getClientEmailService
function testGetClientEmailService() {
  const hasEmailJS = mockEnvVars.NEXT_PUBLIC_EMAILJS_SERVICE_ID && 
                     mockEnvVars.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  
  console.log('\n🧪 Test getClientEmailService:');
  console.log(`hasEmailJS: ${hasEmailJS}`);
  console.log(`Service détecté: ${hasEmailJS ? 'emailjs' : 'none'}`);
  
  return hasEmailJS ? 'emailjs' : 'none';
}

// Test de la configuration
function testEmailConfiguration() {
  console.log('\n🔧 Test configuration EmailJS:');
  
  const service = testGetClientEmailService();
  
  if (service === 'none') {
    return { 
      success: false, 
      error: 'EmailJS non configuré - Variables d\'environnement manquantes',
      service: 'none',
      debug: mockEnvVars
    };
  }

  // Vérifier que les variables sont bien présentes
  const serviceId = mockEnvVars.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const publicKey = mockEnvVars.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  const templateBAT = mockEnvVars.NEXT_PUBLIC_EMAILJS_TEMPLATE_BAT;
  
  if (!serviceId || !publicKey || !templateBAT) {
    return {
      success: false,
      error: 'Variables EmailJS incomplètes',
      service: 'emailjs',
      debug: {
        hasServiceId: !!serviceId,
        hasPublicKey: !!publicKey,
        hasTemplate: !!templateBAT,
        values: mockEnvVars
      }
    };
  }
  
  return { 
    success: true, 
    service: 'emailjs',
    message: 'Configuration EmailJS valide',
    debug: {
      hasServiceId: !!serviceId,
      hasPublicKey: !!publicKey,
      hasTemplate: !!templateBAT
    }
  };
}

// Exécuter les tests
const result = testEmailConfiguration();

console.log('\n📊 Résultat du test:');
console.log(JSON.stringify(result, null, 2));

console.log('\n🎯 Recommandations:');
if (!result.success) {
  console.log('❌ Configuration EmailJS échouée');
  console.log('1. Vérifier que toutes les variables NEXT_PUBLIC_EMAILJS_* sont définies');
  console.log('2. Redéployer l\'application après avoir configuré les variables');
  console.log('3. Vérifier que les variables sont bien accessibles côté client');
} else {
  console.log('✅ Configuration EmailJS OK - le problème est ailleurs');
  console.log('1. Vérifier la librairie @emailjs/browser');
  console.log('2. Vérifier les permissions CORS sur EmailJS');
  console.log('3. Tester l\'initialisation EmailJS en production');
}
