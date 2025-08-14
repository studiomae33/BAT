import nodemailer from 'nodemailer';
import { CONFIG } from '@/lib/auth';

/**
 * Configuration du transporteur email
 */
const transporter = nodemailer.createTransporter({
  host: CONFIG.EMAIL.HOST,
  port: CONFIG.EMAIL.PORT,
  secure: false, // true pour 465, false pour autres ports
  auth: {
    user: CONFIG.EMAIL.USER,
    pass: CONFIG.EMAIL.PASS,
  },
});

/**
 * Envoie un email avec le lien BAT au client
 */
export async function sendBATEmail(recipientEmail, batToken, customMessage) {
  const batUrl = `${CONFIG.BASE_URL}/bat/${batToken}`;
  
  const mailOptions = {
    from: CONFIG.EMAIL.FROM,
    to: recipientEmail,
    subject: 'Nouveau BAT à valider',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Nouveau BAT à valider</h2>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Message personnalisé :</strong></p>
          <p style="font-style: italic;">${customMessage}</p>
        </div>
        
        <p>Vous avez reçu un nouveau BAT (Bon À Tirer) à valider.</p>
        <p>Cliquez sur le lien ci-dessous pour visualiser et valider le document :</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${batUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Visualiser le BAT
          </a>
        </div>
        
        <p><strong>Important :</strong> Ce lien expirera dans ${CONFIG.BAT_EXPIRATION_DAYS} jours.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">
          Si vous ne pouvez pas cliquer sur le lien, copiez et collez cette URL dans votre navigateur :<br>
          ${batUrl}
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email BAT envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Erreur envoi email BAT:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Envoie un email de validation à l'admin
 */
export async function sendValidationEmail(batId, recipientEmail) {
  const mailOptions = {
    from: CONFIG.EMAIL.FROM,
    to: CONFIG.ADMIN_EMAIL,
    subject: 'BAT Validé ✅',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745;">✅ BAT Validé</h2>
        
        <div style="background-color: #d4edda; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
          <p><strong>Bonne nouvelle !</strong> Votre BAT a été validé.</p>
        </div>
        
        <p><strong>Détails :</strong></p>
        <ul>
          <li><strong>ID du BAT :</strong> ${batId}</li>
          <li><strong>Client :</strong> ${recipientEmail}</li>
          <li><strong>Date de validation :</strong> ${new Date().toLocaleString('fr-FR')}</li>
        </ul>
        
        <p>Vous pouvez maintenant procéder à la suite du processus.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email validation envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Erreur envoi email validation:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Envoie un email de refus à l'admin
 */
export async function sendRejectionEmail(batId, recipientEmail, rejectionMessage) {
  const mailOptions = {
    from: CONFIG.EMAIL.FROM,
    to: CONFIG.ADMIN_EMAIL,
    subject: 'BAT Refusé ❌',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">❌ BAT Refusé</h2>
        
        <div style="background-color: #f8d7da; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
          <p><strong>Votre BAT a été refusé par le client.</strong></p>
        </div>
        
        <p><strong>Détails :</strong></p>
        <ul>
          <li><strong>ID du BAT :</strong> ${batId}</li>
          <li><strong>Client :</strong> ${recipientEmail}</li>
          <li><strong>Date de refus :</strong> ${new Date().toLocaleString('fr-FR')}</li>
        </ul>
        
        ${rejectionMessage ? `
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Message du client :</strong></p>
          <p style="font-style: italic;">"${rejectionMessage}"</p>
        </div>
        ` : ''}
        
        <p>Veuillez contacter le client pour clarifier les modifications nécessaires.</p>
        <p><strong>Contact client :</strong> <a href="tel:${CONFIG.PHONE_NUMBER}">${CONFIG.PHONE_NUMBER}</a></p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email refus envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Erreur envoi email refus:', error);
    return { success: false, error: error.message };
  }
}
