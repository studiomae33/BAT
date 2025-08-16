#!/bin/bash

# 🚀 Script de configuration rapide des variables Vercel
# Exécute toutes les commandes pour configurer les variables d'environnement

echo "🔧 Configuration des variables d'environnement Vercel..."

# Variables de sécurité et authentification
vercel env add JWT_SECRET "votre_jwt_secret_ici_changez_moi_pour_production_64_caracteres" production
vercel env add ADMIN_EMAIL "thomas@guy.fr" production
vercel env add ADMIN_PASSWORD "antoinelebg" production

# Variables EmailJS Studio MAE
vercel env add NEXT_PUBLIC_EMAILJS_SERVICE_ID "service_xb0o03d" production
vercel env add NEXT_PUBLIC_EMAILJS_TEMPLATE_BAT "template_wvesgq6" production
vercel env add NEXT_PUBLIC_EMAILJS_TEMPLATE_VALIDATION "template_ym0vpl8" production
vercel env add NEXT_PUBLIC_EMAILJS_TEMPLATE_REJECTION "template_5dboaan" production
vercel env add NEXT_PUBLIC_EMAILJS_PUBLIC_KEY "TNl3r0YjPN8-uGT_f" production

# Variables générales
vercel env add BASE_URL "https://bat-j5nbr28rc-antoines-projects-1b9977a0.vercel.app" production
vercel env add BAT_EXPIRATION_DAYS "7" production
vercel env add PHONE_NUMBER "+33123456789" production

# Variables SMTP (optionnelles - EmailJS prioritaire)
vercel env add EMAIL_HOST "smtp.ionos.fr" production
vercel env add EMAIL_PORT "465" production
vercel env add EMAIL_USER "contact@studiomae.fr" production
vercel env add EMAIL_FROM "contact@studiomae.fr" production

echo "✅ Configuration terminée !"
echo "🔄 Redéploiement automatique en cours..."
echo "⏱️ Attendez 30-60 secondes puis testez : https://bat-j5nbr28rc-antoines-projects-1b9977a0.vercel.app"
