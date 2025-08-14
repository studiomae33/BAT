# 📧 Configuration EmailJS pour le système BAT

## 🚀 Avantages d'EmailJS

✅ **Configuration simple** (5 minutes vs 30 minutes SMTP)  
✅ **Gratuit** jusqu'à 200 emails/mois  
✅ **Pas de serveur SMTP** requis  
✅ **Interface visuelle** pour créer les templates  
✅ **Support multiple providers** (Gmail, Outlook, Yahoo, etc.)  

## 📋 Étapes de configuration

### 1. Créer un compte EmailJS

1. Allez sur [emailjs.com](https://www.emailjs.com/)
2. Cliquez sur "Sign Up" et créez votre compte
3. Vérifiez votre email

### 2. Configurer un service email

1. Dans le dashboard, cliquez sur "Email Services"
2. Cliquez "Add New Service"
3. Choisissez votre provider (Gmail recommandé)
4. Suivez les instructions de connexion
5. **Notez votre SERVICE_ID** (ex: `service_abc123`)

### 3. Créer les templates email

#### Template 1: BAT Client (`template_bat`)
```
Subject: BAT à valider - {{file_name}}

Bonjour,

Vous avez reçu un BAT (Bon À Tirer) à valider pour le fichier : {{file_name}}

Message personnel :
{{custom_message}}

🔗 Cliquez ici pour valider : {{bat_url}}

Ce lien expire le {{expiration_date}}.

Cordialement,
{{admin_email}}
```

**Variables à définir :**
- `to_email`
- `file_name` 
- `custom_message`
- `bat_url`
- `expiration_date`
- `admin_email`

#### Template 2: Notification Validation (`template_validation`)
```
Subject: ✅ BAT Validé - {{file_name}}

Le BAT a été validé !

📄 Fichier : {{file_name}}
👤 Client : {{client_email}}
📅 Date : {{validation_date}} à {{validation_time}}

Le client a validé le BAT.
```

**Variables à définir :**
- `to_email`
- `file_name`
- `client_email`
- `validation_date`
- `validation_time`

#### Template 3: Notification Rejet (`template_rejection`)
```
Subject: ❌ BAT Rejeté - {{file_name}}

Le BAT a été rejeté.

📄 Fichier : {{file_name}}
👤 Client : {{client_email}}
📅 Date : {{rejection_date}} à {{rejection_time}}

💬 Message du client :
{{rejection_message}}
```

**Variables à définir :**
- `to_email`
- `file_name`
- `client_email`
- `rejection_date`
- `rejection_time`
- `rejection_message`

### 4. Obtenir la clé publique

1. Allez dans "Account" → "General"
2. Copiez votre "Public Key"

### 5. Configuration des variables d'environnement

Mettez à jour votre `.env.local` :

```bash
# Configuration EmailJS
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_abc123
NEXT_PUBLIC_EMAILJS_TEMPLATE_BAT=template_bat
NEXT_PUBLIC_EMAILJS_TEMPLATE_VALIDATION=template_validation
NEXT_PUBLIC_EMAILJS_TEMPLATE_REJECTION=template_rejection
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=votre_public_key
```

## 🔧 Configuration Vercel Production

Dans votre dashboard Vercel, ajoutez ces variables d'environnement :

```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_abc123
NEXT_PUBLIC_EMAILJS_TEMPLATE_BAT=template_bat  
NEXT_PUBLIC_EMAILJS_TEMPLATE_VALIDATION=template_validation
NEXT_PUBLIC_EMAILJS_TEMPLATE_REJECTION=template_rejection
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=votre_public_key
```

## 📊 Limites EmailJS

- **Gratuit :** 200 emails/mois
- **Payant :** À partir de 15$/mois pour 30 000 emails
- **Templates :** Illimités sur tous les plans

## 🎯 Test de configuration

Utilisez le script de test inclus :

```bash
npm run test-emailjs
```

## 🔄 Migration depuis SMTP

Le système détecte automatiquement si EmailJS est configuré et l'utilise en priorité. Vous pouvez garder SMTP en fallback.

Ordre de priorité :
1. **EmailJS** (si configuré)
2. **SMTP** (si EmailJS non disponible)
3. **Erreur** (si aucun service configuré)

## ❓ Support

- Documentation : [docs.emailjs.com](https://www.emailjs.com/docs/)
- Templates : Utilisez l'éditeur visuel d'EmailJS
- Debug : Vérifiez la console navigateur pour les erreurs
