/**
 * Service email côté client - EmailJS uniquement
 */

/**
 * Détecte si EmailJS est configuré côté client
 */
function getClientEmailService() {
  const hasEmailJS = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID && 
                     process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  
  return hasEmailJS ? 'emailjs' : 'none';
}

/**
 * Envoie un email BAT côté client (EmailJS uniquement)
 */
export async function sendBATEmailClient(recipientEmail, batToken, customMessage, originalFileName) {
  const service = getClientEmailService();
  
  if (service !== 'emailjs') {
    throw new Error('EmailJS non configuré');
  }

  // Import dynamique pour éviter les erreurs SSR
  const { sendBATEmailJS, initEmailJS } = await import('./emailjs-service');
  
  // Initialiser EmailJS
  initEmailJS();
  
  return await sendBATEmailJS(recipientEmail, batToken, customMessage, originalFileName);
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
  const service = getClientEmailService();
  
  if (service === 'none') {
    return { 
      success: false, 
      error: 'EmailJS non configuré',
      service: 'none' 
    };
  }

  try {
    // Test avec des données fictives
    const result = await sendBATEmailClient(
      'test@example.com',
      'test-token-123',
      'Test de configuration email du système BAT',
      'test-document.pdf'
    );
    
    return { 
      success: result.success, 
      service: 'emailjs',
      error: result.error 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      service: 'emailjs' 
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
