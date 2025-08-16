/**
 * Service email côté client - EmailJS uniquement
 */

/**
 * Détecte si EmailJS est configuré côté client
 */
function getClientEmailService() {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  
  console.log('🔍 Debug getClientEmailService:', {
    serviceId: serviceId ? `${serviceId.substring(0, 8)}...` : 'UNDEFINED',
    publicKey: publicKey ? `${publicKey.substring(0, 8)}...` : 'UNDEFINED',
    hasServiceId: !!serviceId,
    hasPublicKey: !!publicKey
  });
  
  const hasEmailJS = serviceId && publicKey;
  
  return hasEmailJS ? 'emailjs' : 'none';
}

/**
 * Envoie un email BAT côté client (EmailJS uniquement)
 * @param {string} recipientEmail - Email du destinataire
 * @param {string} batToken - Token du BAT
 * @param {string} customMessage - Message personnalisé
 * @param {string} originalFileName - Nom du fichier
 * @param {string} templateId - ID du template EmailJS (optionnel)
 * @param {object} templateParams - Paramètres supplémentaires pour le template (optionnel)
 */
export async function sendBATEmailClient(recipientEmail, batToken, customMessage, originalFileName, templateId = null, templateParams = {}) {
  console.log('🚀 sendBATEmailClient appelé avec:', {
    recipientEmail,
    hasToken: !!batToken,
    tokenLength: batToken?.length,
    hasMessage: !!customMessage,
    fileName: originalFileName,
    templateId,
    hasTemplateParams: !!templateParams && Object.keys(templateParams).length > 0,
    templateParamsKeys: Object.keys(templateParams),
    timestamp: new Date().toISOString()
  });

  const service = getClientEmailService();
  console.log('📧 Service email détecté:', service);
  
  if (service !== 'emailjs') {
    const error = 'EmailJS non configuré - variables d\'environnement manquantes';
    console.error('❌', error);
    throw new Error(error);
  }

  try {
    console.log('📦 Import dynamique du service EmailJS...');
    // Import dynamique pour éviter les erreurs SSR
    const { sendBATEmailJS, initEmailJS } = await import('./emailjs-service');
    
    console.log('🔧 Initialisation EmailJS...');
    // Initialiser EmailJS
    try {
      initEmailJS();
      console.log('✅ EmailJS initialisé avec succès');
    } catch (initError) {
      console.error('❌ Erreur initialisation EmailJS:', initError);
      throw new Error(`Erreur initialisation EmailJS: ${initError.message}`);
    }
    
    // Petit délai pour s'assurer de l'initialisation
    console.log('⏳ Délai d\'initialisation...');
    await new Promise(resolve => setTimeout(resolve, 200));
    
    console.log('📧 Appel sendBATEmailJS avec template personnalisé...');
    const result = await sendBATEmailJS(recipientEmail, batToken, customMessage, originalFileName, templateId, templateParams);
    
    console.log('📧 Résultat sendBATEmailJS:', result);
    console.log('📧 Type de résultat:', typeof result);
    
    if (!result) {
      console.error('❌ sendBATEmailJS a retourné undefined/null');
      return {
        success: false,
        error: 'sendBATEmailJS a retourné une valeur invalide (undefined/null)',
        details: {
          timestamp: new Date().toISOString(),
          service: 'emailjs'
        }
      };
    }
    
    // S'assurer que le résultat a la structure attendue
    if (typeof result !== 'object' || typeof result.success !== 'boolean') {
      console.error('❌ sendBATEmailJS a retourné un format invalide:', result);
      return {
        success: false,
        error: 'sendBATEmailJS a retourné un format invalide',
        details: {
          timestamp: new Date().toISOString(),
          service: 'emailjs',
          actualResult: result
        }
      };
    }
    
    return result;
  } catch (error) {
    console.error('❌ Erreur dans sendBATEmailClient:', error);
    console.error('❌ Stack trace:', error.stack);
    
    // S'assurer qu'on retourne un objet d'erreur properly formaté
    const errorMessage = error?.message || error?.text || error?.toString?.() || 'Erreur inconnue lors de l\'envoi';
    
    // Ne pas throw, retourner l'erreur pour que l'UI puisse l'afficher
    return {
      success: false,
      error: errorMessage,
      details: {
        originalError: error,
        timestamp: new Date().toISOString(),
        service: 'emailjs'
      }
    };
  }
}

/**
 * Envoie une notification de validation côté client
 */
export async function sendValidationNotificationClient(batData) {
  const service = getClientEmailService();
  
  if (service !== 'emailjs') {
    throw new Error('EmailJS non configuré');
  }

  const { sendValidationNotificationEmailJS, initEmailJS } = await import('./emailjs-service');
  
  initEmailJS();
  
  return await sendValidationNotificationEmailJS(batData);
}

/**
 * Envoie une notification de rejet côté client
 */
export async function sendRejectionNotificationClient(batData, rejectionMessage) {
  const service = getClientEmailService();
  
  if (service !== 'emailjs') {
    throw new Error('EmailJS non configuré');
  }

  const { sendRejectionNotificationEmailJS, initEmailJS } = await import('./emailjs-service');
  
  initEmailJS();
  
  return await sendRejectionNotificationEmailJS(batData, rejectionMessage);
}

/**
 * Teste la configuration email côté client
 */
export async function testEmailServiceClient() {
  console.log('🧪 Début test EmailJS...');
  
  const service = getClientEmailService();
  console.log('🎯 Service détecté:', service);
  
  if (service === 'none') {
    console.log('❌ Service non configuré');
    return { 
      success: false, 
      error: 'EmailJS non configuré - Variables d\'environnement manquantes',
      service: 'none',
      debug: {
        serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
        templateBAT: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_BAT
      }
    };
  }

  try {
    console.log('🔄 Import du service EmailJS...');
    // Test de configuration EmailJS simple (sans envoi d'email)
    const { initEmailJS } = await import('./emailjs-service');
    
    console.log('🔧 Initialisation EmailJS...');
    // Initialiser EmailJS et vérifier la configuration
    initEmailJS();
    
    // Vérifier que les variables sont bien présentes
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    const templateBAT = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_BAT;
    
    console.log('✅ Vérification des variables:', {
      hasServiceId: !!serviceId,
      hasPublicKey: !!publicKey,
      hasTemplate: !!templateBAT
    });
    
    if (!serviceId || !publicKey || !templateBAT) {
      console.log('❌ Variables incomplètes');
      return {
        success: false,
        error: 'Variables EmailJS incomplètes',
        service: 'emailjs',
        debug: {
          hasServiceId: !!serviceId,
          hasPublicKey: !!publicKey,
          hasTemplate: !!templateBAT,
          values: {
            serviceId: serviceId || 'UNDEFINED',
            publicKey: publicKey || 'UNDEFINED',
            templateBAT: templateBAT || 'UNDEFINED'
          }
        }
      };
    }
    
    console.log('✅ Test EmailJS réussi !');
    return { 
      success: true, 
      service: 'emailjs',
      message: 'Configuration EmailJS valide'
    };
  } catch (error) {
    console.error('❌ Erreur test EmailJS:', error);
    return { 
      success: false, 
      error: error.message,
      service: 'emailjs',
      stack: error.stack
    };
  }
}

/**
 * Informations sur la configuration email côté client
 */
export function getEmailServiceInfo() {
  const service = getClientEmailService();
  
  return {
    service,
    isConfigured: service !== 'none',
    type: service === 'emailjs' ? 'EmailJS (Client-side)' : 'Non configuré',
    capabilities: service === 'emailjs' ? ['Envoi BAT', 'Notifications'] : []
  };
}

console.log('📧 Email Client Service initialisé:', getEmailServiceInfo());
