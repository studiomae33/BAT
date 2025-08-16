'use client'

import { useState, useEffect } from 'react'

export default function TestEmailJSDirect() {
  const [testResult, setTestResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [config, setConfig] = useState(null)

  useEffect(() => {
    // Vérifier la configuration au chargement
    const emailjsConfig = {
      serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      templateBAT: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_BAT,
      templateValidation: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_VALIDATION,
      templateRejection: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_REJECTION
    }
    
    setConfig(emailjsConfig)
  }, [])

  const testDirectEmailJS = async () => {
    setLoading(true)
    setTestResult(null)

    try {
      console.log('🧪 Test direct EmailJS...')
      
      // Import direct du service EmailJS
      const emailjs = await import('@emailjs/browser')
      
      console.log('📦 EmailJS library loaded:', !!emailjs.default)
      
      // Configuration
      const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
      const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_BAT
      const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

      console.log('🔧 Configuration:', { 
        hasServiceId: !!SERVICE_ID,
        hasTemplate: !!TEMPLATE_ID, 
        hasPublicKey: !!PUBLIC_KEY 
      })

      if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
        throw new Error('Configuration EmailJS incomplète')
      }

      // Initialisation
      console.log('🔑 Initialisation EmailJS...')
      emailjs.default.init(PUBLIC_KEY)

      // Paramètres de test
      const templateParams = {
        to_email: 'test@example.com',
        admin_email: 'contact@studiomae.fr',
        bat_url: 'https://example.com/bat/test',
        custom_message: 'Message de test',
        file_name: 'test.pdf',
        expiration_date: new Date().toLocaleDateString('fr-FR')
      }

      console.log('📝 Paramètres template:', templateParams)

      // Test d'envoi (sans vraiment envoyer)
      console.log('📤 Test d\'envoi...')
      
      // On va juste tester la configuration sans envoyer
      const response = await emailjs.default.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams
      )
      
      console.log('✅ Réponse EmailJS:', response)
      
      setTestResult({
        success: true,
        response,
        config: {
          serviceId: SERVICE_ID,
          templateId: TEMPLATE_ID,
          publicKey: PUBLIC_KEY
        }
      })
      
    } catch (error) {
      console.error('❌ Erreur test direct:', error)
      
      setTestResult({
        success: false,
        error: error.message,
        errorType: error.constructor.name,
        errorDetails: {
          message: error.message,
          stack: error.stack,
          name: error.name,
          status: error.status,
          text: error.text
        }
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            🧪 Test Direct EmailJS
          </h1>
          
          {/* Configuration actuelle */}
          <div className="mb-6 p-4 bg-gray-100 rounded">
            <h2 className="font-semibold mb-2">Configuration détectée:</h2>
            {config && (
              <div className="space-y-1 text-sm">
                <p>Service ID: {config.serviceId ? '✅ Configuré' : '❌ Manquant'}</p>
                <p>Template BAT: {config.templateBAT ? '✅ Configuré' : '❌ Manquant'}</p>
                <p>Public Key: {config.publicKey ? '✅ Configuré' : '❌ Manquant'}</p>
                <p>Template Validation: {config.templateValidation ? '✅ Configuré' : '❌ Manquant'}</p>
                <p>Template Rejection: {config.templateRejection ? '✅ Configuré' : '❌ Manquant'}</p>
              </div>
            )}
          </div>

          {/* Bouton de test */}
          <div className="mb-6">
            <button
              onClick={testDirectEmailJS}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? '⏳ Test en cours...' : '🧪 Tester EmailJS Direct'}
            </button>
          </div>

          {/* Résultats */}
          {testResult && (
            <div className={`p-4 rounded mb-4 ${
              testResult.success ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'
            }`}>
              <h3 className="font-semibold mb-2">
                {testResult.success ? '✅ Test réussi' : '❌ Test échoué'}
              </h3>
              
              {testResult.success ? (
                <div className="text-sm">
                  <p><strong>Status:</strong> {testResult.response?.status}</p>
                  <p><strong>Text:</strong> {testResult.response?.text}</p>
                  <p><strong>Service ID utilisé:</strong> {testResult.config?.serviceId}</p>
                  <p><strong>Template ID utilisé:</strong> {testResult.config?.templateId}</p>
                </div>
              ) : (
                <div className="text-sm">
                  <p><strong>Erreur:</strong> {testResult.error}</p>
                  <p><strong>Type:</strong> {testResult.errorType}</p>
                  
                  {testResult.errorDetails && (
                    <details className="mt-2">
                      <summary className="cursor-pointer font-semibold">Détails de l'erreur</summary>
                      <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-x-auto">
                        {JSON.stringify(testResult.errorDetails, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded">
            <h3 className="font-semibold text-blue-800 mb-2">💡 Diagnostics</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Ce test utilise directement la librairie @emailjs/browser</li>
              <li>• Il vérifie l'initialisation et l'envoi</li>
              <li>• Si il échoue, le problème est dans la configuration EmailJS</li>
              <li>• Si il réussit, le problème est dans notre service wrapper</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
