/**
 * Service email hybride - Support EmailJS et SMTP
 */

// Import conditionnel pour éviter les erreurs côté serveur
const isClient = typeof window !== 'undefined';

/**
 * Détecte quel service email utiliser
 */
function getEmailService() {
  const hasEmailJS = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID && 
                     process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  const hasSMTP = process.env.EMAIL_HOST && 
                  process.env.EMAIL_USER && 
                  process.env.EMAIL_PASS;

  if (hasEmailJS && isClient) {
    return 'emailjs';
  } else if (hasSMTP) {
    return 'smtp';
  } else {
    return 'none';
  }
}

/**
 * Envoie un email BAT (version hybride)
 */
export async function sendBATEmail(recipientEmail, batToken, customMessage, originalFileName) {
  const service = getEmailService();
  
  console.log('📧 Service email détecté:', service);
  
  switch (service) {
    case 'emailjs':
      if (isClient) {
        const { sendBATEmailJS } = await import('./emailjs-service');
        return await sendBATEmailJS(recipientEmail, batToken, customMessage, originalFileName);
      }
      throw new Error('EmailJS uniquement disponible côté client');
      
    case 'smtp':
      const { sendBATEmail: sendSMTP } = await import('./email');
      return await sendSMTP(recipientEmail, batToken, customMessage);
      
    default:
      console.warn('⚠️ Aucun service email configuré');
      return { 
        success: false, 
        error: 'Aucun service email configuré. Configurez EmailJS ou SMTP.' 
      };
  }
}

/**
 * Envoie une notification de validation
 */
export async function sendValidationNotification(batData) {
  const service = getEmailService();
  
  switch (service) {
    case 'emailjs':
      if (isClient) {
        const { sendValidationNotificationEmailJS } = await import('./emailjs-service');
        return await sendValidationNotificationEmailJS(batData);
      }
      throw new Error('EmailJS uniquement disponible côté client');
      
    case 'smtp':
      const { sendValidationEmail } = await import('./email');
      return await sendValidationEmail(batData);
      
    default:
      console.warn('⚠️ Aucun service email configuré pour les notifications');
      return { success: false, error: 'Service email non configuré' };
  }
}

/**
 * Envoie une notification de rejet
 */
export async function sendRejectionNotification(batData, rejectionMessage) {
  const service = getEmailService();
  
  switch (service) {
    case 'emailjs':
      if (isClient) {
        const { sendRejectionNotificationEmailJS } = await import('./emailjs-service');
        return await sendRejectionNotificationEmailJS(batData, rejectionMessage);
      }
      throw new Error('EmailJS uniquement disponible côté client');
      
    case 'smtp':
      const { sendRejectionEmail } = await import('./email');
      return await sendRejectionEmail(batData, rejectionMessage);
      
    default:
      console.warn('⚠️ Aucun service email configuré pour les notifications');
      return { success: false, error: 'Service email non configuré' };
  }
}

/**
 * Guide de configuration EmailJS
 */
export const EMAILJS_SETUP_GUIDE = {
  steps: [
    '1. Créez un compte sur https://www.emailjs.com/',
    '2. Créez un service email (Gmail, Outlook, etc.)',
    '3. Créez les templates email avec les variables',
    '4. Copiez vos IDs dans les variables d\'environnement',
    '5. Testez l\'envoi depuis l\'interface admin'
  ],
  
  templates: [
    {
      name: 'template_bat',
      variables: ['to_email', 'bat_url', 'custom_message', 'file_name', 'expiration_date']
    },
    {
      name: 'template_validation', 
      variables: ['to_email', 'client_email', 'file_name', 'validation_date']
    },
    {
      name: 'template_rejection',
      variables: ['to_email', 'client_email', 'file_name', 'rejection_message']
    }
  ]
};

console.log('🔧 Email Service Hybride initialisé:', {
  service: getEmailService(),
  isClient,
  hasEmailJS: !!process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  hasSMTP: !!process.env.EMAIL_HOST
});
