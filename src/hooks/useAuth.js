'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Hook pour gérer l'authentification
 */
export function useAuth(requireAuth = false) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    checkAuthentication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuthentication = async () => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setUser(data.user);
        console.log('✅ Utilisateur authentifié:', data.user.email);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        
        // Rediriger si l'auth est requise
        if (requireAuth) {
          console.log('❌ Non authentifié - Redirection vers /');
          router.push('/');
        }
      }
    } catch (error) {
      console.error('Erreur vérification auth:', error);
      setIsAuthenticated(false);
      setUser(null);
      
      if (requireAuth) {
        router.push('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setUser(data.user);
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      return { success: false, error: 'Erreur de connexion' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      setIsAuthenticated(false);
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    checkAuthentication
  };
}

/**
 * Composant pour protéger des pages nécessitant une authentification
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth(true);

  // Écran de chargement pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification de l&apos;authentification...</p>
        </div>
      </div>
    );
  }

  // Ne pas afficher le contenu si non authentifié
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Accès non autorisé. Redirection...</p>
        </div>
      </div>
    );
  }

  return children;
}
