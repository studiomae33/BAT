import { NextResponse } from 'next/server';
import { verifyAuthToken, generateBATId, generateBATToken } from '@/lib/auth';
import { createBAT } from '@/lib/storage';

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
    
    // Sur Vercel, on ne peut pas écrire dans le système de fichiers
    // On va stocker le fichier en base64 dans le storage temporairement
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Content = buffer.toString('base64');
    
    console.log('📄 Fichier traité:', {
      name: file.name,
      size: file.size,
      type: file.type,
      bufferSize: buffer.length
    });

    // Créer l'entrée BAT dans le stockage avec le contenu en base64
    const batData = {
      id: batId,
      filename: `${batId}.pdf`, // nom virtuel
      originalName: file.name,
      recipientEmail,
      customMessage,
      fileContent: base64Content, // Stocker le contenu
      fileSize: file.size,
      fileType: file.type
    };

    console.log('💾 Création BAT dans le storage...');
    await createBAT(batData);

    // Générer le token pour le lien BAT
    const batToken = generateBATToken(recipientEmail, batId);

    // Retourner les données pour que le client puisse envoyer l'email via EmailJS
    return NextResponse.json({
      success: true,
      message: 'BAT créé avec succès',
      batId,
      batToken,
      recipientEmail,
      customMessage,
      originalFileName: file.name,
      // Indique qu'il faut envoyer l'email côté client
      needsEmailSend: true
    });

  } catch (error) {
    console.error('Erreur upload BAT:', error);
    console.error('Stack trace:', error.stack);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code
    });
    
    return NextResponse.json(
      { 
        error: 'Erreur serveur lors de l\'upload',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
