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
  ADMIN_EMAIL: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'contact@studiomae.fr'
};

/**
 * Initialise EmailJS avec la clé publique
 */
export function initEmailJS() {
  console.log('🔧 initEmailJS appelé');
  console.log('🌐 Environnement:', {
    isClient: typeof window !== 'undefined',
    hasWindow: !!window,
    windowOrigin: typeof window !== 'undefined' ? window.location?.origin : 'SERVER_SIDE'
  });

  if (typeof window !== 'undefined') {
    console.log('🔧 Initialisation EmailJS côté client avec:', {
      publicKey: EMAILJS_CONFIG.PUBLIC_KEY ? `${EMAILJS_CONFIG.PUBLIC_KEY.substring(0, 10)}...` : 'UNDEFINED',
      serviceId: EMAILJS_CONFIG.SERVICE_ID ? `${EMAILJS_CONFIG.SERVICE_ID.substring(0, 15)}...` : 'UNDEFINED',
      hasEmailJS: !!emailjs,
      emailJSType: typeof emailjs
    });
    
    if (!EMAILJS_CONFIG.PUBLIC_KEY) {
      const error = 'PUBLIC_KEY EmailJS non définie dans les variables d\'environnement';
      console.error('❌', error);
      throw new Error(error);
    }
    
    if (!emailjs) {
      const error = 'Librairie EmailJS non disponible - vérifiez l\'import';
      console.error('❌', error);
      throw new Error(error);
    }
    
    try {
      console.log('🔑 Appel emailjs.init...');
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
      console.log('✅ EmailJS initialisé avec succès');
      
      // Test que EmailJS est bien fonctionnel
      if (typeof emailjs.send !== 'function') {
        throw new Error('EmailJS.send n\'est pas une fonction après initialisation');
      }
      
      console.log('✅ EmailJS.send est disponible');
    } catch (error) {
      console.error('❌ Erreur initialisation EmailJS:', error);
      throw error;
    }
  } else {
    console.log('⚠️ initEmailJS appelé côté serveur - ignoré');
  }
}

/**
 * Envoie un email avec le lien BAT au client
 */
export async function sendBATEmailJS(recipientEmail, batToken, customMessage, originalFileName) {
  console.log('📧 Début sendBATEmailJS avec paramètres:', {
    recipientEmail,
    batToken: batToken ? `${batToken.substring(0, 20)}...` : 'UNDEFINED',
    originalFileName,
    hasCustomMessage: !!customMessage,
    windowOrigin: typeof window !== 'undefined' ? window.location.origin : 'SERVER_SIDE'
  });

  // Vérification côté client
  if (typeof window === 'undefined') {
    const errorMsg = 'sendBATEmailJS ne peut être appelé que côté client';
    console.error('❌', errorMsg);
    return { success: false, error: errorMsg };
  }

  // Vérification de la configuration avant tout
  console.log('🔧 Vérification de la configuration EmailJS:', {
    serviceId: EMAILJS_CONFIG.SERVICE_ID,
    templateId: EMAILJS_CONFIG.TEMPLATE_ID_BAT,
    publicKey: EMAILJS_CONFIG.PUBLIC_KEY ? `${EMAILJS_CONFIG.PUBLIC_KEY.substring(0, 10)}...` : 'UNDEFINED',
    adminEmail: EMAILJS_CONFIG.ADMIN_EMAIL
  });

  if (!EMAILJS_CONFIG.SERVICE_ID || !EMAILJS_CONFIG.TEMPLATE_ID_BAT || !EMAILJS_CONFIG.PUBLIC_KEY) {
    const errorMsg = `Configuration EmailJS incomplète: Service=${!!EMAILJS_CONFIG.SERVICE_ID}, Template=${!!EMAILJS_CONFIG.TEMPLATE_ID_BAT}, Key=${!!EMAILJS_CONFIG.PUBLIC_KEY}`;
    console.error('❌', errorMsg);
    return { success: false, error: errorMsg };
  }

  const batUrl = `${window.location.origin}/bat/${batToken}`;
  
  const templateParams = {
    to_email: recipientEmail,
    admin_email: EMAILJS_CONFIG.ADMIN_EMAIL,
    bat_url: batUrl,
    custom_message: customMessage || '',
    file_name: originalFileName || '',
    expiration_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')
  };

  console.log('📝 Paramètres template EmailJS:', templateParams);

  try {
    // Vérifier que EmailJS est disponible
    if (!emailjs || typeof emailjs.send !== 'function') {
      throw new Error('EmailJS library non disponible ou non initialisée');
    }

    // Ré-initialiser EmailJS au cas où
    console.log('🔄 Ré-initialisation EmailJS...');
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

    console.log('📤 Tentative d\'envoi email avec EmailJS...');
    console.log('📤 Service ID:', EMAILJS_CONFIG.SERVICE_ID);
    console.log('📤 Template ID:', EMAILJS_CONFIG.TEMPLATE_ID_BAT);
    
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID_BAT,
      templateParams
    );
    
    console.log('✅ Email BAT envoyé avec succès:', response);
    return { success: true, response };
  } catch (error) {
    console.error('❌ Erreur envoi email BAT:', error);
    
    // Debug détaillé de l'erreur
    const errorInfo = {
      name: error?.name,
      message: error?.message,
      status: error?.status,
      text: error?.text,
      type: typeof error,
      constructor: error?.constructor?.name,
      keys: error ? Object.keys(error) : [],
      toString: error?.toString(),
      stack: error?.stack
    };
    console.error('❌ Analyse complète de l\'erreur:', errorInfo);
    
    // Gestion robuste des différents types d'erreurs EmailJS
    let errorMessage = 'Erreur inconnue lors de l\'envoi d\'email';
    
    if (error?.text && error.text !== 'undefined') {
      errorMessage = `Erreur EmailJS: ${error.text}`;
    } else if (error?.message && error.message !== 'undefined') {
      errorMessage = `Erreur: ${error.message}`;
    } else if (error?.status) {
      errorMessage = `Erreur EmailJS (Code ${error.status})`;
    } else if (typeof error === 'string' && error !== 'undefined') {
      errorMessage = error;
    } else if (error && error.toString && error.toString() !== '[object Object]' && error.toString() !== 'undefined') {
      errorMessage = error.toString();
    } else {
      // Dernier recours: analyser les propriétés de l'objet erreur
      errorMessage = `Erreur EmailJS inconnue (${error?.constructor?.name || 'type inconnu'})`;
    }
    
    console.error('❌ Message d\'erreur final:', errorMessage);
    return { success: false, error: errorMessage };
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
