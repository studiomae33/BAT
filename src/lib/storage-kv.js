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
   * Méthodes JSON pour le développement local
   */
  async ensureDataDir() {
    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
    }
  }

  async loadBATsFromJSON() {
    try {
      await this.ensureDataDir();
      const data = await fs.readFile(BATS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

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
}

// Instance singleton
const storage = new StorageAdapter();

/**
 * Ajoute un nouveau BAT
 */
export async function addBAT(batData) {
  const bats = await storage.loadBATs();
  bats.push(batData);
  await storage.saveBATs(bats);
  return batData;
}

/**
 * Récupère un BAT par son ID
 */
export async function getBATById(id) {
  const bats = await storage.loadBATs();
  return bats.find(bat => bat.id === id);
}

/**
 * Met à jour un BAT existant
 */
export async function updateBAT(id, updates) {
  const bats = await storage.loadBATs();
  const index = bats.findIndex(bat => bat.id === id);
  
  if (index === -1) {
    throw new Error('BAT non trouvé');
  }
  
  bats[index] = { ...bats[index], ...updates };
  await storage.saveBATs(bats);
  return bats[index];
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
