'use client'

import { useState } from 'react'

export default function TestEmailJSUltraSimple() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const testUltraSimple = async () => {
    setLoading(true)
    setResult(null)

    try {
      console.log('🧪 Test Ultra Simple EmailJS...')

      // Import direct
      const emailjsLib = await import('@emailjs/browser')
      const emailjs = emailjsLib.default

      console.log('📦 EmailJS importé:', !!emailjs)

      // Configuration directe (hardcodée pour test)
      const config = {
        serviceId: 'service_xb0o03d',
        templateId: 'template_wvesgq6', 
        publicKey: 'TNl3r0YjPN8-uGT_f'
      }

      console.log('🔧 Configuration:', config)

      // Initialisation
      console.log('🔑 Initialisation...')
      emailjs.init(config.publicKey)
      console.log('✅ EmailJS initialisé')

      // Paramètres de test minimal
      const params = {
        to_email: 'test@example.com',
        admin_email: 'contact@studiomae.fr',
        bat_url: 'https://example.com/test',
        custom_message: 'Test message',
        file_name: 'test.pdf',
        expiration_date: new Date().toLocaleDateString('fr-FR')
      }

      console.log('📝 Paramètres:', params)

      // Tentative d'envoi
      console.log('📤 Tentative d\'envoi...')
      
      const response = await emailjs.send(
        config.serviceId,
        config.templateId,
        params
      )

      console.log('✅ Succès:', response)
      
      setResult({
        success: true,
        message: 'Email envoyé avec succès !',
        response: response
      })

    } catch (error) {
      console.error('❌ Erreur:', error)
      
      // Analyse complète de l'erreur
      const errorDetails = {
        type: typeof error,
        name: error?.name,
        message: error?.message,
        status: error?.status,
        text: error?.text,
        toString: error?.toString?.(),
        constructor: error?.constructor?.name,
        keys: error ? Object.keys(error) : [],
        hasStack: !!error?.stack
      }
      
      console.log('🔍 Analyse erreur:', errorDetails)

      setResult({
        success: false,
        error: error?.message || error?.text || error?.toString?.() || 'Erreur inconnue',
        details: errorDetails
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">🧪 Test EmailJS Ultra Simple</h1>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Ce test utilise directement EmailJS avec la configuration hardcodée pour éliminer toute variable.
          </p>
          
          <button
            onClick={testUltraSimple}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? '⏳ Test en cours...' : '🚀 Tester EmailJS'}
          </button>
        </div>

        {result && (
          <div className={`p-6 rounded-lg border ${
            result.success 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <h3 className="font-semibold text-lg mb-3">
              {result.success ? '✅ Succès' : '❌ Échec'}
            </h3>
            
            {result.success ? (
              <div>
                <p className="mb-2">{result.message}</p>
                <details className="mt-4">
                  <summary className="cursor-pointer font-semibold">Détails de la réponse</summary>
                  <pre className="mt-2 p-3 bg-white rounded border text-sm overflow-x-auto">
                    {JSON.stringify(result.response, null, 2)}
                  </pre>
                </details>
              </div>
            ) : (
              <div>
                <p className="mb-4">
                  <strong>Erreur:</strong> {result.error}
                </p>
                
                <details className="mt-4">
                  <summary className="cursor-pointer font-semibold">Analyse complète de l'erreur</summary>
                  <pre className="mt-2 p-3 bg-white rounded border text-sm overflow-x-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Configuration utilisée :</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Service ID:</strong> service_xb0o03d</li>
            <li>• <strong>Template ID:</strong> template_wvesgq6</li>
            <li>• <strong>Public Key:</strong> TNl3r0YjPN8-uGT_f</li>
            <li>• <strong>Email de test:</strong> test@example.com</li>
          </ul>
          
          <p className="mt-3 text-sm text-blue-600">
            💡 Si ce test échoue, le problème vient de la configuration EmailJS elle-même.
            Si il réussit, le problème vient de nos services wrapper.
          </p>
        </div>
      </div>
    </div>
  )
}
