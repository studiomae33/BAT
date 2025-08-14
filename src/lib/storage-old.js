import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const BATS_FILE = path.join(DATA_DIR, 'bats.json');

/**
 * Assure que le dossier data existe
 */
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

/**
 * Charge tous les BATs depuis le fichier JSON
 */
async function loadBATs() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(BATS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Si le fichier n'existe pas, retourner un tableau vide
    return [];
  }
}

/**
 * Sauvegarde tous les BATs dans le fichier JSON
 */
async function saveBATs(bats) {
  await ensureDataDir();
  await fs.writeFile(BATS_FILE, JSON.stringify(bats, null, 2));
}

/**
 * Crée un nouveau BAT
 */
export async function createBAT(batData) {
  const bats = await loadBATs();
  
  const newBAT = {
    id: batData.id,
    filename: batData.filename,
    originalName: batData.originalName,
    recipientEmail: batData.recipientEmail,
    customMessage: batData.customMessage,
    status: 'sent', // sent, validated, rejected
    createdAt: new Date().toISOString(),
    validatedAt: null,
    rejectedAt: null,
    rejectionMessage: null,
  };
  
  bats.push(newBAT);
  await saveBATs(bats);
  
  return newBAT;
}

/**
 * Récupère un BAT par son ID
 */
export async function getBATById(batId) {
  const bats = await loadBATs();
  return bats.find(bat => bat.id === batId);
}

/**
 * Met à jour le statut d'un BAT
 */
export async function updateBATStatus(batId, status, additionalData = {}) {
  const bats = await loadBATs();
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
  
  await saveBATs(bats);
  return bats[batIndex];
}

/**
 * Récupère tous les BATs (pour l'admin)
 */
export async function getAllBATs() {
  return await loadBATs();
}

/**
 * Supprime les BATs expirés
 */
export async function cleanupExpiredBATs() {
  const bats = await loadBATs();
  const now = new Date();
  
  const activeBats = bats.filter(bat => {
    const createdAt = new Date(bat.createdAt);
    const expirationDate = new Date(createdAt.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 jours
    return expirationDate > now;
  });
  
  if (activeBats.length !== bats.length) {
    await saveBATs(activeBats);
    console.log(`${bats.length - activeBats.length} BATs expirés supprimés`);
  }
  
  return activeBats;
}
