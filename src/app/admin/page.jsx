'use client'

import { useState } from 'react'
import { Button } from '@/components/Button'
import EmailServiceSelector from '@/components/EmailServiceSelector'
import { ProtectedRoute, useAuth } from '@/hooks/useAuth'

/**
 * Composant pour l'upload de fichier avec drag & drop
 */
function FileUpload({ onFileSelect, selectedFile }) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type === 'application/pdf') {
      onFileSelect(files[0])
    }
  }

  const handleFileInput = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      onFileSelect(files[0])
    }
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragOver 
          ? 'border-blue-400 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileInput}
        className="hidden"
        id="pdf-upload"
      />
      
      {selectedFile ? (
        <div className="space-y-2">
          <div className="text-green-600 font-medium">✓ Fichier sélectionné</div>
          <div className="text-sm text-gray-600">{selectedFile.name}</div>
          <div className="text-xs text-gray-500">
            Taille: {Math.round(selectedFile.size / 1024)} KB
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-gray-600">
              Glissez votre fichier PDF ici ou{' '}
              <label htmlFor="pdf-upload" className="text-blue-600 hover:text-blue-500 cursor-pointer font-medium">
                cliquez pour parcourir
              </label>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Seuls les fichiers PDF sont acceptés
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Page d'administration principale
 */
export default function AdminPage() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [recipientEmail, setRecipientEmail] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedFile || !recipientEmail || !customMessage) {
      setMessage({ type: 'error', text: 'Tous les champs sont requis' })
      return
    }

    setIsLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const formData = new FormData()
      formData.append('pdfFile', selectedFile)
      formData.append('recipientEmail', recipientEmail)
      formData.append('customMessage', customMessage)

      const response = await fetch('/api/bat/send', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: `BAT envoyé avec succès à ${data.recipientEmail}` 
        })
        // Réinitialiser le formulaire
        setSelectedFile(null)
        setRecipientEmail('')
        setCustomMessage('')
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de l\'envoi' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Administration BAT
                </h1>
                {user && (
                  <p className="text-sm text-gray-600 mt-1">
                    Connecté en tant que {user.email}
                  </p>
                )}
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline"
                color="red"
              >
                Déconnexion
              </Button>
            </div>
          </div>
        </header>

      {/* Contenu principal */}
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Configuration Email */}
        <div className="mb-8">
          <EmailServiceSelector />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            Envoyer un nouveau BAT
          </h2>

          {/* Messages */}
          {message.text && (
            <div className={`mb-6 rounded-md p-4 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Upload de fichier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Document PDF (BAT)
              </label>
              <FileUpload 
                onFileSelect={setSelectedFile}
                selectedFile={selectedFile}
              />
            </div>

            {/* Email du destinataire */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email du destinataire
              </label>
              <input
                type="email"
                id="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="client@example.com"
                required
              />
            </div>

            {/* Message personnalisé */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message personnalisé
              </label>
              <textarea
                id="message"
                rows={4}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Bonjour, veuillez trouver ci-joint le BAT à valider..."
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Ce message sera inclus dans l&apos;email envoyé au client
              </p>
            </div>

            {/* Bouton d'envoi */}
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="solid"
                color="blue"
                disabled={isLoading}
                className="px-8 py-3"
              >
                {isLoading ? 'Envoi en cours...' : 'Envoyer le BAT'}
              </Button>
            </div>
          </form>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3">
            Comment ça fonctionne
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Uploadez votre fichier PDF (BAT) à valider</li>
            <li>Saisissez l&apos;adresse email du client</li>
            <li>Rédigez un message personnalisé pour accompagner l&apos;envoi</li>
            <li>Cliquez sur &quot;Envoyer le BAT&quot;</li>
            <li>Le client recevra un email avec un lien sécurisé pour visualiser et valider le BAT</li>
            <li>Vous serez notifié par email de la validation ou du refus du client</li>
          </ol>
        </div>
      </main>
    </div>
    </ProtectedRoute>
  )
}
