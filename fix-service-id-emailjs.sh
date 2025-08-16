#!/bin/bash

echo "🔧 CORRECTION URGENTE - Service ID EmailJS invalide"
echo ""

echo "❌ Service ID actuel: service_xb0o03d (INVALIDE)"
echo ""
echo "🎯 ACTIONS REQUISES:"
echo ""
echo "1. Aller sur https://dashboard.emailjs.com/admin"
echo "2. Vérifier dans 'Email Services' le vrai Service ID"
echo "3. Le Service ID devrait ressembler à: service_xxxxxxx"
echo ""

echo "📋 Configuration EmailJS à vérifier:"
echo ""
echo "Dans le dashboard EmailJS, vous devez avoir:"
echo "- Un service email configuré (Gmail, Outlook, etc.)"
echo "- Templates créés avec les bons IDs"
echo "- Service actif et non suspendu"
echo ""

echo "🚨 Le Service ID 'service_xb0o03d' retourne 'not found'"
echo "   Cela signifie soit:"
echo "   - Le Service ID est incorrect"
echo "   - Le service a été supprimé/suspendu"
echo "   - Problème de compte EmailJS"
echo ""

echo "⏭️ Prochaines étapes:"
echo "1. Vérifiez votre dashboard EmailJS"
echo "2. Trouvez le vrai Service ID"
echo "3. Mettez à jour la variable NEXT_PUBLIC_EMAILJS_SERVICE_ID"
echo "4. Redéployez sur Vercel"

echo ""
echo "📞 Si le service n'existe plus, créez-en un nouveau:"
echo "   Dashboard → Email Services → Add New Service"
