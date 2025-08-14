# 🎨 Système de Gestion des BAT (Bon À Tirer)

Un système complet et sécurisé pour l'envoi, la visualisation et la validation de BAT (Bons À Tirer) via email avec liens sécurisés temporisés.

![Next.js](https://img.shields.io/badge/Next.js-15.x-black)
![React](https://img.shields.io/badge/React-19.x-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4.x-38B2AC)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)

## 🚀 **Fonctionnalités**

### 👨‍💼 **Côté Administrateur**
- **Authentification sécurisée** avec JWT
- **Interface d'upload** intuitive (drag & drop PDF)
- **Envoi d'emails automatisé** avec liens sécurisés
- **Gestion des notifications** de validation/refus

### 👤 **Côté Client** 
- **Visualisation PDF** avec fonction zoom
- **Interface responsive** (mobile + desktop)
- **Actions simples** : Valider ✅ ou Refuser ❌
- **Options de refus** : Message écrit ou appel direct

### 🔒 **Sécurité**
- **Tokens JWT temporisés** (expiration configurable)
- **Liens uniques** liés à l'email destinataire
- **Protection des routes** avec middleware
- **Validation des fichiers** (PDF uniquement)

## 🛠️ **Installation**

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Serveur SMTP (Gmail, SendGrid, etc.)

### 1. **Installation des dépendances**
```bash
npm install
```

### 2. **Configuration**
```bash
# Copiez le fichier de configuration
cp .env.example .env.local

# Éditez .env.local avec vos paramètres
```

### 3. **Lancement**
```bash
# Développement
npm run dev

# Production
npm run build
npm start
```

## ⚙️ **Configuration**

### Variables d'environnement essentielles

```env
# Sécurité
JWT_SECRET=votre_jwt_secret_securise
ADMIN_EMAIL=admin@votredomaine.com
ADMIN_PASSWORD=mot_de_passe_securise

# Email SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=mot_de_passe_app

# Configuration
BASE_URL=https://votre-domaine.com
BAT_EXPIRATION_DAYS=7
PHONE_NUMBER=+33123456789
```

## 🚀 **Déploiement sur Vercel (Recommandé)**

1. **Push sur GitHub** (voir section suivante)
2. **Connectez votre repo à Vercel** sur [vercel.com](https://vercel.com)
3. **Configurez les variables d'environnement** dans les settings Vercel
4. **Déployez automatiquement** à chaque push

## 📁 **Structure du Projet**

```
src/
├── app/
│   ├── page.jsx              # Login admin (page d'accueil)
│   ├── admin/page.jsx        # Interface administration
│   ├── bat/[token]/page.jsx  # Visualisation client
│   └── api/                  # APIs REST
├── lib/
│   ├── auth.js              # Gestion JWT & authentification
│   ├── email.js             # Envoi d'emails SMTP
│   └── storage.js           # Stockage données (JSON)
└── components/              # Composants React
```

## 🔄 **Workflow**

1. **Admin** : Upload PDF + email client + message → Envoi
2. **Système** : Génération lien sécurisé → Email automatique
3. **Client** : Clic sur lien → Visualisation PDF → Validation/Refus
4. **Système** : Notification automatique à l'admin

## 📚 **Documentation**

- [📖 Documentation complète](./README-BAT.md)
- [🔐 Configuration accès privé](./ACCES-PRIVE.md)
- [🧪 Guide de test](./TEST-DEMO.md)
- [📦 Notes de livraison](./LIVRAISON-FINALE.md)

## 📄 **Licence**

Ce projet utilise le template [Salient](https://salient.tailwindui.com/) de Tailwind UI.

## Getting started

To get started with this template, first install the npm dependencies:

```bash
npm install
```

Next, run the development server:

```bash
npm run dev
```

Finally, open [http://localhost:3000](http://localhost:3000) in your browser to view the website.

## Customizing

You can start editing this template by modifying the files in the `/src` folder. The site will auto-update as you edit these files.

## License

This site template is a commercial product and is licensed under the [Tailwind Plus license](https://tailwindcss.com/plus/license).

## Learn more

To learn more about the technologies used in this site template, see the following resources:

- [Tailwind CSS](https://tailwindcss.com/docs) - the official Tailwind CSS documentation
- [Next.js](https://nextjs.org/docs) - the official Next.js documentation
- [Headless UI](https://headlessui.dev) - the official Headless UI documentation
