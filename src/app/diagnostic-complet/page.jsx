'use client'

import { useState } from 'react'

export default function DiagnosticComplet() {
  const [results, setResults] = useState({})
  const [currentTest, setCurrentTest] = useState('')

  const runTest = async (testName, testFunction) => {
    setCurrentTest(testName)
    console.log(`🧪 Début du test: ${testName}`)
    
    try {
      const result = await testFunction()
      setResults(prev => ({
        ...prev,
        [testName]: { success: true, ...result }
      }))
      console.log(`✅ Test réussi: ${testName}`, result)
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [testName]: { 
          success: false, 
          error: error.message,
          details: error.stack
        }
      }))
      console.error(`❌ Test échoué: ${testName}`, error)
    }
    setCurrentTest('')
  }

  const testEnvironmentVariables = async () => {
    const vars = {
      NEXT_PUBLIC_EMAILJS_SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      NEXT_PUBLIC_EMAILJS_TEMPLATE_BAT: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_BAT,
      NEXT_PUBLIC_EMAILJS_TEMPLATE_VALIDATION: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_VALIDATION,
      NEXT_PUBLIC_EMAILJS_TEMPLATE_REJECTION: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_REJECTION,
      NEXT_PUBLIC_ADMIN_EMAIL: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
    }

    const missing = Object.entries(vars).filter(([key, value]) => !value)
    const present = Object.entries(vars).filter(([key, value]) => !!value)

    return {
      message: `${present.length}/${Object.keys(vars).length} variables configurées`,
      variables: vars,
      missing: missing.map(([key]) => key),
      present: present.map(([key, value]) => ({ key, value: value.substring(0, 15) + '...' }))
    }
  }

  const testEmailJSImport = async () => {
    const emailjsModule = await import('@emailjs/browser')
    const emailjs = emailjsModule.default

    return {
      message: 'Import EmailJS réussi',
      hasInit: typeof emailjs.init === 'function',
      hasSend: typeof emailjs.send === 'function',
      version: emailjs.version || 'unknown'
    }
  }

  const testEmailJSConfig = async () => {
    const { initEmailJS } = await import('@/lib/emailjs-service')
    
    // Tester l'initialisation
    initEmailJS()
    
    return {
      message: 'Configuration EmailJS valide'
    }
  }

  const testDirectEmailJS = async () => {
    const emailjsModule = await import('@emailjs/browser')
    const emailjs = emailjsModule.default

    // Configuration directe
    const config = {
      serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_BAT,
      publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    }

    // Initialisation
    emailjs.init(config.publicKey)

    // Paramètres de test
    const params = {
      to_email: 'test@example.com',
      admin_email: 'contact@studiomae.fr',
      bat_url: 'https://example.com/test',
      custom_message: 'Test message',
      file_name: 'test.pdf',
      expiration_date: new Date().toLocaleDateString('fr-FR')
    }

    // Tentative d'envoi (va vraiment envoyer un email de test !)
    const response = await emailjs.send(config.serviceId, config.templateId, params)

    return {
      message: 'Email de test envoyé avec succès',
      response: response
    }
  }

  const testClientService = async () => {
    const { sendBATEmailClient } = await import('@/lib/email-client')
    
    const result = await sendBATEmailClient(
      'test@example.com',
      'token_test_' + Date.now(),
      'Message de test depuis le service client',
      'test-document.pdf'
    )

    return {
      message: 'Service client testé',
      result: result
    }
  }

  const runAllTests = async () => {
    setResults({})
    
    const tests = [
      ['Variables d\'environnement', testEnvironmentVariables],
      ['Import EmailJS', testEmailJSImport],
      ['Configuration EmailJS', testEmailJSConfig],
      ['EmailJS Direct', testDirectEmailJS],
      ['Service Client', testClientService]
    ]

    for (const [name, testFn] of tests) {
      await runTest(name, testFn)
      // Petit délai entre les tests
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold mb-6">🔬 Diagnostic Complet EmailJS</h1>
        
        <div className="mb-6">
          <button
            onClick={runAllTests}
            disabled={!!currentTest}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {currentTest ? `⏳ Test en cours: ${currentTest}` : '🚀 Lancer tous les tests'}
          </button>
        </div>

        {/* Résultats */}
        <div className="space-y-6">
          {Object.entries(results).map(([testName, result]) => (
            <div
              key={testName}
              className={`p-6 rounded-lg border ${
                result.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <h3 className="font-semibold text-lg mb-3">
                {result.success ? '✅' : '❌'} {testName}
              </h3>
              
              <p className="text-sm mb-3">
                {result.success ? result.message : result.error}
              </p>

              {/* Détails spécifiques */}
              {result.variables && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Variables détectées :</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {result.present?.map((item) => (
                      <div key={item.key} className="text-green-700">
                        ✅ {item.key}: {item.value}
                      </div>
                    ))}
                    {result.missing?.map((key) => (
                      <div key={key} className="text-red-700">
                        ❌ {key}: Non définie
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.response && (
                <details className="mt-4">
                  <summary className="cursor-pointer font-semibold">Réponse EmailJS</summary>
                  <pre className="mt-2 p-3 bg-white rounded border text-xs overflow-x-auto">
                    {JSON.stringify(result.response, null, 2)}
                  </pre>
                </details>
              )}

              {result.result && (
                <details className="mt-4">
                  <summary className="cursor-pointer font-semibold">Résultat du service</summary>
                  <pre className="mt-2 p-3 bg-white rounded border text-xs overflow-x-auto">
                    {JSON.stringify(result.result, null, 2)}
                  </pre>
                </details>
              )}

              {result.details && !result.success && (
                <details className="mt-4">
                  <summary className="cursor-pointer font-semibold">Stack Trace</summary>
                  <pre className="mt-2 p-3 bg-white rounded border text-xs overflow-x-auto">
                    {result.details}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-3">🎯 Interprétation des résultats</h3>
          <ul className="text-sm text-blue-700 space-y-2">
            <li><strong>Variables d'environnement :</strong> Toutes les variables NEXT_PUBLIC_EMAILJS_* doivent être définies</li>
            <li><strong>Import EmailJS :</strong> La librairie @emailjs/browser doit être correctement installée</li>
            <li><strong>Configuration EmailJS :</strong> L'initialisation avec la clé publique doit fonctionner</li>
            <li><strong>EmailJS Direct :</strong> L'envoi direct doit fonctionner (ATTENTION: envoie vraiment un email !)</li>
            <li><strong>Service Client :</strong> Notre wrapper doit fonctionner sans erreur</li>
          </ul>
          
          <p className="mt-4 text-sm font-semibold text-blue-800">
            💡 Le premier test qui échoue indique où se situe le problème !
          </p>
        </div>
      </div>
    </div>
  )
}
