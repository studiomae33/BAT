'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';

export default function EmailTestPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testEmailSend = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log('🧪 Test d\'envoi email EmailJS...');
      
      // Import et test des fonctions
      const { sendBATEmailClient } = await import('@/lib/email-client');
      
      // Paramètres de test
      const testParams = {
        recipientEmail: 'test@example.com',
        batToken: 'test-token-123',
        customMessage: 'Ceci est un test d\'email BAT',
        originalFileName: 'test-document.pdf'
      };

      console.log('📧 Paramètres de test:', testParams);

      const emailResult = await sendBATEmailClient(
        testParams.recipientEmail,
        testParams.batToken,
        testParams.customMessage,
        testParams.originalFileName
      );

      console.log('📊 Résultat:', emailResult);
      setResult(emailResult);

    } catch (error) {
      console.error('❌ Erreur test email:', error);
      setResult({
        success: false,
        error: error.message || 'Erreur inconnue',
        stack: error.stack
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 Test Envoi Email EmailJS
        </h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test d&apos;envoi</h2>
          <Button 
            onClick={testEmailSend}
            disabled={loading}
            variant="solid"
            color="blue"
          >
            {loading ? 'Test en cours...' : 'Tester l\'envoi EmailJS'}
          </Button>
        </div>

        {result && (
          <div className={`rounded-lg shadow p-6 ${
            result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          } border`}>
            <h2 className="text-xl font-semibold mb-4">
              {result.success ? '✅ Succès' : '❌ Erreur'}
            </h2>
            
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 text-center">
          <Button 
            onClick={() => window.location.href = '/admin'}
            variant="outline"
            color="gray"
          >
            ← Retour Admin
          </Button>
        </div>
      </div>
    </div>
  );
}
