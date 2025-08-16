'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { getEmailServiceInfo, testEmailServiceClient } from '@/lib/email-client';

export default function EmailServiceSelector() {
  const [emailServiceInfo, setEmailServiceInfo] = useState(null);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    // Obtenir les informations sur le service email
    const serviceInfo = getEmailServiceInfo();
    setEmailServiceInfo(serviceInfo);
  }, []);

  const testEmailService = async () => {
    setTestResult('testing');
    
    try {
      const result = await testEmailServiceClient();
      setTestResult(result.success ? 'success' : 'error');
    } catch (error) {
      setTestResult('error');
    }
  };

  const getServiceIcon = () => {
    if (!emailServiceInfo) return '⏳';
    
    switch (emailServiceInfo.service) {
      case 'emailjs': return '📧';
      case 'none': return '❌';
      default: return '⏳';
    }
  };

  const getServiceName = () => {
    if (!emailServiceInfo) return 'Chargement...';
    
    return emailServiceInfo.type || 'Service inconnu';
  };

  const getConfigInstructions = () => {
    if (!emailServiceInfo) return null;
    
    switch (emailServiceInfo.service) {
      case 'emailjs':
        return (
          <div className="text-sm text-green-700">
            ✅ EmailJS configuré et prêt à utiliser
          </div>
        );
      case 'none':
        return (
          <div className="text-sm text-red-700">
            ❌ Configurez EmailJS pour envoyer des emails
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Configuration Email
      </h3>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getServiceIcon()}</span>
          <div>
            <div className="font-medium text-gray-900">
              {getServiceName()}
            </div>
            {getConfigInstructions()}
          </div>
        </div>
        
        {emailServiceInfo?.service !== 'none' && (
          <Button
            onClick={testEmailService}
            variant="outline"
            color="blue"
            disabled={testResult === 'testing'}
          >
            {testResult === 'testing' ? 'Test...' : 'Tester'}
          </Button>
        )}
      </div>

      {testResult && testResult !== 'testing' && (
        <div className={`mt-4 p-3 rounded-md ${
          testResult === 'success' 
            ? 'bg-green-50 text-green-700' 
            : 'bg-red-50 text-red-700'
        }`}>
          {testResult === 'success' 
            ? '✅ Service email fonctionnel !' 
            : '❌ Erreur de configuration email'
          }
        </div>
      )}

      {emailServiceInfo?.service === 'none' && (
        <div className="mt-4 p-4 bg-yellow-50 rounded-md">
          <h4 className="font-medium text-yellow-800 mb-2">
            🚀 Configuration rapide avec EmailJS
          </h4>
          <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
            <li>Créez un compte sur <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer" className="underline">emailjs.com</a></li>
            <li>Configurez votre service email (Gmail, Outlook...)</li>
            <li>Créez vos templates email</li>
            <li>Ajoutez vos clés dans les variables d&apos;environnement</li>
          </ol>
          <a 
            href="/CONFIGURATION-EMAILJS.md" 
            target="_blank"
            className="inline-block mt-2 text-sm text-yellow-800 underline"
          >
            📖 Guide complet de configuration
          </a>
        </div>
      )}
    </div>
  );
}
