import { NextResponse } from 'next/server';
import { verifyBATToken } from '@/lib/auth';
import { getBATById } from '@/lib/storage';

/**
 * API pour récupérer un BAT avec son token
 * GET /api/bat/[token]
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

    // Vérifier que le contenu du fichier existe
    if (!bat.fileContent) {
      return NextResponse.json(
        { error: 'Contenu PDF non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      bat: {
        id: bat.id,
        originalName: bat.originalName,
        customMessage: bat.customMessage,
        status: bat.status,
        createdAt: bat.createdAt,
      },
    });

  } catch (error) {
    console.error('Erreur récupération BAT:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
