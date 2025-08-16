'use client'

import { useState } from 'react'

export default function TestServiceID() {
  const [serviceId, setServiceId] = useState('service_xb0o03d')
  const [publicKey, setPublicKey] = useState('TNl3r0YjPN8-uGT_f')
  const [templateId, setTemplateId] = useState('template_wvesgq6')
  const [testResult, setTestResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const testEmailJS = async () => {
    setLoading(true)
    setTestResult(null)

    try {
      console.log('🧪 Test avec Service ID:', serviceId)
      
      // Import EmailJS
      const emailjsModule = await import('@emailjs/browser')
      const emailjs = emailjsModule.default

      // Initialisation avec la clé publique
      console.log('🔑 Initialisation avec clé:', publicKey)
      emailjs.init(publicKey)

      // Paramètres de test
      const params = {
        to_email: 'test@example.com',
        admin_email: 'contact@studiomae.fr',
        bat_url: 'https://example.com/test',
        custom_message: 'Test service ID',
        file_name: 'test.pdf',
        expiration_date: new Date().toLocaleDateString('fr-FR')
      }

      console.log('📤 Tentative envoi avec:', {
        serviceId,
        templateId,
        params
      })

      // Test d'envoi
      const response = await emailjs.send(serviceId, templateId, params)

      setTestResult({
        success: true,
        message: 'Service ID valide ! Email envoyé avec succès.',
        response: response
      })

    } catch (error) {
      console.error('❌ Erreur test:', error)
      
      let errorMessage = 'Erreur inconnue'
      if (error.text) {
        errorMessage = error.text
      } else if (error.message) {
        errorMessage = error.message
      }

      setTestResult({
        success: false,
        error: errorMessage,
        details: {
          type: typeof error,
          name: error?.name,
          status: error?.status,
          text: error?.text
        }
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">🔧 Test Service ID EmailJS</h1>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-red-800 mb-2">❌ Service ID Invalide Détecté</h3>
          <p className="text-red-700 text-sm">
            Le Service ID <code>service_xb0o03d</code> retourne "not found". 
            Testez différents Service IDs ci-dessous pour trouver le bon.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Service ID</label>
            <input
              type="text"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="service_xxxxxxx"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Public Key</label>
            <input
              type="text"
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Votre clé publique"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Template ID</label>
            <input
              type="text"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="template_xxxxxxx"
            />
          </div>
        </div>

        <button
          onClick={testEmailJS}
          disabled={loading || !serviceId || !publicKey || !templateId}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? '⏳ Test en cours...' : '🧪 Tester ce Service ID'}
        </button>

        {testResult && (
          <div className={`mt-6 p-6 rounded-lg border ${
            testResult.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <h3 className="font-semibold text-lg mb-3">
              {testResult.success ? '✅ Succès !' : '❌ Échec'}
            </h3>
            
            {testResult.success ? (
              <div>
                <p className="text-green-800 mb-3">{testResult.message}</p>
                <p className="text-sm text-green-700 mb-3">
                  🎯 <strong>Service ID valide :</strong> <code>{serviceId}</code>
                </p>
                <p className="text-sm text-green-600">
                  Mettez à jour votre variable NEXT_PUBLIC_EMAILJS_SERVICE_ID avec cette valeur et redéployez.
                </p>
                
                <details className="mt-4">
                  <summary className="cursor-pointer font-semibold">Réponse EmailJS</summary>
                  <pre className="mt-2 p-3 bg-white rounded border text-xs overflow-x-auto">
                    {JSON.stringify(testResult.response, null, 2)}
                  </pre>
                </details>
              </div>
            ) : (
              <div>
                <p className="text-red-800 mb-3">
                  <strong>Erreur :</strong> {testResult.error}
                </p>
                
                <div className="text-sm text-red-700 space-y-1">
                  {testResult.error.includes('service ID not found') && (
                    <p>💡 Ce Service ID n'existe pas. Vérifiez sur https://dashboard.emailjs.com/admin</p>
                  )}
                  {testResult.error.includes('Public Key is invalid') && (
                    <p>💡 La clé publique est invalide. Vérifiez dans Account → General</p>
                  )}
                  {testResult.error.includes('template ID not found') && (
                    <p>💡 Ce Template ID n'existe pas. Vérifiez dans Email Templates</p>
                  )}
                </div>

                <details className="mt-4">
                  <summary className="cursor-pointer font-semibold">Détails de l'erreur</summary>
                  <pre className="mt-2 p-3 bg-white rounded border text-xs overflow-x-auto">
                    {JSON.stringify(testResult.details, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-3">📋 Comment trouver le bon Service ID :</h3>
          <ol className="text-sm text-blue-700 space-y-2">
            <li>1. Allez sur <a href="https://dashboard.emailjs.com/admin" target="_blank" className="underline">https://dashboard.emailjs.com/admin</a></li>
            <li>2. Dans la section "Email Services", trouvez votre service</li>
            <li>3. Le Service ID est affiché (ex: service_abc123)</li>
            <li>4. Testez-le dans le champ ci-dessus</li>
            <li>5. Une fois validé, mettez à jour la variable sur Vercel</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
