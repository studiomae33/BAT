'use client'

import { useState } from 'react'

export default function DebugConfig() {
  const [envVars, setEnvVars] = useState(null)

  const checkConfig = () => {
    const vars = {
      NEXT_PUBLIC_EMAILJS_SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      NEXT_PUBLIC_EMAILJS_TEMPLATE_BAT: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_BAT,
      NEXT_PUBLIC_EMAILJS_TEMPLATE_VALIDATION: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_VALIDATION,
      NEXT_PUBLIC_EMAILJS_TEMPLATE_REJECTION: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_REJECTION,
    }
    
    console.log('🔍 Variables d\'environnement:', vars)
    setEnvVars(vars)
  }

  const testMinimal = async () => {
    try {
      console.log('📦 Test import EmailJS...')
      const emailjsModule = await import('@emailjs/browser')
      console.log('✅ EmailJS importé:', {
        hasInit: typeof emailjsModule.default.init === 'function',
        hasSend: typeof emailjsModule.default.send === 'function',
        version: emailjsModule.default.version || 'inconnu'
      })

      // Test d'initialisation
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      if (publicKey) {
        console.log('🔑 Test initialisation...')
        emailjsModule.default.init(publicKey)
        console.log('✅ EmailJS initialisé')
      } else {
        console.log('❌ Pas de clé publique')
      }

    } catch (error) {
      console.error('❌ Erreur test minimal:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">🔍 Debug Configuration</h1>
        
        <div className="space-y-4">
          <button
            onClick={checkConfig}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Vérifier les variables d'environnement
          </button>

          <button
            onClick={testMinimal}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ml-4"
          >
            Test minimal EmailJS
          </button>
        </div>

        {envVars && (
          <div className="mt-6 p-4 bg-gray-100 rounded">
            <h2 className="font-semibold mb-4">Variables d'environnement détectées :</h2>
            <div className="space-y-2 text-sm">
              {Object.entries(envVars).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="font-mono">{key}:</span>
                  <span className={value ? "text-green-600" : "text-red-600"}>
                    {value ? `✅ ${value.substring(0, 20)}${value.length > 20 ? '...' : ''}` : '❌ Non définie'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-semibold text-yellow-800 mb-2">💡 Vérifications</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>1. Toutes les variables NEXT_PUBLIC_EMAILJS_* doivent être définies</li>
            <li>2. Les variables doivent être disponibles côté client (préfixe NEXT_PUBLIC_)</li>
            <li>3. Vérifiez la console du navigateur pour les messages</li>
            <li>4. Testez sur une page différente pour éliminer les problèmes de cache</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
