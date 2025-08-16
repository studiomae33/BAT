# 🧪 Guide de Test Complet - Système BAT

## 🎯 Instructions pour tester toutes les fonctionnalités

### ✅ **ÉTAPE 1 : Test de l'authentification admin**

1. **Ouvrir** : https://bat-orcin.vercel.app
2. **Se connecter avec** :
   - Email : `thomas@guy.fr`
   - Mot de passe : `antoinelebg`
3. **Vérifier** : Redirection vers l'interface admin

**✅ Résultat attendu** : Interface admin avec formulaire d'upload BAT

---

### ✅ **ÉTAPE 2 : Test d'upload et envoi BAT**

1. **Préparer un PDF de test** (ou utiliser celui fourni dans `uploads/test-bat.pdf`)
2. **Dans l'interface admin** :
   - Glisser-déposer ou sélectionner le PDF
   - Saisir un email de test : `votre-email@exemple.com`
   - Rédiger un message personnalisé
3. **Cliquer** : "Envoyer le BAT"

**✅ Résultat attendu** : 
- Message "BAT envoyé avec succès"
- Email reçu avec lien de validation

---

### ✅ **ÉTAPE 3 : Test de l'interface client**

1. **Ouvrir** le lien reçu par email (format : `https://bat-orcin.vercel.app/bat/[token]`)
2. **Vérifier** :
   - Affichage du PDF dans le navigateur
   - Boutons "Valider" et "Refuser" visibles
   - Fonction zoom opérationnelle

**✅ Résultat attendu** : Interface client fonctionnelle avec PDF affiché

---

### ✅ **ÉTAPE 4 : Test de validation BAT**

1. **Sur l'interface client**, cliquer "Valider"
2. **Vérifier** : Message de confirmation
3. **Contrôler** : Email de notification reçu par l'admin

**✅ Résultat attendu** : 
- Confirmation de validation
- Email admin "BAT Validé ✅"

---

### ✅ **ÉTAPE 5 : Test de rejet BAT**

1. **Créer un nouveau BAT** (répéter étape 2)
2. **Sur l'interface client**, cliquer "Refuser"
3. **Saisir** un message de rejet
4. **Vérifier** : Email de rejet reçu par l'admin

**✅ Résultat attendu** : 
- Confirmation de rejet
- Email admin "BAT Rejeté ❌" avec message

---

## 🔧 **Tests Techniques Avancés**

### API Endpoints
```bash
# Test authentification
curl -X POST https://bat-orcin.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"thomas@guy.fr","password":"antoinelebg"}'

# Test variables environnement
curl https://bat-orcin.vercel.app/api/debug
```

### EmailJS Configuration
- **Service ID** : `service_xb0o03d`
- **Templates** : 3 configurés (BAT, Validation, Rejet)
- **Compte** : Studio MAE (contact@studiomae.fr)

---

## 🐛 **Résolution de Problèmes**

### ❌ Erreur "Erreur serveur lors de l'upload"
- **Cause** : Configuration EmailJS manquante
- **Solution** : Vérifier les variables `NEXT_PUBLIC_EMAILJS_*`

### ❌ Email non reçu
- **Vérifier** : Dossier spam/indésirables
- **Tester** : Avec une autre adresse email
- **Debug** : Console navigateur pour erreurs EmailJS

### ❌ PDF non affiché
- **Vérifier** : Token BAT valide (non expiré)
- **Contrôler** : Fichier PDF uploadé correctement
- **Tester** : Avec un autre navigateur

---

## 📊 **Checklist de Validation Complète**

- [ ] ✅ Authentification admin fonctionnelle
- [ ] ✅ Upload PDF réussi (drag & drop)
- [ ] ✅ Email BAT envoyé et reçu
- [ ] ✅ Interface client accessible
- [ ] ✅ PDF affiché avec zoom
- [ ] ✅ Validation BAT opérationnelle
- [ ] ✅ Rejet BAT avec message
- [ ] ✅ Notifications email admin
- [ ] ✅ Sécurité (tokens, expiration)
- [ ] ✅ Interface responsive mobile

---

## 🎉 **Critères de Succès**

Le système est **prêt pour la production** si :
1. **Tous les tests manuels** passent sans erreur
2. **Les emails** sont reçus correctement
3. **L'interface** est responsive et intuitive
4. **La sécurité** est assurée (tokens, HTTPS)
5. **Les performances** sont acceptables

---

## 📞 **Support**

En cas de problème :
1. **Consulter** les logs dans la console navigateur
2. **Vérifier** les Function Logs sur Vercel
3. **Tester** en local avec `npm run dev`
4. **Contacter** le support technique

**🚀 Système BAT v1.0 - Prêt pour la production !**
