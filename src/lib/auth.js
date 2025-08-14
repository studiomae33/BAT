import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

/**
 * Configuration des constantes de l'application
 */
export const CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret-change-me',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'test@test.fr',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '1234',
  BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
  BAT_EXPIRATION_DAYS: parseInt(process.env.BAT_EXPIRATION_DAYS) || 7,
  PHONE_NUMBER: process.env.PHONE_NUMBER || '+33123456789',
  EMAIL: {
    HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
    PORT: parseInt(process.env.EMAIL_PORT) || 587,
    USER: process.env.EMAIL_USER || '',
    PASS: process.env.EMAIL_PASS || '',
    FROM: process.env.EMAIL_FROM || 'noreply@example.com',
  }
};

/**
 * Génère un token JWT pour l'authentification admin
 */
export function generateAuthToken(email) {
  return jwt.sign(
    { email, role: 'admin' },
    CONFIG.JWT_SECRET,
    { expiresIn: '24h' }
  );
}

/**
 * Vérifie un token JWT
 */
export function verifyAuthToken(token) {
  try {
    return jwt.verify(token, CONFIG.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Génère un token unique pour un BAT
 */
export function generateBATToken(recipientEmail, batId) {
  const payload = {
    recipientEmail,
    batId,
    type: 'bat_access',
    expiresAt: new Date(Date.now() + CONFIG.BAT_EXPIRATION_DAYS * 24 * 60 * 60 * 1000)
  };
  
  return jwt.sign(payload, CONFIG.JWT_SECRET);
}

/**
 * Vérifie un token BAT
 */
export function verifyBATToken(token) {
  try {
    const decoded = jwt.verify(token, CONFIG.JWT_SECRET);
    
    // Vérifier que le token n'a pas expiré
    if (decoded.expiresAt && new Date(decoded.expiresAt) < new Date()) {
      return null;
    }
    
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Hache un mot de passe
 */
export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

/**
 * Vérifie un mot de passe
 */
export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Génère un ID unique pour un BAT
 */
export function generateBATId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}
