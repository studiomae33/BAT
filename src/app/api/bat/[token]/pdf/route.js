import { NextResponse } from 'next/server';
import { verifyBATToken } from '@/lib/auth';
import { getBATById } from '@/lib/storage';

/**
 * API pour servir le fichier PDF d'un BAT
 * GET /api/bat/[token]/pdf
 */
export async function GET(request, { params }) {
  try {
    const { token } = params;

    // Vérifier le token BAT
    const decodedToken = verifyBATToken(token);
    if (!decodedToken || decodedToken.type !== 'bat_access') {
      return NextResponse.json(
        { error: 'Token invalide ou expiré' },
        { status: 401 }
      );
    }

    // Récupérer les données du BAT
    const bat = await getBATById(decodedToken.batId);
    if (!bat) {
      return NextResponse.json(
        { error: 'BAT non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que l'email correspond
    if (bat.recipientEmail !== decodedToken.recipientEmail) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Récupérer le contenu du fichier depuis le storage
    if (!bat.fileContent) {
      return NextResponse.json(
        { error: 'Contenu PDF non trouvé' },
        { status: 404 }
      );
    }

    // Convertir le base64 en buffer
    const fileBuffer = Buffer.from(bat.fileContent, 'base64');

    // Retourner le PDF avec les bons headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${bat.originalName}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    console.error('Erreur récupération PDF:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
