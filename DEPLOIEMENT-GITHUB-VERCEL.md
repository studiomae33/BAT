# 🚀 Guide de Déploiement GitHub + Vercel

## 📋 **Étapes de publication**

### 1. **Préparation du repository Git**

```bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit: Système BAT complet"

# Ajouter le repository GitHub
git remote add origin https://github.com/VOTRE_USERNAME/systeme-bat.git

# Push vers GitHub
git push -u origin main
```

### 2. **Création du repository GitHub**

1. Allez sur [github.com](https://github.com)
2. Cliquez sur "New repository"
3. Nom : `systeme-bat` (ou le nom de votre choix)
4. **Important** : Cochez "Private" pour un domaine privé
5. Ne cochez pas "Add README" (on en a déjà un)
6. Cliquez "Create repository"

### 3. **Configuration Vercel**

#### A. Connexion Vercel
1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec GitHub
3. Cliquez "Import Project"
4. Sélectionnez votre repository `systeme-bat`

#### B. Configuration du projet
- **Framework Preset** : Next.js
- **Root Directory** : `./` (racine)
- **Build Command** : `npm run build`
- **Output Directory** : `.next`

#### C. Variables d'environnement (CRUCIAL)

Dans les settings Vercel, ajoutez ces variables :

```env
JWT_SECRET=GÉNÉREZ_UN_SECRET_SÉCURISÉ_64_CARACTÈRES
ADMIN_EMAIL=admin@votredomaine.com
ADMIN_PASSWORD=MOT_DE_PASSE_ADMIN_SÉCURISÉ
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app
EMAIL_FROM=noreply@votredomaine.com
BASE_URL=https://votre-app.vercel.app
BAT_EXPIRATION_DAYS=7
PHONE_NUMBER=+33123456789
```

#### D. Génération JWT_SECRET sécurisé
```bash
# Sur Mac/Linux
openssl rand -hex 64

# Ou utilisez un générateur en ligne
# https://generate-secret.vercel.app/64
```

### 4. **Domaine personnalisé (Optionnel)**

#### A. Dans Vercel
1. Settings → Domains
2. Ajoutez votre domaine : `bat.votredomaine.com`
3. Configurez les DNS selon les instructions

#### B. Mise à jour BASE_URL
```env
BASE_URL=https://bat.votredomaine.com
```

### 5. **Configuration Email pour la production**

#### Gmail (simple pour débuter)
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=mot_de_passe_application_gmail
```

#### SendGrid (recommandé pour la production)
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=votre_api_key_sendgrid
```

#### Mailgun
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=postmaster@votre-domaine.mailgun.org
EMAIL_PASS=votre_password_mailgun
```

## 🧪 **Test après déploiement**

### 1. **Vérification basique**
- Visitez votre URL Vercel
- Testez la connexion admin
- Uploadez un PDF de test

### 2. **Test email complet**
1. Envoyez un BAT à une vraie adresse email
2. Vérifiez la réception de l'email
3. Testez le lien de validation/refus
4. Vérifiez la notification de retour

### 3. **Test des erreurs**
- Testez avec un token expiré
- Testez avec un fichier non-PDF
- Testez avec des identifiants incorrects

## 🔒 **Sécurité en production**

### ✅ **Points vérifiés automatiquement**
- HTTPS activé par défaut sur Vercel
- Variables d'environnement sécurisées
- Tokens JWT avec expiration

### ⚠️ **Points à vérifier manuellement**
- [ ] JWT_SECRET unique et sécurisé (64 caractères)
- [ ] Mot de passe admin complexe
- [ ] Configuration SMTP correcte
- [ ] Test de tous les workflows
- [ ] Sauvegarde planifiée (si nécessaire)

## 📊 **Monitoring et maintenance**

### Logs Vercel
- Functions → View logs
- Surveillez les erreurs d'envoi email
- Vérifiez les tentatives de connexion

### Analytics (optionnel)
- Activez Vercel Analytics
- Monitorer les performances
- Suivre l'utilisation

## 🆘 **Dépannage courant**

### Erreur "Module not found"
```bash
# Vérifiez les dépendances
npm install
git add package-lock.json
git commit -m "Fix dependencies"
git push
```

### Emails non reçus
1. Vérifiez les variables EMAIL_* dans Vercel
2. Testez les credentials SMTP localement
3. Vérifiez les logs Vercel Functions

### Token invalide
1. Vérifiez que JWT_SECRET est identique partout
2. Vérifiez BASE_URL dans les variables Vercel

---

## 🎯 **Résultat final**

Après ces étapes, vous aurez :
- ✅ **Site en ligne** sur Vercel avec HTTPS
- ✅ **Domaine personnalisé** (optionnel)
- ✅ **Emails fonctionnels** en production
- ✅ **Sécurité robuste** avec variables d'environnement
- ✅ **Déploiement automatique** à chaque push GitHub

**🚀 Votre système BAT sera opérationnel en production !**
