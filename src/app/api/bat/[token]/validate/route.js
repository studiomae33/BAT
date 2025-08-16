import { NextResponse } from 'next/server';
import { verifyBATToken } from '@/lib/auth';
import { getBATById, updateBATStatus } from '@/lib/storage';
import { sendValidationEmailSMTP } from '@/lib/email-server';

/**
 * API pour valider un BAT
 * POST /api/bat/[token]/validate
 */
export async function POST(request, { params }) {
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

    // Vérifier que le BAT n'a pas déjà été traité
    if (bat.status !== 'sent') {
      return NextResponse.json(
        { error: 'Ce BAT a déjà été traité' },
        { status: 400 }
      );
    }

    // Mettre à jour le statut du BAT
    await updateBATStatus(decodedToken.batId, 'validated');

    // Envoyer l'email de validation à l'admin
    const emailResult = await sendValidationEmailSMTP(bat);

    if (!emailResult.success) {
      console.error('Erreur envoi email validation:', emailResult.error);
      // On continue même si l'email échoue
    }

    return NextResponse.json({
      success: true,
      message: 'BAT validé avec succès',
    });

  } catch (error) {
    console.error('Erreur validation BAT:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
