'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';

export default function EmailDebugPage() {
  const [envVars, setEnvVars] = useState({});
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Récupérer les variables d'environnement côté client
    setEnvVars({
      NEXT_PUBLIC_EMAILJS_SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      NEXT_PUBLIC_EMAILJS_TEMPLATE_BAT: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_BAT,
      NEXT_PUBLIC_EMAILJS_TEMPLATE_VALIDATION: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_VALIDATION,
      NEXT_PUBLIC_EMAILJS_TEMPLATE_REJECTION: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_REJECTION,
    });
  }, []);

  const testEmailJSConfig = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      // Test 1: Vérifier les variables d'environnement
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      const templateBAT = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_BAT;

      if (!serviceId || !publicKey || !templateBAT) {
        setTestResult({
          success: false,
          error: 'Variables d\'environnement manquantes',
          details: {
            hasServiceId: !!serviceId,
            hasPublicKey: !!publicKey,
            hasTemplate: !!templateBAT
          }
        });
        return;
      }

      // Test 2: Tester l'import et l'initialisation EmailJS
      const { initEmailJS } = await import('@/lib/emailjs-service');
      
      // Test 3: Initialiser EmailJS
      initEmailJS();

      setTestResult({
        success: true,
        message: 'Configuration EmailJS OK',
        config: {
          serviceId: serviceId.substring(0, 10) + '...',
          publicKey: publicKey.substring(0, 10) + '...',
          templateBAT: templateBAT.substring(0, 10) + '...'
        }
      });

    } catch (error) {
      setTestResult({
        success: false,
        error: error.message,
        stack: error.stack
      });
    } finally {
      setLoading(false);
    }
  };

  const testRealEmailJS = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      // Test avec la vraie fonction de test
      const { testEmailServiceClient } = await import('@/lib/email-client');
      const result = await testEmailServiceClient();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error: error.message,
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
          🔍 Debug EmailJS Configuration
        </h1>

        {/* Variables d'environnement */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Variables d&apos;environnement</h2>
          <div className="space-y-2">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {key}
                </code>
                <span className={`text-sm ${value ? 'text-green-600' : 'text-red-600'}`}>
                  {value ? `✅ ${value.substring(0, 15)}...` : '❌ MANQUANT'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tests */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Tests</h2>
          <div className="space-x-4">
            <Button 
              onClick={testEmailJSConfig}
              disabled={loading}
              variant="outline"
              color="blue"
            >
              {loading ? 'Test...' : 'Test Config Base'}
            </Button>
            
            <Button 
              onClick={testRealEmailJS}
              disabled={loading}
              variant="solid"
              color="blue"
            >
              {loading ? 'Test...' : 'Test Fonction Réelle'}
            </Button>
          </div>
        </div>

        {/* Résultats */}
        {testResult && (
          <div className={`rounded-lg shadow p-6 ${
            testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          } border`}>
            <h2 className="text-xl font-semibold mb-4">
              {testResult.success ? '✅ Résultat' : '❌ Erreur'}
            </h2>
            
            {testResult.success ? (
              <div>
                <p className="text-green-700 mb-2">{testResult.message}</p>
                {testResult.config && (
                  <pre className="bg-green-100 p-3 rounded text-sm overflow-x-auto">
                    {JSON.stringify(testResult.config, null, 2)}
                  </pre>
                )}
              </div>
            ) : (
              <div>
                <p className="text-red-700 mb-2">
                  <strong>Erreur:</strong> {testResult.error}
                </p>
                {testResult.details && (
                  <div className="mb-2">
                    <strong>Détails:</strong>
                    <pre className="bg-red-100 p-3 rounded text-sm overflow-x-auto">
                      {JSON.stringify(testResult.details, null, 2)}
                    </pre>
                  </div>
                )}
                {testResult.debug && (
                  <div className="mb-2">
                    <strong>Debug:</strong>
                    <pre className="bg-red-100 p-3 rounded text-sm overflow-x-auto">
                      {JSON.stringify(testResult.debug, null, 2)}
                    </pre>
                  </div>
                )}
                {testResult.stack && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-red-700">Stack trace</summary>
                    <pre className="bg-red-100 p-3 rounded text-xs overflow-x-auto mt-2">
                      {testResult.stack}
                    </pre>
                  </details>
                )}
              </div>
            )}
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
