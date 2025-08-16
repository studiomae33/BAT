import { NextResponse } from 'next/server';
import { verifyBATToken } from '@/lib/auth';
import { getBATById, updateBATStatus } from '@/lib/storage';
import { sendRejectionEmailSMTP } from '@/lib/email-server';

/**
 * API pour refuser un BAT
 * POST /api/bat/[token]/reject
 */
export async function POST(request, { params }) {
  try {
    const { token } = params;
    const { rejectionMessage } = await request.json();

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
    await updateBATStatus(decodedToken.batId, 'rejected', {
      rejectionMessage: rejectionMessage || null,
    });

    // Envoyer l'email de refus à l'admin
    const emailResult = await sendRejectionEmailSMTP(bat, rejectionMessage);

    if (!emailResult.success) {
      console.error('Erreur envoi email refus:', emailResult.error);
      // On continue même si l'email échoue
    }

    return NextResponse.json({
      success: true,
      message: 'BAT refusé avec succès',
    });

  } catch (error) {
    console.error('Erreur refus BAT:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
