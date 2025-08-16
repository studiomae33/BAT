# 🚀 Configuration Variables Vercel - Guide Rapide

## ❌ **Problème Identifié et Résolu**

✅ **vercel.json corrigé** - Suppression des propriétés dépréciées
✅ **Push GitHub réussi** - Code à jour sur le repository  
⏳ **Variables d'environnement à configurer** - Il manque les secrets Vercel

---

## 🔧 **Variables à Configurer dans Vercel Dashboard**

### **1. Aller sur le Dashboard Vercel**
- 🔗 **URL** : https://vercel.com/dashboard
- 📂 **Projet** : "bat" (antoines-projects)
- ⚙️ **Aller dans** : Settings → Environment Variables

### **2. Ajouter ces Variables (Production + Preview)**

#### **🔐 Sécurité & Auth**
```bash
JWT_SECRET = votre_jwt_secret_ici_changez_moi_pour_production_64_caracteres
ADMIN_EMAIL = thomas@guy.fr
ADMIN_PASSWORD = antoinelebg
```

#### **📧 Configuration EmailJS (Studio MAE)**
```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID = service_xb0o03d
NEXT_PUBLIC_EMAILJS_TEMPLATE_BAT = template_wvesgq6
NEXT_PUBLIC_EMAILJS_TEMPLATE_VALIDATION = template_ym0vpl8
NEXT_PUBLIC_EMAILJS_TEMPLATE_REJECTION = template_5dboaan
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY = TNl3r0YjPN8-uGT_f
```

#### **🌐 Configuration Générale**
```bash
BASE_URL = https://bat-orcin.vercel.app
BAT_EXPIRATION_DAYS = 7
PHONE_NUMBER = +33123456789
```

#### **📧 SMTP (Optionnel - EmailJS prioritaire)**
```bash
EMAIL_HOST = smtp.ionos.fr
EMAIL_PORT = 465
EMAIL_USER = contact@studiomae.fr
EMAIL_PASS = [votre_mot_de_passe_ionos]
EMAIL_FROM = contact@studiomae.fr
```

---

## 🎯 **Instructions Détaillées**

### **Étape 1 - Dashboard Vercel**
1. Connectez-vous sur https://vercel.com
2. Cliquez sur votre projet "bat"  
3. Allez dans l'onglet "Settings"
4. Cliquez sur "Environment Variables" dans le menu de gauche

### **Étape 2 - Ajouter Variables**
Pour chaque variable :
1. **Name** : Le nom de la variable (ex: `JWT_SECRET`)
2. **Value** : La valeur (ex: `un-secret-très-long`)
3. **Environments** : Cochez "Production" ET "Preview" 
4. Cliquez "Save"

### **Étape 3 - Redéploiement**
Une fois toutes les variables ajoutées :
1. **Redéploiement automatique** via GitHub push
2. **OU force manual** : `vercel --prod` en local

---

## 🚨 **Variables Critiques à Changer**

### **JWT_SECRET**
⚠️ **Important** : Changez `votre_jwt_secret_ici_changez_moi` par un secret sécurisé :

```bash
# Générer un secret sécurisé (64 caractères)
openssl rand -hex 64
```

### **BASE_URL**
🌐 Utilisez votre vraie URL Vercel :
- **Production** : `https://bat-orcin.vercel.app`
- **OU domaine personnalisé** si configuré

---

## ✅ **Vérification**

Une fois les variables configurées :

1. **GitHub Push** déclenchera un redéploiement automatique
2. **Vérifiez** que le statut passe à "✅ Ready" 
3. **Testez** l'application sur votre URL Vercel
4. **Connectez-vous** avec thomas@guy.fr / antoinelebg
5. **Testez** l'envoi d'un BAT EmailJS

---

## 🎉 **Résultat Attendu**

✅ Déploiement Vercel réussi  
✅ Application accessible sur https://bat-orcin.vercel.app
✅ Login admin fonctionnel
✅ EmailJS configuré avec Studio MAE
✅ Workflow BAT complet opérationnel

---

## 📞 **Support**

Si problème persiste :
1. Vérifiez les **Build Logs** dans Vercel
2. Consultez les **Function Logs** pour erreurs runtime  
3. Testez en local : `npm run build` puis `npm start`

Le système est maintenant prêt pour la production ! 🚀
