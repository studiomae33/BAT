'use client'
import { useState } from 'react'
import { sendBATEmailClient } from '../../lib/email-client'

export default function TestTemplateRapide() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [email, setEmail] = useState('contact@studiomae.fr')

  const testEnvoiBAT = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      console.log('🧪 Test envoi BAT avec template universel template_2gv3p2h')
      
      // Paramètres pour le template universel
      const templateParams = {
        action_type: "bat",
        recipient_email: email,
        admin_email: "contact@studiomae.fr",
        bat_id: "BAT-TEST-" + Date.now(),
        file_name: "document-test.pdf",
        date: new Date().toLocaleDateString('fr-FR'),
        validation_url: `https://bat-fy7c1vn4c-antoines-projects-1b9977a0.vercel.app/client/test-token?action=validate`,
        rejection_url: `https://bat-fy7c1vn4c-antoines-projects-1b9977a0.vercel.app/client/test-token?action=reject`,
        message: `<p><strong>Test du template universel EmailJS</strong></p>
                  <p>Ce message est un test du nouveau template template_2gv3p2h créé avec le code HTML fourni.</p>
                  <p>Si vous recevez cet email avec le bon design et les boutons d'action, le template fonctionne parfaitement ! 🎉</p>`,
        additional_message: "Ceci est un message de test pour valider le template universel EmailJS."
      }
      
      const emailResult = await sendBATEmailClient(
        email,
        'test-token-' + Date.now(),
        templateParams.message,
        'document-test.pdf',
        'template_2gv3p2h', // Template universel
        templateParams // Tous les paramètres du template
      )
      
      console.log('✅ Résultat test:', emailResult)
      setResult({ success: true, data: emailResult })
      
    } catch (error) {
      console.error('❌ Erreur test:', error)
      setResult({ success: false, error: error.message })
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            🚀 Test Template Universel EmailJS
          </h1>
          
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  <strong>Template configuré :</strong> template_2gv3p2h<br/>
                  <strong>Status :</strong> Prêt pour test en production
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email de test :
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="votre@email.com"
            />
            <p className="text-sm text-gray-600 mt-1">
              L'email sera envoyé à cette adresse pour vérifier le template
            </p>
          </div>

          <button
            onClick={testEnvoiBAT}
            disabled={loading || !email}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Envoi en cours...' : '📧 Tester l\'envoi BAT avec template universel'}
          </button>
        </div>

        {/* Informations sur le template */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📋 Ce qui sera testé
          </h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Template ID :</span>
              <span className="text-gray-600">template_2gv3p2h</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Action :</span>
              <span className="text-gray-600">Envoi BAT (action_type: "bat")</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Design :</span>
              <span className="text-gray-600">Header Studio MAE + boutons d'action</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Variables :</span>
              <span className="text-gray-600">Toutes les variables du template universel</span>
            </div>
          </div>
        </div>

        {/* Résultats */}
        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              Résultat du test
            </h3>
            
            {result.success ? (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 text-green-400">✅</div>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-green-800">Succès !</h4>
                    <p className="text-sm text-green-700 mt-1">
                      L'email avec le template universel a été envoyé. Vérifiez votre boîte mail.
                    </p>
                    <details className="mt-2">
                      <summary className="text-sm text-green-600 cursor-pointer">Détails techniques</summary>
                      <pre className="text-xs text-green-600 mt-2 bg-green-100 p-2 rounded overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 text-red-400">❌</div>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-red-800">Erreur</h4>
                    <p className="text-sm text-red-700 mt-1">{result.error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions post-test */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6">
          <div className="flex">
            <div className="ml-3">
              <h4 className="font-medium text-blue-800">Après le test :</h4>
              <ol className="text-sm text-blue-700 mt-2 list-decimal list-inside space-y-1">
                <li>Vérifiez que l'email arrive avec le bon design Studio MAE</li>
                <li>Confirmez que les boutons "Valider" et "Refuser" sont présents</li>
                <li>Testez les liens d'action (ils mèneront à des pages de test)</li>
                <li>Si tout fonctionne, le système BAT est prêt pour la production !</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
