# ✅ Checklist Final - Déploiement BAT

## 🏁 Étapes de Finalisation

### 1. Déploiement
- [ ] Installer Vercel CLI : `npm i -g vercel`
- [ ] Se connecter : `vercel login`  
- [ ] Déployer : `vercel --prod` (depuis le dossier du projet)
- [ ] Noter l'URL de production fournie

### 2. Configuration Vercel Dashboard
- [ ] Aller sur [vercel.com](https://vercel.com) → votre projet
- [ ] **Settings > Environment Variables** :
  - [ ] `JWT_SECRET` = secret-64-caractères
  - [ ] `ADMIN_EMAIL` = thomas@guy.fr
  - [ ] `ADMIN_PASSWORD` = antoinelebg
  - [ ] `BASE_URL` = https://votre-url.vercel.app
  - [ ] `BAT_EXPIRATION_DAYS` = 7
  - [ ] `PHONE_NUMBER` = +33123456789

### 3. Configuration Email (Choisir une option)

#### Option A - EmailJS (Recommandé pour début)
- [ ] Créer compte sur [emailjs.com](https://emailjs.com)
- [ ] Créer un service email
- [ ] Créer un template pour les BATs
- [ ] Ajouter variables Vercel :
  - [ ] `EMAILJS_SERVICE_ID`
  - [ ] `EMAILJS_TEMPLATE_ID` 
  - [ ] `EMAILJS_USER_ID`

#### Option B - SMTP (Plus professionnel)
- [ ] Configurer serveur SMTP (ex: services comme SendGrid, Mailgun)
- [ ] Ajouter variables Vercel :
  - [ ] `EMAIL_HOST`
  - [ ] `EMAIL_PORT`
  - [ ] `EMAIL_USER`
  - [ ] `EMAIL_PASS`
  - [ ] `EMAIL_FROM`

### 4. Base de Données (Vercel KV)
- [ ] Dans dashboard Vercel : **Storage** → **Create Database** → **KV**
- [ ] Nommer la base (ex: "bat-storage")
- [ ] Connecter au projet
- [ ] Variables KV ajoutées automatiquement ✅

### 5. Tests de Production
- [ ] Ouvrir l'URL de production
- [ ] Se connecter avec thomas@guy.fr / antoinelebg
- [ ] Tester upload PDF
- [ ] Tester envoi BAT à un email de test
- [ ] Ouvrir le lien BAT reçu par email
- [ ] Tester validation/rejet
- [ ] Vérifier réception notifications

### 6. Finalisation (Optionnel)
- [ ] Configurer domaine personnalisé dans Vercel
- [ ] Mettre à jour `BASE_URL` avec le nouveau domaine
- [ ] Tester avec le domaine personnalisé

---

## 🔗 Liens Utiles

- **GitHub :** https://github.com/studiomae33/BAT
- **Vercel Dashboard :** https://vercel.com/dashboard
- **EmailJS :** https://www.emailjs.com/
- **Documentation :** Voir `DEPLOYMENT-GUIDE.md`

---

## 🎯 Résultat Final

✅ **Système BAT fonctionnel en production**
- Homepage = login admin privé
- Interface admin sécurisée
- Upload et envoi BAT automatisé  
- Validation client simplifiée
- Notifications email automatiques
- Prêt pour utilisation client réel

**Temps total de déploiement : ~20 minutes**
