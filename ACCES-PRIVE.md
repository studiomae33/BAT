# 🔐 Système BAT - Accès Privé

## 🎯 Configuration d'Accès

Ce système BAT est conçu pour un **accès privé** avec une URL non publique.

### 📍 Points d'Accès

- **Page de connexion** : `https://votre-domaine.com/` (page d'accueil)
- **Interface d'administration** : `https://votre-domaine.com/admin` (après connexion)
- **Liens BAT clients** : Générés automatiquement avec tokens sécurisés

### 🔒 Sécurité

- **Domaine privé** : L'URL n'est pas communiquée publiquement
- **Authentification obligatoire** : Accès direct au login sur la page d'accueil
- **Tokens temporisés** : Les liens BAT expirent automatiquement
- **Accès protégé** : Middleware de protection sur toutes les routes admin

### 🚀 Workflow Complet

1. **Administrateur** :
   - Accède à `https://votre-domaine.com/`
   - Se connecte avec ses identifiants
   - Upload un PDF et saisit l'email client + message
   - Envoie le BAT

2. **Client** :
   - Reçoit un email avec un lien sécurisé unique
   - Clique sur le lien pour visualiser le BAT
   - Valide ou refuse avec options (message/appel)

3. **Notification** :
   - L'administrateur reçoit automatiquement la réponse du client
   - Le système traite la validation/refus

### ⚡ Installation Express

```bash
# 1. Configuration
cp .env.example .env.local
# Éditez .env.local avec vos paramètres

# 2. Installation et démarrage
npm install
npm run dev

# 3. Accès
# Ouvrez http://localhost:3000 (page de connexion directe)
```

### 🌐 Déploiement Production

Pour un déploiement en production :

1. **Domaine privé** : Configurez un nom de domaine non public
2. **HTTPS obligatoire** : Certificat SSL requis
3. **Variables d'environnement** : Configurez toutes les variables en production
4. **BASE_URL** : Mettez à jour avec votre domaine de production

### 📧 Configuration Email Recommandée

Pour un usage professionnel, configurez :
- Un serveur SMTP dédié (non Gmail)
- Une adresse email professionnelle
- Des templates d'email personnalisés avec votre charte graphique

---

*Ce système est prêt à l'emploi pour un environnement de production privé.*
