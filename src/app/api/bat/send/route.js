import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { verifyAuthToken, generateBATId, generateBATToken } from '@/lib/auth';
import { createBAT } from '@/lib/storage';
import { sendBATEmail } from '@/lib/email';

/**
 * API pour uploader et envoyer un BAT
 * POST /api/bat/send
 */
export async function POST(request) {
  try {
    // Vérification de l'authentification admin
    const authToken = request.cookies.get('auth-token')?.value;
    if (!authToken || !verifyAuthToken(authToken)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('pdfFile');
    const recipientEmail = formData.get('recipientEmail');
    const customMessage = formData.get('customMessage');

    // Validation des champs
    if (!file || !recipientEmail || !customMessage) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Validation du type de fichier
    if (!file.type.includes('pdf')) {
      return NextResponse.json(
        { error: 'Seuls les fichiers PDF sont acceptés' },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json(
        { error: 'Adresse email invalide' },
        { status: 400 }
      );
    }

    // Générer un ID unique pour le BAT
    const batId = generateBATId();
    
    // Créer le nom de fichier sécurisé
    const fileName = `${batId}.pdf`;
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const filePath = path.join(uploadsDir, fileName);

    // Créer le dossier uploads s'il n'existe pas
    const fs = require('fs');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Sauvegarder le fichier
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Créer l'entrée BAT dans le stockage
    const batData = {
      id: batId,
      filename: fileName,
      originalName: file.name,
      recipientEmail,
      customMessage,
    };

    await createBAT(batData);

    // Générer le token pour le lien BAT
    const batToken = generateBATToken(recipientEmail, batId);

    // Envoyer l'email au client
    const emailResult = await sendBATEmail(recipientEmail, batToken, customMessage);

    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'BAT envoyé avec succès',
      batId,
      recipientEmail,
    });

  } catch (error) {
    console.error('Erreur upload BAT:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'upload' },
      { status: 500 }
    );
  }
}
