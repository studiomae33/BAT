'use client'
import { useState } from 'react'
import { sendBATEmailClient } from '../../lib/email-client'

export default function TestUniversalTemplate() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [templateId, setTemplateId] = useState('template_wvesgq6')

  const testScenarios = [
    {
      name: "📤 Envoyer BAT",
      params: {
        action_type: "bat",
        recipient_email: "test@example.com",
        admin_email: "contact@studiomae.fr",
        bat_id: "BAT-001",
        file_name: "document-test.pdf",
        date: new Date().toLocaleDateString('fr-FR'),
        validation_url: "https://bat-system.vercel.app/client/abc123?action=validate",
        rejection_url: "https://bat-system.vercel.app/client/abc123?action=reject",
        message: "Bonjour,<br><br>Voici le BAT pour validation. Merci de cliquer sur les boutons ci-dessous pour valider ou refuser.",
        additional_message: "Ce document est confidentiel et destiné uniquement au destinataire."
      }
    },
    {
      name: "✅ Validation BAT",
      params: {
        action_type: "validation",
        recipient_email: "admin@studiomae.fr",
        admin_email: "contact@studiomae.fr",
        bat_id: "BAT-001",
        file_name: "document-test.pdf",
        date: new Date().toLocaleDateString('fr-FR'),
        message: "Le client a validé le BAT avec succès !",
        additional_message: "Vous pouvez maintenant procéder à la finalisation du projet."
      }
    },
    {
      name: "❌ Refus BAT",
      params: {
        action_type: "rejection",
        recipient_email: "admin@studiomae.fr",
        admin_email: "contact@studiomae.fr",
        bat_id: "BAT-001",
        file_name: "document-test.pdf",
        date: new Date().toLocaleDateString('fr-FR'),
        message: "Le client a refusé le BAT.",
        additional_message: "Des modifications sont nécessaires avant une nouvelle soumission."
      }
    }
  ]

  const testTemplate = async (scenario) => {
    setLoading(true)
    setResult(null)
    
    try {
      console.log('🧪 Test scenario:', scenario.name)
      console.log('📧 Paramètres:', scenario.params)
      
      const emailResult = await sendBATEmailClient(
        scenario.params.recipient_email,
        'fake-token',
        scenario.params.message || 'Message de test',
        scenario.params.file_name || 'test.pdf',
        templateId, // Utilise le template ID configuré
        scenario.params // Passe tous les paramètres du scénario
      )
      
      console.log('✅ Résultat:', emailResult)
      setResult({ success: true, data: emailResult, scenario: scenario.name })
      
    } catch (error) {
      console.error('❌ Erreur:', error)
      setResult({ success: false, error: error.message, scenario: scenario.name })
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            🧪 Test Template EmailJS Universel
          </h1>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template ID à tester :
            </label>
            <input
              type="text"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="template_xxxxx"
            />
            <p className="text-sm text-gray-600 mt-1">
              Changez ceci si vous créez un nouveau template dans EmailJS
            </p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <h3 className="font-medium text-yellow-800">Instructions :</h3>
            <ol className="text-sm text-yellow-700 mt-2 list-decimal list-inside space-y-1">
              <li>Copiez le contenu de <code>TEMPLATE-EMAILJS-UNIVERSAL.html</code></li>
              <li>Créez un nouveau template dans EmailJS avec ce contenu</li>
              <li>Remplacez le Template ID ci-dessus</li>
              <li>Testez les 3 scénarios ci-dessous</li>
            </ol>
          </div>
        </div>

        {/* Scénarios de test */}
        <div className="space-y-4">
          {testScenarios.map((scenario, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {scenario.name}
                </h3>
                <button
                  onClick={() => testTemplate(scenario)}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Test en cours...' : 'Tester'}
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-md p-4 mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Paramètres :</h4>
                <pre className="text-xs text-gray-600 overflow-x-auto">
                  {JSON.stringify(scenario.params, null, 2)}
                </pre>
              </div>
            </div>
          ))}
        </div>

        {/* Résultats */}
        {result && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              Résultat du test : {result.scenario}
            </h3>
            
            {result.success ? (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h4 className="font-medium text-green-800 mb-2">✅ Succès !</h4>
                <pre className="text-sm text-green-700 overflow-x-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <h4 className="font-medium text-red-800 mb-2">❌ Erreur</h4>
                <p className="text-sm text-red-700">{result.error}</p>
              </div>
            )}
          </div>
        )}

        {/* Informations sur les variables */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📋 Variables disponibles dans le template
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Variables principales :</h4>
              <ul className="space-y-1 text-gray-600">
                <li><code>action_type</code> - "bat", "validation", ou "rejection"</li>
                <li><code>recipient_email</code> - Email du destinataire</li>
                <li><code>admin_email</code> - Email de l'expéditeur</li>
                <li><code>message</code> - Message principal (HTML supporté)</li>
                <li><code>additional_message</code> - Message complémentaire</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Variables BAT :</h4>
              <ul className="space-y-1 text-gray-600">
                <li><code>bat_id</code> - Identifiant du BAT</li>
                <li><code>file_name</code> - Nom du fichier PDF</li>
                <li><code>date</code> - Date de création</li>
                <li><code>validation_url</code> - Lien validation</li>
                <li><code>rejection_url</code> - Lien refus</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
