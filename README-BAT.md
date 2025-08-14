# Système de Gestion des BAT (Bon À Tirer)

## 📋 Description

Ce système permet de gérer l'envoi et la validation des BAT (Bons À Tirer) de manière sécurisée et efficace. Il est basé sur Next.js et utilise le template Salient comme base CSS/HTML.

## 🚀 Fonctionnalités

### Côté Administrateur
- **Authentification sécurisée** : Connexion par email/mot de passe
- **Upload de PDF** : Interface glisser-déposer pour les documents BAT
- **Envoi personnalisé** : Champs email destinataire et message personnalisé
- **Notifications automatiques** : Réception d'emails lors de la validation/refus

### Côté Client (Destinataire)
- **Lien sécurisé** : Accès via token unique et temporisé
- **Visualisation PDF** : Affichage en ligne avec fonction zoom
- **Actions simples** : Boutons "Valider" et "Refuser"
- **Options de refus** : Message écrit ou appel téléphonique direct

## 🛠️ Installation et Configuration

### 1. Installation des dépendances
```bash
npm install
```

### 2. Configuration des variables d'environnement

Créez un fichier `.env.local` avec les paramètres suivants :

```env
# Authentification
JWT_SECRET=votre_jwt_secret_tres_securise_ici
ADMIN_EMAIL=admin@votredomaine.com
ADMIN_PASSWORD=votre_mot_de_passe_securise

# Configuration Email SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_application
EMAIL_FROM=noreply@votredomaine.com

# Configuration générale
BASE_URL=http://localhost:3000
BAT_EXPIRATION_DAYS=7
PHONE_NUMBER=+33123456789
```

### 3. Configuration Email

#### Pour Gmail :
1. Activez l'authentification à 2 facteurs
2. Générez un "Mot de passe d'application" 
3. Utilisez ce mot de passe dans `EMAIL_PASS`

#### Pour autres fournisseurs :
Adaptez `EMAIL_HOST`, `EMAIL_PORT` selon votre fournisseur SMTP.

### 4. Lancement du serveur de développement
```bash
npm run dev
```

**Le site sera accessible sur http://localhost:3000 (page d'accueil = login admin)**

### 5. Accès au système
- **Connexion** : http://localhost:3000 (page d'accueil = login administrateur)
- **Interface admin** : http://localhost:3000/admin (après connexion)
- **Liens BAT** : Générés automatiquement et envoyés par email

## 📁 Structure du Projet

```
src/
├── app/
│   ├── admin/                 # Interface d'administration
│   ├── admin-login/          # Page de connexion admin
│   ├── bat/[token]/          # Pages de visualisation BAT
│   └── api/                  # Routes API
│       ├── auth/             # Authentification
│       └── bat/              # Gestion des BAT
├── lib/
│   ├── auth.js               # Fonctions d'authentification
│   ├── email.js              # Envoi d'emails
│   └── storage.js            # Stockage des données
└── components/               # Composants React réutilisables
```

## 🔧 Configuration Avancée

### Personnalisation des emails

Les templates d'email se trouvent dans `src/lib/email.js`. Vous pouvez modifier :
- Le style CSS inline
- Le contenu des messages
- Les informations de contact

### Modification de l'expiration des liens

Dans `.env.local`, changez `BAT_EXPIRATION_DAYS` (en jours).

### Stockage des fichiers

Par défaut, les PDFs sont stockés dans le dossier `uploads/`. Pour un déploiement en production, considérez l'utilisation d'un service cloud (AWS S3, Google Cloud Storage, etc.).

## 🚀 Déploiement en Production

### 1. Variables d'environnement production
- Générez un `JWT_SECRET` sécurisé
- Configurez un serveur SMTP professionnel
- Définissez la bonne `BASE_URL`

### 2. HTTPS obligatoire
En production, assurez-vous que le site utilise HTTPS pour la sécurité des tokens.

### 3. Stockage des fichiers
Pour la production, migrez vers un stockage cloud plutôt que le système de fichiers local.

## 📚 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion admin
- `POST /api/auth/logout` - Déconnexion

### Gestion des BAT
- `POST /api/bat/send` - Upload et envoi d'un BAT
- `GET /api/bat/[token]` - Récupération des infos BAT
- `GET /api/bat/[token]/pdf` - Téléchargement du PDF
- `POST /api/bat/[token]/validate` - Validation du BAT
- `POST /api/bat/[token]/reject` - Refus du BAT

## 🔒 Sécurité

### Tokens JWT
- Expiration automatique (24h pour admin, configurable pour BAT)
- Signature cryptographique
- Vérification de l'email destinataire

### Protection des routes
- Middleware de vérification d'authentification
- Cookies HTTP-only sécurisés
- Validation des types de fichiers

### Validation des données
- Vérification des emails
- Filtrage des types MIME
- Sanitisation des entrées utilisateur

## 🐛 Débogage

### Logs utiles
Les logs sont affichés dans la console pour :
- Envoi d'emails
- Erreurs d'authentification
- Upload de fichiers

### Problèmes courants

1. **Emails non reçus**
   - Vérifiez la configuration SMTP
   - Contrôlez les dossiers spam
   - Validez les credentials email

2. **Erreur d'upload**
   - Vérifiez les permissions du dossier `uploads/`
   - Contrôlez la taille maximale des fichiers

3. **Token expiré**
   - Vérifiez `BAT_EXPIRATION_DAYS`
   - Contrôlez l'horloge système

## 🔄 Maintenance

### Nettoyage automatique
Le système inclut une fonction de nettoyage des BAT expirés (`cleanupExpiredBATs`). Vous pouvez l'automatiser via un cron job.

### Sauvegarde
- Sauvegardez le fichier `data/bats.json`
- Sauvegardez le dossier `uploads/`

## 📞 Support

Pour toute question ou personnalisation, les points d'entrée principaux sont :
- Configuration : `.env.local`
- Emails : `src/lib/email.js`
- Interface admin : `src/app/admin/page.jsx`
- Interface client : `src/app/bat/[token]/page.jsx`

## 📝 Licence

Ce projet utilise le template Salient. Consultez le fichier LICENSE.md pour plus d'informations.
