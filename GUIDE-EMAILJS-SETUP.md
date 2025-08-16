# 🎯 GUIDE CONFIGURATION EMAILJS - ÉTAPES DÉTAILLÉES

## 🚀 **1. CRÉER COMPTE EMAILJS**

1. **Aller sur** : https://www.emailjs.com/
2. **Sign Up** → Entrez votre email professionnel
3. **Vérifiez** l'email de confirmation reçu
4. **Connectez-vous** au dashboard

---

## 📧 **2. AJOUTER VOTRE SERVICE EMAIL**

### **Dashboard EmailJS → Email Services → Add New Service**

**🔹 Si vous utilisez Gmail :**
- Choisir "Gmail" 
- Cliquer "Connect Account"
- Se connecter avec votre Gmail
- Autoriser EmailJS
- **Noter le SERVICE_ID** (ex: `service_xyz123`)

**🔹 Si vous utilisez Outlook/Hotmail :**
- Choisir "Outlook"
- Se connecter avec Microsoft
- Autoriser l'accès
- **Noter le SERVICE_ID**

**🔹 Si vous utilisez un autre fournisseur (OVH, etc.) :**
- Choisir "Custom SMTP"
- **Serveur SMTP** : (demandez à votre hébergeur)
- **Port** : 587 (TLS) ou 465 (SSL)
- **Username** : votre.email@domaine.com
- **Password** : votre mot de passe email
- **Noter le SERVICE_ID**

---

## 📝 **3. CRÉER LES TEMPLATES EMAIL**

### **Dashboard EmailJS → Email Templates → Create New Template**

### **🔸 Template 1 : "BAT à valider" (pour les clients)**
```
Template Name: BAT Client
Template ID: (sera généré automatiquement - NOTEZ-LE)

Subject: BAT à valider - {{file_name}}

Content:
Bonjour,

Vous avez reçu un BAT (Bon À Tirer) à valider pour le fichier : {{file_name}}

Message personnel :
{{custom_message}}

🔗 Cliquez ici pour valider ou rejeter : {{bat_url}}

Ce lien expire le {{expiration_date}}.

Cordialement,
Thomas
thomas@guy.fr
```

**Variables à ajouter dans EmailJS :**
- `to_email` 
- `file_name`
- `custom_message` 
- `bat_url`
- `expiration_date`
- `admin_email`

### **🔸 Template 2 : "BAT validé" (notification admin)**
```
Template Name: BAT Validation
Template ID: (sera généré - NOTEZ-LE)

Subject: ✅ BAT Validé - {{file_name}}

Content:
Le BAT a été validé !

📄 Fichier : {{file_name}}
👤 Client : {{client_email}}  
📅 Date : {{validation_date}} à {{validation_time}}

Le client a approuvé le BAT.
```

### **🔸 Template 3 : "BAT rejeté" (notification admin)**
```
Template Name: BAT Rejet
Template ID: (sera généré - NOTEZ-LE)

Subject: ❌ BAT Rejeté - {{file_name}}

Content:
Le BAT a été rejeté.

📄 Fichier : {{file_name}}
👤 Client : {{client_email}}
📅 Date : {{rejection_date}} à {{rejection_time}}

💬 Message du client :
{{rejection_message}}

📞 Contactez le client : {{phone_number}}
```

---

## 🔑 **4. RÉCUPÉRER LA CLÉ PUBLIQUE**

**Dashboard EmailJS → Account → General → Public Key**
- **Copiez** la clé publique (commence par un code aléatoire)

---

## ⚙️ **5. CONFIGURER VOTRE PROJET**

**Dans votre fichier `.env.local`, remplacez :**

```bash
# Vos vraies valeurs EmailJS :
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_VOTRE_VRAI_ID_ICI
NEXT_PUBLIC_EMAILJS_TEMPLATE_BAT=template_VOTRE_TEMPLATE_BAT_ID
NEXT_PUBLIC_EMAILJS_TEMPLATE_VALIDATION=template_VOTRE_TEMPLATE_VALIDATION_ID
NEXT_PUBLIC_EMAILJS_TEMPLATE_REJECTION=template_VOTRE_TEMPLATE_REJECTION_ID
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=VOTRE_VRAIE_CLÉ_PUBLIQUE_ICI
```

---

## 🧪 **6. TESTER LA CONFIGURATION**

Une fois configuré, testez avec :

```bash
cd "/Users/antoineaugis/Desktop/Site BAT/salient-js"
npm run dev
```

Puis connectez-vous à l'admin et essayez d'envoyer un BAT.

---

## 📋 **RÉCAPITULATIF - CE DONT VOUS AVEZ BESOIN :**

Après configuration EmailJS, vous devrez noter :

✅ **SERVICE_ID** (ex: `service_abc123`)
✅ **TEMPLATE_ID BAT** (ex: `template_xyz789`)  
✅ **TEMPLATE_ID VALIDATION** (ex: `template_val456`)
✅ **TEMPLATE_ID REJECTION** (ex: `template_rej789`)
✅ **PUBLIC_KEY** (votre clé publique EmailJS)

---

## ❓ **BESOIN D'AIDE ?**

Si vous bloquez sur une étape :
1. **Service email** : Vérifiez que votre email est bien connecté
2. **Templates** : Utilisez l'éditeur visuel d'EmailJS
3. **Variables** : Respectez exactement les noms (`{{file_name}}`, etc.)
4. **Test** : Utilisez le bouton "Test" dans EmailJS avant de configurer

---

## 🎯 **AVANTAGES EMAILJS vs SMTP**

✅ **Plus simple** à configurer (5 min vs 30 min)
✅ **Interface graphique** pour créer les emails  
✅ **Pas de serveur** SMTP à gérer
✅ **Gratuit** jusqu'à 200 emails/mois
✅ **Templates visuels** avec éditeur drag & drop

Le système détectera automatiquement EmailJS et l'utilisera en priorité !
