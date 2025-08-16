#!/bin/bash

# Script pour générer un PDF de test
echo "📄 Génération d'un PDF de test..."

# Créer un fichier HTML temporaire
cat > /tmp/test-bat.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>BAT de Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { color: #2563eb; text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; }
        .content { margin: 30px 0; line-height: 1.6; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 50px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📋 BAT DE TEST</h1>
        <p>Bon À Tirer - Document de Validation</p>
    </div>
    
    <div class="content">
        <h2>🎯 Objectif</h2>
        <p>Ce document est un BAT de test pour valider le système de gestion des BAT.</p>
        
        <h2>✅ Éléments à valider</h2>
        <ul>
            <li>Mise en page générale</li>
            <li>Typographie et couleurs</li>
            <li>Alignements et espacements</li>
            <li>Qualité d'impression</li>
        </ul>
        
        <h2>📝 Instructions</h2>
        <p>Après avoir examiné ce document, veuillez :</p>
        <ol>
            <li><strong>Valider</strong> si tout est conforme</li>
            <li><strong>Refuser</strong> avec commentaires si des modifications sont nécessaires</li>
        </ol>
        
        <div style="background: #f0f9ff; padding: 20px; border-left: 4px solid #2563eb; margin: 30px 0;">
            <h3>🔗 Système BAT</h3>
            <p>Ce système permet une validation rapide et sécurisée de vos documents.</p>
        </div>
    </div>
    
    <div class="footer">
        <p>Document généré automatiquement - Système BAT v1.0</p>
        <p>© 2025 - Outil de gestion des Bons À Tirer</p>
    </div>
</body>
</html>
EOF

# Vérifier si wkhtmltopdf est disponible
if command -v wkhtmltopdf >/dev/null 2>&1; then
    echo "✅ wkhtmltopdf trouvé, génération du PDF..."
    wkhtmltopdf /tmp/test-bat.html uploads/BAT-TEST.pdf
    echo "📄 PDF de test créé : uploads/BAT-TEST.pdf"
else
    echo "⚠️ wkhtmltopdf non trouvé. Utilisez un PDF existant ou installez wkhtmltopdf."
    echo "💡 Sur macOS : brew install wkhtmltopdf"
    echo "💡 Ou téléchargez un PDF depuis : https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
fi

# Nettoyer
rm -f /tmp/test-bat.html

echo "✅ Script terminé"
