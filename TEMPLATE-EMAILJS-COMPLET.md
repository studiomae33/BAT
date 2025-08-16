# 📝 TEMPLATE EMAILJS - CODE COMPLET À COPIER

## 🎯 **Template Principal - BAT Client**

**Copiez ce code dans votre dashboard EmailJS :**

### **Template Settings:**
- **Template Name:** `BAT à valider`
- **Subject:** `BAT à valider - {{file_name}}`

### **HTML Content (à copier-coller):**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BAT à valider</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #e9ecef;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
        }
        .title {
            color: #1e40af;
            font-size: 28px;
            margin: 0 0 10px 0;
        }
        .info-box {
            background: #f0f9ff;
            border-left: 4px solid #2563eb;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .message-box {
            background: #fefce8;
            border-left: 4px solid #eab308;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            margin: 20px 0;
            box-shadow: 0 4px 15px rgba(37,99,235,0.3);
            transition: all 0.3s ease;
        }
        .cta-container {
            text-align: center;
            margin: 30px 0;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6b7280;
            font-size: 14px;
        }
        .highlight {
            background: #fef3c7;
            padding: 2px 6px;
            border-radius: 3px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">📄 Studio MAE</div>
            <h1 class="title">BAT à valider</h1>
            <p>Bon À Tirer - Validation client</p>
        </div>

        <p>Bonjour,</p>

        <p>Vous avez reçu un <strong>BAT (Bon À Tirer)</strong> à valider pour votre projet.</p>

        <div class="info-box">
            <h3>📋 Détails du fichier :</h3>
            <p><strong>Nom du fichier :</strong> <span class="highlight">{{file_name}}</span></p>
            <p><strong>Date d'envoi :</strong> <span class="highlight">{{expiration_date}}</span></p>
        </div>

        <div class="message-box">
            <h3>💬 Message personnalisé :</h3>
            <p style="font-style: italic;">"{{custom_message}}"</p>
        </div>

        <div class="cta-container">
            <a href="{{bat_url}}" class="cta-button">
                🔗 Visualiser et Valider le BAT
            </a>
        </div>

        <div class="info-box">
            <h3>📍 Instructions :</h3>
            <ol>
                <li>Cliquez sur le bouton ci-dessus</li>
                <li>Consultez attentivement le document PDF</li>
                <li>Validez ✅ si tout est conforme</li>
                <li>Rejetez ❌ si des modifications sont nécessaires</li>
            </ol>
        </div>

        <p><strong>⚠️ Important :</strong> Ce lien expire dans 7 jours. Pensez à valider rapidement.</p>

        <div class="footer">
            <p><strong>Contact :</strong> {{admin_email}}</p>
            <p>Si vous ne pouvez pas cliquer sur le lien, copiez-collez cette URL dans votre navigateur :</p>
            <p style="word-break: break-all; background: #f1f5f9; padding: 10px; border-radius: 5px; font-family: monospace;">{{bat_url}}</p>
            <hr style="margin: 20px 0;">
            <p style="text-align: center; color: #9ca3af; font-size: 12px;">
                Email envoyé automatiquement par le système BAT de Studio MAE
            </p>
        </div>
    </div>
</body>
</html>
```

---

## 🔧 **Variables à configurer dans EmailJS :**

Dans votre template EmailJS, assurez-vous d'avoir ces variables :

- `{{to_email}}` - Email du destinataire
- `{{file_name}}` - Nom du fichier PDF
- `{{custom_message}}` - Message personnalisé
- `{{bat_url}}` - Lien de validation
- `{{expiration_date}}` - Date d'expiration
- `{{admin_email}}` - Email de contact (contact@studiomae.fr)

---

## 🚀 **Instructions de création :**

### **Dans votre dashboard EmailJS :**

1. **Email Templates** → **Create New Template**
2. **Template Name:** `BAT à valider`
3. **Subject:** `BAT à valider - {{file_name}}`
4. **Content:** Collez le code HTML ci-dessus
5. **Test:** Utilisez le bouton "Test" d'EmailJS
6. **Save** et notez le **Template ID** généré

### **Une fois créé :**

Le système générera un ID comme `template_abc123`. 

**Donnez-moi cet ID et je mettrai à jour la configuration !**

---

## 💡 **Template simple alternatif (si problème HTML):**

Si le HTML pose problème, voici une version texte simple :

```
Bonjour,

Vous avez reçu un BAT à valider.

Fichier : {{file_name}}
Message : {{custom_message}}

Lien de validation : {{bat_url}}

Ce lien expire le {{expiration_date}}.

Cordialement,
{{admin_email}}
```

**🎯 L'objectif : avoir UN template qui fonctionne pour débloquer le système !**
