import emailjs from '@emailjs/browser';

/**
 * Configuration EmailJS
 * À configurer sur https://www.emailjs.com/
 */
const EMAILJS_CONFIG = {
  SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'your_service_id',
  TEMPLATE_ID_BAT: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_BAT || 'template_bat',
  TEMPLATE_ID_VALIDATION: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_VALIDATION || 'template_validation',
  TEMPLATE_ID_REJECTION: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_REJECTION || 'template_rejection',
  PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'your_public_key',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'thomas@guy.fr'
};

/**
 * Initialise EmailJS avec la clé publique
 */
export function initEmailJS() {
  if (typeof window !== 'undefined') {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }
}

/**
 * Envoie un email avec le lien BAT au client
 */
export async function sendBATEmailJS(recipientEmail, batToken, customMessage, originalFileName) {
  const batUrl = `${window.location.origin}/bat/${batToken}`;
  
  const templateParams = {
    to_email: recipientEmail,
    admin_email: EMAILJS_CONFIG.ADMIN_EMAIL,
    bat_url: batUrl,
    custom_message: customMessage,
    file_name: originalFileName,
    expiration_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')
  };

  try {
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID_BAT,
      templateParams
    );
    
    console.log('✅ Email BAT envoyé:', response);
    return { success: true, response };
  } catch (error) {
    console.error('❌ Erreur envoi email BAT:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Envoie une notification de validation à l'admin
 */
export async function sendValidationNotificationEmailJS(batData) {
  const templateParams = {
    to_email: EMAILJS_CONFIG.ADMIN_EMAIL,
    client_email: batData.recipientEmail,
    file_name: batData.originalName,
    validation_date: new Date().toLocaleDateString('fr-FR'),
    validation_time: new Date().toLocaleTimeString('fr-FR')
  };

  try {
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID_VALIDATION,
      templateParams
    );
    
    console.log('✅ Notification validation envoyée:', response);
    return { success: true, response };
  } catch (error) {
    console.error('❌ Erreur notification validation:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Envoie une notification de rejet à l'admin
 */
export async function sendRejectionNotificationEmailJS(batData, rejectionMessage) {
  const templateParams = {
    to_email: EMAILJS_CONFIG.ADMIN_EMAIL,
    client_email: batData.recipientEmail,
    file_name: batData.originalName,
    rejection_message: rejectionMessage,
    rejection_date: new Date().toLocaleDateString('fr-FR'),
    rejection_time: new Date().toLocaleTimeString('fr-FR')
  };

  try {
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID_REJECTION,
      templateParams
    );
    
    console.log('✅ Notification rejet envoyée:', response);
    return { success: true, response };
  } catch (error) {
    console.error('❌ Erreur notification rejet:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Templates EmailJS suggérés (à créer sur emailjs.com)
 */
export const EMAIL_TEMPLATES = {
  BAT: {
    name: 'Template BAT Client',
    subject: 'BAT à valider - {{file_name}}',
    content: `
Bonjour,

Vous avez reçu un BAT (Bon À Tirer) à valider pour le fichier : {{file_name}}

Message personnel :
{{custom_message}}

🔗 Lien de validation : {{bat_url}}

Ce lien expire le {{expiration_date}}.

Cordialement,
{{admin_email}}
    `
  },
  
  VALIDATION: {
    name: 'Notification Validation Admin',
    subject: '✅ BAT Validé - {{file_name}}',
    content: `
Le BAT a été validé !

📄 Fichier : {{file_name}}
👤 Client : {{client_email}}
📅 Date : {{validation_date}} à {{validation_time}}

Le client a validé le BAT.
    `
  },
  
  REJECTION: {
    name: 'Notification Rejet Admin',
    subject: '❌ BAT Rejeté - {{file_name}}',
    content: `
Le BAT a été rejeté.

📄 Fichier : {{file_name}}
👤 Client : {{client_email}}
📅 Date : {{rejection_date}} à {{rejection_time}}

💬 Message du client :
{{rejection_message}}
    `
  }
};

console.log('📧 EmailJS configuré pour:', {
  service: EMAILJS_CONFIG.SERVICE_ID,
  admin: EMAILJS_CONFIG.ADMIN_EMAIL
});
