#!/bin/bash

# Script de test automatisé pour l'upload BAT
echo "🔍 Test automatisé de l'upload BAT"
echo "================================="

BASE_URL="https://bat-orcin.vercel.app"

# 1. Test de connexion admin
echo "📝 1. Test de connexion admin..."
LOGIN_RESPONSE=$(curl -s -c cookies.txt -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"thomas@guy.fr","password":"antoinelebg"}')

echo "Réponse login: $LOGIN_RESPONSE"

if echo "$LOGIN_RESPONSE" | grep -q "success.*true"; then
    echo "✅ Connexion admin réussie"
else
    echo "❌ Échec de la connexion admin"
    exit 1
fi

# 2. Créer un fichier PDF de test
echo "📄 2. Création d'un PDF de test..."
echo "%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(BAT de test) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000204 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
297
%%EOF" > test-upload.pdf

# 3. Test d'upload avec curl
echo "📤 3. Test d'upload du fichier..."
UPLOAD_RESPONSE=$(curl -s -b cookies.txt -X POST "$BASE_URL/api/bat/send" \
  -F "pdfFile=@test-upload.pdf" \
  -F "recipientEmail=client@test.com" \
  -F "customMessage=Test automatique du système BAT")

echo "Réponse upload: $UPLOAD_RESPONSE"

if echo "$UPLOAD_RESPONSE" | grep -q "success.*true"; then
    echo "✅ Upload réussi !"
    
    # Extraire le token pour tester l'accès client
    TOKEN=$(echo "$UPLOAD_RESPONSE" | grep -o '"batToken":"[^"]*"' | cut -d'"' -f4)
    if [ ! -z "$TOKEN" ]; then
        echo "🔑 Token extrait: ${TOKEN:0:20}..."
        
        # 4. Test d'accès client
        echo "👤 4. Test d'accès client..."
        CLIENT_RESPONSE=$(curl -s "$BASE_URL/api/bat/$TOKEN")
        
        if echo "$CLIENT_RESPONSE" | grep -q "success.*true"; then
            echo "✅ Accès client fonctionnel"
            
            # 5. Test de récupération PDF
            echo "📄 5. Test de récupération PDF..."
            PDF_RESPONSE=$(curl -s -I "$BASE_URL/api/bat/$TOKEN/pdf")
            
            if echo "$PDF_RESPONSE" | grep -q "Content-Type: application/pdf"; then
                echo "✅ Service PDF fonctionnel"
                echo ""
                echo "🎉 TOUS LES TESTS RÉUSSIS !"
                echo "Le système BAT fonctionne parfaitement."
            else
                echo "❌ Échec du service PDF"
            fi
        else
            echo "❌ Échec de l'accès client"
        fi
    else
        echo "⚠️ Token non trouvé dans la réponse"
    fi
else
    echo "❌ Échec de l'upload"
    echo "Détails de l'erreur: $UPLOAD_RESPONSE"
fi

# Nettoyage
rm -f test-upload.pdf cookies.txt

echo ""
echo "🏁 Test terminé"
