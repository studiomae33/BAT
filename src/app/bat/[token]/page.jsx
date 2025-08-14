'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/Button'

/**
 * Composant pour afficher le PDF avec zoom
 */
function PDFViewer({ pdfUrl, fileName }) {
  const [isZoomed, setIsZoomed] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            {fileName}
          </h3>
          <Button
            onClick={() => setIsZoomed(!isZoomed)}
            variant="outline"
            color="blue"
            className="flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
            <span>{isZoomed ? 'Zoom normal' : 'Agrandir'}</span>
          </Button>
        </div>
      </div>
      
      <div className={`relative ${isZoomed ? 'h-screen' : 'h-96 md:h-[600px]'}`}>
        <iframe
          src={pdfUrl}
          className="w-full h-full border-0"
          title="Aperçu PDF"
        />
      </div>
    </div>
  )
}

/**
 * Modale de refus avec options
 */
function RejectModal({ isOpen, onClose, onReject, phoneNumber }) {
  const [rejectionMessage, setRejectionMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleRejectWithMessage = async () => {
    setIsLoading(true)
    await onReject(rejectionMessage)
    setIsLoading(false)
  }

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Pourquoi refusez-vous ce BAT ?
        </h3>
        
        <div className="space-y-4">
          {/* Option 1: Message écrit */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">
              Envoyer un message explicatif
            </h4>
            <textarea
              value={rejectionMessage}
              onChange={(e) => setRejectionMessage(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Décrivez les modifications souhaitées..."
            />
            <Button
              onClick={handleRejectWithMessage}
              disabled={!rejectionMessage.trim() || isLoading}
              variant="solid"
              color="red"
              className="w-full mt-3"
            >
              {isLoading ? 'Envoi...' : 'Envoyer le refus'}
            </Button>
          </div>

          {/* Option 2: Appel téléphonique */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">
              Préférer un échange téléphonique
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Discutons directement des modifications nécessaires
            </p>
            <Button
              onClick={handleCall}
              variant="outline"
              color="blue"
              className="w-full"
            >
              📞 Appeler maintenant
            </Button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <Button
            onClick={onClose}
            variant="outline"
            color="gray"
            className="w-full"
          >
            Annuler
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * Page principale de visualisation du BAT
 */
export default function BATViewPage() {
  const params = useParams()
  const token = params.token

  const [batData, setBatData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [actionCompleted, setActionCompleted] = useState(false)

  // Charger les données du BAT
  useEffect(() => {
    if (!token) return

    const loadBAT = async () => {
      try {
        const response = await fetch(`/api/bat/${token}`)
        const data = await response.json()

        if (response.ok) {
          setBatData(data.bat)
        } else {
          setError(data.error || 'BAT non trouvé')
        }
      } catch (err) {
        setError('Erreur de connexion')
      } finally {
        setIsLoading(false)
      }
    }

    loadBAT()
  }, [token])

  // Validation du BAT
  const handleValidate = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch(`/api/bat/${token}/validate`, {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        setActionCompleted(true)
        setBatData(prev => ({ ...prev, status: 'validated' }))
      } else {
        setError(data.error || 'Erreur lors de la validation')
      }
    } catch (err) {
      setError('Erreur de connexion')
    } finally {
      setIsProcessing(false)
    }
  }

  // Refus du BAT
  const handleReject = async (rejectionMessage) => {
    try {
      const response = await fetch(`/api/bat/${token}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rejectionMessage }),
      })

      const data = await response.json()

      if (response.ok) {
        setActionCompleted(true)
        setBatData(prev => ({ ...prev, status: 'rejected' }))
        setShowRejectModal(false)
      } else {
        setError(data.error || 'Erreur lors du refus')
      }
    } catch (err) {
      setError('Erreur de connexion')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du BAT...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (actionCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className={`rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 ${
            batData.status === 'validated' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {batData.status === 'validated' ? (
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {batData.status === 'validated' ? 'BAT Validé ✅' : 'BAT Refusé ❌'}
          </h1>
          <p className="text-gray-600">
            {batData.status === 'validated' 
              ? 'Merci ! Votre validation a été envoyée.' 
              : 'Votre refus a été transmis. Vous serez recontacté prochainement.'
            }
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Validation de BAT
          </h1>
          <p className="mt-2 text-gray-600">
            Veuillez examiner le document ci-dessous et indiquer votre décision
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message personnalisé */}
        {batData.customMessage && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Message de l&apos;expéditeur
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  {batData.customMessage}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Visualiseur PDF */}
        <div className="mb-8">
          <PDFViewer 
            pdfUrl={`/api/bat/${token}/pdf`}
            fileName={batData.originalName}
          />
        </div>

        {/* Boutons d'action */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Quelle est votre décision ?
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleValidate}
              disabled={isProcessing}
              variant="solid"
              color="green"
              className="flex-1 py-4 text-lg"
            >
              {isProcessing ? 'Validation...' : '✅ Je valide le BAT'}
            </Button>
            
            <Button
              onClick={() => setShowRejectModal(true)}
              disabled={isProcessing}
              variant="solid" 
              color="red"
              className="flex-1 py-4 text-lg"
            >
              ❌ Je refuse le BAT
            </Button>
          </div>

          <p className="mt-4 text-sm text-gray-500 text-center">
            Une notification sera automatiquement envoyée suite à votre choix
          </p>
        </div>
      </main>

      {/* Modale de refus */}
      <RejectModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onReject={handleReject}
        phoneNumber="+33123456789" // Sera récupéré depuis la config
      />
    </div>
  )
}
