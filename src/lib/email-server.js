/**
 * Service email côté serveur - SMTP uniquement
 * Ce fichier ne doit jamais être importé côté client
 */

const nodemailer = require('nodemailer');
import { CONFIG } from '@/lib/auth';

/**
 * Configuration du transporteur email SMTP
 */
let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: CONFIG.EMAIL.HOST,
      port: CONFIG.EMAIL.PORT,
      secure: false,
      auth: {
        user: CONFIG.EMAIL.USER,
        pass: CONFIG.EMAIL.PASS,
      },
    });
  }
  return transporter;
}

/**
 * Envoie un email avec le lien BAT au client (SMTP)
 */
export async function sendBATEmailSMTP(recipientEmail, batToken, customMessage) {
  const batUrl = `${CONFIG.BASE_URL}/bat/${batToken}`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>BAT à valider</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">BAT à valider</h2>
        
        <p>Bonjour,</p>
        
        <p>Vous avez reçu un BAT (Bon À Tirer) à valider.</p>
        
        <div style="background: #f8fafc; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0;">
          <p><strong>Message :</strong></p>
          <p>${customMessage}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${batUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            🔗 Visualiser et Valider le BAT
          </a>
        </div>
        
        <p><small>Ce lien expire dans ${CONFIG.BAT_EXPIRATION_DAYS} jours.</small></p>
        
        <hr style="margin: 30px 0; border: none; height: 1px; background: #e5e7eb;">
        <p style="font-size: 12px; color: #6b7280;">
          Email envoyé automatiquement par le système BAT.
        </p>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: CONFIG.EMAIL.FROM,
    to: recipientEmail,
    subject: 'BAT à valider',
    html: htmlContent
  };

  try {
    const info = await getTransporter().sendMail(mailOptions);
    console.log('✅ Email BAT envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erreur envoi email BAT:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Envoie une notification de validation à l'admin (SMTP)
 */
export async function sendValidationEmailSMTP(batData) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>BAT Validé</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #059669;">✅ BAT Validé</h2>
        
        <p>Le BAT a été validé par le client !</p>
        
        <div style="background: #f0fdf4; padding: 15px; border-left: 4px solid #059669; margin: 20px 0;">
          <p><strong>Fichier :</strong> ${batData.originalName}</p>
          <p><strong>Client :</strong> ${batData.recipientEmail}</p>
          <p><strong>Date de validation :</strong> ${new Date().toLocaleString('fr-FR')}</p>
        </div>
        
        <p>Vous pouvez maintenant procéder à l'impression/production du document.</p>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: CONFIG.EMAIL.FROM,
    to: CONFIG.ADMIN_EMAIL,
    subject: `✅ BAT Validé - ${batData.originalName}`,
    html: htmlContent
  };

  try {
    const info = await getTransporter().sendMail(mailOptions);
    console.log('✅ Notification validation envoyée:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erreur notification validation:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Envoie une notification de rejet à l'admin (SMTP)
 */
export async function sendRejectionEmailSMTP(batData, rejectionMessage) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>BAT Rejeté</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #dc2626;">❌ BAT Rejeté</h2>
        
        <p>Le BAT a été rejeté par le client.</p>
        
        <div style="background: #fef2f2; padding: 15px; border-left: 4px solid #dc2626; margin: 20px 0;">
          <p><strong>Fichier :</strong> ${batData.originalName}</p>
          <p><strong>Client :</strong> ${batData.recipientEmail}</p>
          <p><strong>Date de rejet :</strong> ${new Date().toLocaleString('fr-FR')}</p>
        </div>
        
        <div style="background: #f8fafc; padding: 15px; border-left: 4px solid #6b7280; margin: 20px 0;">
          <p><strong>Message du client :</strong></p>
          <p>${rejectionMessage}</p>
        </div>
        
        <p>Vous devez effectuer les corrections demandées et renvoyer un nouveau BAT.</p>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: CONFIG.EMAIL.FROM,
    to: CONFIG.ADMIN_EMAIL,
    subject: `❌ BAT Rejeté - ${batData.originalName}`,
    html: htmlContent
  };

  try {
    const info = await getTransporter().sendMail(mailOptions);
    console.log('✅ Notification rejet envoyée:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erreur notification rejet:', error);
    return { success: false, error: error.message };
  }
}

console.log('📧 SMTP Service (server-only) configuré');
