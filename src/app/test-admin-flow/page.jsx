'use client'

import { useState } from 'react'

export default function TestAdminFlow() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState([])

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, { timestamp, message, type }])
    console.log(`[${timestamp}] ${message}`)
  }

  const testAdminFlow = async () => {
    setLoading(true)
    setResult(null)
    setLogs([])

    try {
      addLog('🚀 Début du test du flow admin', 'info')

      // Simuler les données qu'on aurait après upload API
      const mockUploadResult = {
        success: true,
        batId: 'test_' + Date.now(),
        batToken: 'token_' + Date.now(),
        recipientEmail: 'test@example.com',
        customMessage: 'Message de test depuis le flow admin',
        originalFileName: 'test-document.pdf',
        needsEmailSend: true
      }

      addLog('📄 Données simulées d\'upload créées', 'success')
      addLog(`BAT ID: ${mockUploadResult.batId}`, 'info')
      addLog(`Token: ${mockUploadResult.batToken.substring(0, 20)}...`, 'info')

      // Reproduire exactement le code de la page admin
      if (mockUploadResult.needsEmailSend) {
        addLog('📧 needsEmailSend = true, envoi email requis', 'info')
        
        try {
          addLog('📦 Import du service email client...', 'info')
          const { sendBATEmailClient } = await import('@/lib/email-client')
          
          addLog('📧 Appel sendBATEmailClient avec paramètres:', 'info')
          addLog(`  - recipientEmail: ${mockUploadResult.recipientEmail}`, 'info')
          addLog(`  - batToken: ${mockUploadResult.batToken}`, 'info')
          addLog(`  - customMessage: ${mockUploadResult.customMessage}`, 'info')
          addLog(`  - originalFileName: ${mockUploadResult.originalFileName}`, 'info')
          
          const emailResult = await sendBATEmailClient(
            mockUploadResult.recipientEmail,
            mockUploadResult.batToken,
            mockUploadResult.customMessage,
            mockUploadResult.originalFileName
          )
          
          addLog('📧 Résultat sendBATEmailClient reçu', 'info')
          
          if (emailResult && emailResult.success) {
            addLog('✅ Email envoyé avec succès !', 'success')
            setResult({
              success: true,
              message: `Email envoyé avec succès à ${mockUploadResult.recipientEmail}`,
              emailResult
            })
          } else {
            addLog(`❌ Erreur envoi email: ${emailResult?.error || 'Résultat undefined'}`, 'error')
            setResult({
              success: false,
              error: `Erreur envoi email: ${emailResult?.error || 'undefined'}`,
              emailResult
            })
          }
        } catch (emailError) {
          addLog(`❌ Exception lors de l'envoi email: ${emailError.message}`, 'error')
          setResult({
            success: false,
            error: `Exception: ${emailError.message}`,
            exception: emailError
          })
        }
      } else {
        addLog('ℹ️ needsEmailSend = false, pas d\'envoi email', 'info')
      }

    } catch (error) {
      addLog(`❌ Erreur globale: ${error.message}`, 'error')
      setResult({
        success: false,
        error: error.message,
        exception: error
      })
    } finally {
      setLoading(false)
      addLog('🏁 Test terminé', 'info')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">🧪 Test du Flow Admin</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contrôles */}
          <div>
            <p className="text-gray-600 mb-4">
              Ce test reproduit exactement le flux d'envoi d'email de la page d'administration 
              après un upload successful.
            </p>
            
            <button
              onClick={testAdminFlow}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? '⏳ Test en cours...' : '🚀 Tester le Flow Admin'}
            </button>

            {/* Résultat */}
            {result && (
              <div className={`mt-6 p-4 rounded-lg border ${
                result.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <h3 className="font-semibold mb-2">
                  {result.success ? '✅ Succès' : '❌ Échec'}
                </h3>
                
                <p className="text-sm mb-3">
                  {result.success ? result.message : result.error}
                </p>

                {result.emailResult && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-xs font-semibold">Détails EmailJS</summary>
                    <pre className="mt-2 p-2 bg-white rounded border text-xs overflow-x-auto">
                      {JSON.stringify(result.emailResult, null, 2)}
                    </pre>
                  </details>
                )}

                {result.exception && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-xs font-semibold">Stack Trace</summary>
                    <pre className="mt-2 p-2 bg-white rounded border text-xs overflow-x-auto">
                      {result.exception.stack}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </div>

          {/* Logs en temps réel */}
          <div>
            <h3 className="font-semibold mb-3">📋 Logs en temps réel</h3>
            <div className="bg-black text-green-400 p-4 rounded-lg h-96 overflow-y-auto font-mono text-xs">
              {logs.length === 0 ? (
                <p className="text-gray-500">Aucun log pour le moment...</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className={`mb-1 ${
                    log.type === 'error' ? 'text-red-400' : 
                    log.type === 'success' ? 'text-green-400' : 
                    'text-green-300'
                  }`}>
                    <span className="text-gray-400">[{log.timestamp}]</span> {log.message}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">🎯 Objectif</h3>
          <p className="text-sm text-yellow-700">
            Ce test doit nous dire exactement où et pourquoi nous obtenons "undefined" 
            comme erreur d'envoi d'email. Surveillez les logs pour voir à quel moment 
            le problème se produit.
          </p>
        </div>
      </div>
    </div>
  )
}
