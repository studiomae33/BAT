#!/bin/bash

echo "🚀 Déploiement urgent - Fix erreur EmailJS 'undefined'"

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Êtes-vous dans le bon répertoire?"
    exit 1
fi

echo "📁 Répertoire actuel: $(pwd)"

# Ajouter la variable manquante sur Vercel
echo "🔧 Ajout de la variable NEXT_PUBLIC_ADMIN_EMAIL sur Vercel..."
npx vercel env add NEXT_PUBLIC_ADMIN_EMAIL "contact@studiomae.fr" production --yes 2>/dev/null || echo "Variable déjà présente ou erreur ajout"

# Build et test local rapide
echo "🔨 Build local pour vérifier les erreurs..."
npm run build
BUILD_STATUS=$?

if [ $BUILD_STATUS -ne 0 ]; then
    echo "❌ Build échoué, résolution des erreurs..."
    exit 1
fi

echo "✅ Build réussi"

# Déploiement sur Vercel
echo "🚀 Déploiement sur Vercel..."
npx vercel --prod

echo "✅ Déploiement terminé"
echo ""
echo "🧪 Tests recommandés:"
echo "1. https://bat-orcin.vercel.app/diagnostic-complet"
echo "2. https://bat-orcin.vercel.app/test-ultra-simple"
echo "3. https://bat-orcin.vercel.app/admin (test d'envoi réel)"
echo ""
echo "📋 Vérifications post-déploiement:"
echo "- Toutes les variables NEXT_PUBLIC_EMAILJS_* sont configurées"
echo "- La variable NEXT_PUBLIC_ADMIN_EMAIL est ajoutée"
echo "- Logs détaillés ajoutés pour identifier l'erreur 'undefined'"
