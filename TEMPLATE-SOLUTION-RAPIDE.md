# 🚨 TEMPLATE EMAILJS MANQUANT - SOLUTION IMMÉDIATE

## ❌ **PROBLÈME ACTUEL**
- **Service ID** : `service_ptn7ru6` ✅ (fonctionne)
- **Template ID** : `template_wvesgq6` ❌ ("not found")

## 🎯 **SOLUTION RAPIDE - 2 minutes**

### **Créer UN template basique :**

1. **Dashboard EmailJS** : https://dashboard.emailjs.com/admin
2. **Email Templates** → **Create New Template**
3. **Configuration minimale :**

```
Template Name: BAT Simple
Subject: BAT à valider - {{file_name}}

Content:
Bonjour,

Vous avez reçu un BAT à valider.

Fichier : {{file_name}}
Message : {{custom_message}}

Lien de validation : {{bat_url}}

Cordialement,
{{admin_email}}
```

4. **Variables requises :**
   - `to_email`
   - `file_name` 
   - `custom_message`
   - `bat_url`
   - `admin_email`

5. **Sauvegarder** et **noter le Template ID** généré

## ⚡ **Test immédiat**

Une fois créé, testez sur :
https://bat-orcin.vercel.app/test-service-id

Avec :
- Service ID : `service_ptn7ru6`
- Template ID : `template_NOUVEAU_ID`

## 🔄 **Mise à jour config**

Si le test fonctionne :

```bash
# 1. Supprimer ancien template sur Vercel
npx vercel env rm NEXT_PUBLIC_EMAILJS_TEMPLATE_BAT production

# 2. Ajouter nouveau template
npx vercel env add NEXT_PUBLIC_EMAILJS_TEMPLATE_BAT production
# Entrer: template_NOUVEAU_ID

# 3. Redéployer
npx vercel --prod
```

## 💡 **Astuce**

**Pour l'instant, utilisez LE MÊME template ID** pour les 3 variables :
- `TEMPLATE_BAT` 
- `TEMPLATE_VALIDATION`
- `TEMPLATE_REJECTION`

Ça marchera et vous pourrez créer les autres templates plus tard !

---

**🎯 Objectif : Avoir le système fonctionnel en 5 minutes max !**
