#!/usr/bin/env node

/**
 * Test direct EmailJS en local avec vos vraies credentials
 */

console.log('🧪 Test EmailJS direct avec service_xb0o03d\n');

// Configuration exacte
const config = {
  serviceId: 'service_xb0o03d',
  publicKey: 'TNl3r0YjPN8-uGT_f',
  templateId: 'template_wvesgq6'
};

console.log('🔧 Configuration utilisée:');
console.log(`   Service ID: ${config.serviceId}`);
console.log(`   Public Key: ${config.publicKey}`);
console.log(`   Template ID: ${config.templateId}\n`);

// Simuler un test EmailJS côté serveur (pour debug)
async function testEmailJSConfig() {
  try {
    // Simulation d'un appel EmailJS
    console.log('📡 Simulation test EmailJS...');
    
    const testParams = {
      to_email: 'test@example.com',
      admin_email: 'contact@studiomae.fr',
      bat_url: 'https://example.com/test',
      custom_message: 'Test de configuration',
      file_name: 'test.pdf',
      expiration_date: new Date().toLocaleDateString('fr-FR')
    };
    
    console.log('📝 Paramètres de test:', JSON.stringify(testParams, null, 2));
    
    // Instructions pour test manuel
    console.log('\n🎯 ÉTAPES DE VALIDATION MANUELLE:');
    console.log('1. Allez sur: https://dashboard.emailjs.com/admin');
    console.log('2. Vérifiez que le service "service_xb0o03d" existe');
    console.log('3. Vérifiez que le template "template_wvesgq6" existe');
    console.log('4. Testez directement depuis le dashboard EmailJS');
    
    console.log('\n🔍 VÉRIFICATIONS À FAIRE:');
    console.log('- Le service email est-il actif ?');
    console.log('- Y a-t-il des erreurs dans les logs EmailJS ?');
    console.log('- Le compte EmailJS est-il en règle (quota, paiement) ?');
    console.log('- Les templates ont-ils les bonnes variables ?');
    
    console.log('\n⚠️  PROBLÈMES POSSIBLES:');
    console.log('- Service suspendu pour quota dépassé');
    console.log('- Service supprimé ou désactivé');
    console.log('- Problème de synchronisation dashboard/API');
    console.log('- Erreur de frappe dans les IDs');
    
    console.log('\n🚀 SOLUTION RAPIDE:');
    console.log('Si le service existe mais ne fonctionne pas:');
    console.log('1. Créez un nouveau service de test');
    console.log('2. Utilisez ce nouveau Service ID');
    console.log('3. Testez avec notre page /test-service-id');
    
  } catch (error) {
    console.error('❌ Erreur test:', error);
  }
}

testEmailJSConfig();
