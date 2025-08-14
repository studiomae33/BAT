# 🎯 Test du Système BAT - Identifiants de Démonstration

## 📋 Configuration de Test

Pour tester rapidement le système, voici une configuration `.env.local` de démonstration :

```env
# =================================================================
# CONFIGURATION DE TEST - NE PAS UTILISER EN PRODUCTION
# =================================================================

# Authentification Admin (Test)
JWT_SECRET=demo_jwt_secret_pour_test_seulement_changez_en_production
ADMIN_EMAIL=admin@demo.com
ADMIN_PASSWORD=demo123

# Configuration Email (Test avec Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_application
EMAIL_FROM=noreply@demo.com

# Configuration générale
BASE_URL=http://localhost:3000
BAT_EXPIRATION_DAYS=7
PHONE_NUMBER=+33123456789
```

## 🚀 Test Rapide

1. **Copiez la configuration ci-dessus** dans votre fichier `.env.local`
2. **Modifiez les paramètres email** avec vos vraies informations SMTP
3. **Démarrez le serveur** : `npm run dev`
4. **Connectez-vous** sur http://localhost:3000 avec :
   - Email : `admin@demo.com`
   - Mot de passe : `demo123`

## ⚠️ Important

- **Ne jamais utiliser ces identifiants en production**
- **Changez immédiatement le JWT_SECRET en production**
- **Configurez un serveur SMTP professionnel pour la production**
- **Utilisez des mots de passe forts et sécurisés**

## 🔒 Sécurité en Production

Avant de déployer en production :

1. **Générez un JWT_SECRET sécurisé** :
   ```bash
   openssl rand -hex 64
   ```

2. **Utilisez des identifiants admin forts**
3. **Configurez HTTPS obligatoirement**
4. **Utilisez un serveur SMTP professionnel**
5. **Sauvegardez régulièrement les dossiers `data/` et `uploads/`**

---

*Configuration de test uniquement - À adapter pour votre environnement*
