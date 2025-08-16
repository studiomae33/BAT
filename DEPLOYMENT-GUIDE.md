# 🚀 Guide de Déploiement - Système BAT

## 📋 État Actuel

✅ **Développement terminé** - L'application est prête pour le déploiement
✅ **Code publié sur GitHub** - [https://github.com/studiomae33/BAT](https://github.com/studiomae33/BAT)
✅ **Build de production testé** - Aucune erreur de compilation
✅ **Système d'authentification sécurisé** - JWT + middleware
✅ **Interface admin complète** - Upload PDF + envoi emails
✅ **Interface client BAT** - Visualisation PDF + validation
✅ **Configuration Vercel prête** - vercel.json configuré

---

## 🎯 Prochaines Étapes pour Mise en Production

### 1. **Déploiement sur Vercel** (Recommandé)

#### A. Connexion du projet
```bash
# Installer Vercel CLI (si pas déjà fait)
npm i -g vercel

# Se connecter à Vercel
vercel login

# Déployer depuis le dossier du projet
cd "/Users/antoineaugis/Desktop/Site BAT/salient-js"
vercel --prod
```

#### B. Configuration des variables d'environnement
Dans le dashboard Vercel (vercel.com), aller dans **Project Settings > Environment Variables** et ajouter :

**🔐 Sécurité (Obligatoire):**
- `JWT_SECRET` = `un-secret-très-long-et-sécurisé-64-caractères-minimum`
- `ADMIN_EMAIL` = `thomas@guy.fr`
- `ADMIN_PASSWORD` = `antoinelebg`

**📧 Configuration Email (SMTP ou EmailJS):**

*Option 1 - SMTP (Professionnel):*
- `EMAIL_HOST` = `smtp.votrefournisseur.com`
- `EMAIL_PORT` = `587`
- `EMAIL_USER` = `noreply@votredomaine.com`
- `EMAIL_PASS` = `mot-de-passe-smtp`
- `EMAIL_FROM` = `noreply@votredomaine.com`

*Option 2 - EmailJS (Plus simple):*
- `EMAILJS_SERVICE_ID` = `votre_service_id`
- `EMAILJS_TEMPLATE_ID` = `votre_template_id`
- `EMAILJS_USER_ID` = `votre_user_id`

**🌐 Configuration Domaine:**
- `BASE_URL` = `https://votre-domaine.vercel.app` (ou domaine personnalisé)
- `BAT_EXPIRATION_DAYS` = `7`
- `PHONE_NUMBER` = `+33123456789`

#### C. Configuration Vercel KV (Base de données)
1. Dans le dashboard Vercel, aller dans **Storage**
2. Créer une nouvelle **KV Database**
3. Connecter la database au projet
4. Les variables `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN` seront automatiquement ajoutées

### 2. **Configuration EmailJS** (Si choisi)

1. Aller sur [EmailJS.com](https://www.emailjs.com/)
2. Créer un compte et un service email
3. Créer un template d'email pour les BATs
4. Suivre le guide détaillé dans `CONFIGURATION-EMAILJS.md`

### 3. **Test de Production**

Une fois déployé :
1. ✅ Tester la connexion admin sur votre domaine
2. ✅ Tester l'upload et l'envoi d'un BAT
3. ✅ Vérifier la réception de l'email client
4. ✅ Tester la validation/rejet depuis le lien client
5. ✅ Vérifier les notifications de validation

---

## 🔧 Alternative : Déploiement Manuel

### Serveur VPS/Dédié avec Node.js

```bash
# Sur votre serveur
git clone https://github.com/studiomae33/BAT.git
cd BAT
npm install
npm run build

# Configurer les variables d'environnement
cp .env.production.example .env.production.local
# Éditer .env.production.local avec vos vraies valeurs

# Créer les dossiers nécessaires
mkdir -p uploads data
chmod 755 uploads data

# Démarrer en production
npm start
```

**Prérequis serveur :**
- Node.js 18+ installé
- HTTPS configuré (obligatoire pour la sécurité)
- Nginx/Apache comme reverse proxy
- Sauvegarde automatique des dossiers `data/` et `uploads/`

---

## 🎨 Domaine Personnalisé (Optionnel)

### Avec Vercel :
1. Aller dans **Project Settings > Domains**
2. Ajouter votre domaine personnalisé
3. Configurer les enregistrements DNS selon les instructions
4. Mettre à jour la variable `BASE_URL`

### Avantages domaine personnalisé :
- Image de marque professionnelle
- URLs plus courtes et mémorisables
- Certificat SSL automatique

---

## 📊 Fonctionnalités Prêtes

### ✅ Interface Admin
- **URL :** `https://votre-domaine.com/` (page d'accueil = login admin)
- **Connexion :** thomas@guy.fr / antoinelebg
- Upload PDF par glisser-déposer
- Formulaire email client avec message personnalisé
- Sélection automatique du service email (SMTP/EmailJS)
- Protection par authentification JWT

### ✅ Interface Client
- **URL :** `https://votre-domaine.com/bat/[token]` (lien unique par BAT)
- Visualisation PDF avec zoom
- Boutons Valider ✅ / Refuser ❌
- Redirection automatique après action
- Interface responsive mobile/desktop

### ✅ Sécurité
- Authentification JWT sécurisée
- Middleware de protection des routes admin
- Tokens BAT avec expiration configurable
- Validation des uploads (PDF uniquement)
- Protection CSRF et XSS

### ✅ Emails
- Service hybride SMTP/EmailJS
- Templates HTML responsive
- Notifications de validation/rejet
- Liens de validation sécurisés
- Gestion des erreurs d'envoi

---

## 🆘 Support et Maintenance

### Logs et Débogage
- Les logs sont affichés dans la console Vercel/serveur
- Chaque action est tracée pour faciliter le débogage
- Les erreurs d'email sont capturées et affichées

### Sauvegarde (Important)
- **Vercel KV :** Sauvegardé automatiquement
- **Serveur manuel :** Sauvegarder `data/bats.json` et `uploads/` régulièrement

### Mise à jour
```bash
# Récupérer les dernières modifications
git pull origin main
npm install
npm run build

# Vercel : redéploiement automatique
# Serveur : redémarrer le service
```

---

## 🎉 Le système BAT est prêt !

**Prochaine action :** Choisir votre méthode de déploiement et configurer les variables d'environnement.

**Temps de déploiement estimé :** 15-30 minutes avec Vercel

---

*Pour toute question technique, référez-vous aux fichiers de documentation ou aux commentaires dans le code.*
