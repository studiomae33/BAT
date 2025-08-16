#!/bin/bash

# Script pour configurer proprement les variables Vercel
echo "🔧 Configuration propre des variables Vercel..."

# Méthode propre via fichier temporaire
echo -n "thomas@guy.fr" > .admin_email
echo -n "antoinelebg" > .admin_password

# Configuration via vercel env add avec stdin
cat .admin_email | vercel env add ADMIN_EMAIL production --stdin
cat .admin_password | vercel env add ADMIN_PASSWORD production --stdin

# Nettoyage
rm -f .admin_email .admin_password

echo "✅ Variables configurées proprement"
