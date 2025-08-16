import { kv } from '@vercel/kv';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const BATS_FILE = path.join(DATA_DIR, 'bats.json');
const BATS_KEY = 'bats';

// Détection de l'environnement
const isProduction = process.env.NODE_ENV === 'production' && process.env.KV_URL;

/**
 * Storage adaptateur - utilise KV en prod, JSON en local
 */
class StorageAdapter {
  constructor() {
    this.useKV = isProduction;
  }

  /**
   * Charge tous les BATs
   */
  async loadBATs() {
    if (this.useKV) {
      try {
        const data = await kv.get(BATS_KEY);
        return data || [];
      } catch (error) {
        console.error('Erreur KV:', error);
        return [];
      }
    } else {
      // Fallback vers JSON local
      return this.loadBATsFromJSON();
    }
  }

  /**
   * Sauvegarde tous les BATs
   */
  async saveBATs(bats) {
    if (this.useKV) {
      try {
        await kv.set(BATS_KEY, bats);
        return true;
      } catch (error) {
        console.error('Erreur KV save:', error);
        return false;
      }
    } else {
      // Fallback vers JSON local
      return this.saveBATsToJSON(bats);
    }
  }

  /**
   * Charge les BATs depuis le fichier JSON local
   */
  async loadBATsFromJSON() {
    try {
      await this.ensureDataDir();
      const data = await fs.readFile(BATS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // Si le fichier n'existe pas, retourner un tableau vide
      return [];
    }
  }

  /**
   * Sauvegarde les BATs dans le fichier JSON local
   */
  async saveBATsToJSON(bats) {
    try {
      await this.ensureDataDir();
      await fs.writeFile(BATS_FILE, JSON.stringify(bats, null, 2));
      return true;
    } catch (error) {
      console.error('Erreur JSON save:', error);
      return false;
    }
  }

  /**
   * Assure que le dossier data existe
   */
  async ensureDataDir() {
    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
    }
  }
}

// Instance singleton
const storage = new StorageAdapter();

/**
 * Crée un nouveau BAT (alias pour addBAT pour compatibilité)
 */
export async function createBAT(batData) {
  const newBAT = {
    id: batData.id,
    filename: batData.filename,
    originalName: batData.originalName,
    recipientEmail: batData.recipientEmail,
    customMessage: batData.customMessage,
    fileContent: batData.fileContent, // Contenu base64
    fileSize: batData.fileSize,
    fileType: batData.fileType,
    status: 'sent', // sent, validated, rejected
    createdAt: new Date().toISOString(),
    validatedAt: null,
    rejectedAt: null,
    rejectionMessage: null,
  };

  const bats = await storage.loadBATs();
  bats.push(newBAT);
  await storage.saveBATs(bats);
  
  console.log('✅ BAT créé avec succès:', {
    id: newBAT.id,
    email: newBAT.recipientEmail,
    fileName: newBAT.originalName
  });
  
  return newBAT;
}

/**
 * Récupère un BAT par son ID
 */
export async function getBATById(id) {
  const bats = await storage.loadBATs();
  return bats.find(bat => bat.id === id);
}

/**
 * Met à jour le statut d'un BAT
 */
export async function updateBATStatus(batId, status, additionalData = {}) {
  const bats = await storage.loadBATs();
  const batIndex = bats.findIndex(bat => bat.id === batId);
  
  if (batIndex === -1) {
    throw new Error('BAT non trouvé');
  }
  
  bats[batIndex] = {
    ...bats[batIndex],
    status,
    ...additionalData,
    updatedAt: new Date().toISOString(),
  };
  
  if (status === 'validated') {
    bats[batIndex].validatedAt = new Date().toISOString();
  } else if (status === 'rejected') {
    bats[batIndex].rejectedAt = new Date().toISOString();
  }
  
  await storage.saveBATs(bats);
  return bats[batIndex];
}

/**
 * Récupère tous les BATs
 */
export async function getAllBATs() {
  return await storage.loadBATs();
}

/**
 * Supprime un BAT
 */
export async function deleteBAT(id) {
  const bats = await storage.loadBATs();
  const filteredBats = bats.filter(bat => bat.id !== id);
  await storage.saveBATs(filteredBats);
  return true;
}

console.log(`🗄️ Storage: ${storage.useKV ? 'Vercel KV (Production)' : 'JSON Local (Development)'}`);