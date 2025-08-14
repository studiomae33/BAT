'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/Button'
import { TextField } from '@/components/Fields'
import { Logo } from '@/components/Logo'
import { SlimLayout } from '@/components/SlimLayout'

export default function Home() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirection vers l'admin
        router.push('/admin')
      } else {
        setError(data.error || 'Erreur de connexion')
      }
    } catch (err) {
      setError('Erreur de connexion au serveur')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <SlimLayout>
      <div className="flex">
        <Logo className="h-10 w-auto" />
      </div>
      <h2 className="mt-20 text-lg font-semibold text-gray-900">
        Administration BAT
      </h2>
      <p className="mt-2 text-sm text-gray-700">
        Connectez-vous pour gérer l&apos;envoi des BAT
      </p>
      
      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 gap-y-8">
        <TextField
          label="Adresse email"
          name="email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Mot de passe"
          name="password"
          type="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <div>
          <Button 
            type="submit" 
            variant="solid" 
            color="blue" 
            className="w-full"
            disabled={isLoading}
          >
            <span>
              {isLoading ? 'Connexion...' : 'Se connecter'} <span aria-hidden="true">&rarr;</span>
            </span>
          </Button>
        </div>
      </form>
      
      {/* Footer discret avec info système */}
      <div className="mt-16 text-center">
        <p className="text-xs text-gray-400">
          Système de gestion des BAT (Bon À Tirer)
        </p>
      </div>
    </SlimLayout>
  )
}
