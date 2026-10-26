# ELITE WATCHE 🇲🇦
### Boutique E-Commerce Horlogère de Luxe pour le Marché Marocain

**ELITE WATCHE** est une plateforme e-commerce clé en main, conçue spécialement pour la vente de montres tendance et classiques au Maroc avec paiement à la livraison (**Cash on Delivery - COD**), confirmation directe par **WhatsApp**, et gestion financière administrative de haute précision.

---

## 🌟 Points Clés & Identité de Marque
- **Charte Visuelle « Luxury Black & Gold »** : Fond noir onyx et carbone (#0A0A0B, #121214), finitions dorées champagne restrained (#D4AF37, #C5A059), typographie d'art (Cinzel & Plus Jakarta Sans).
- **Marché Cible Exclusif** : Maroc (Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir, Oujda, etc.).
- **Devise Unique** : **MAD / DH** uniquement (aucune conversion superflue).
- **Mode de Règlement** : 100% Cash on Delivery (Paiement en espèces à la livraison avec possibilité d'inspection avant remise des fonds).
- **Confirmation Immédiate WhatsApp** : Génération d'un message pré-rempli officiel (Référence, Nom, Articles, Total DH, Ville).
- **Multilingue Intégral** :
  - **Français** (par défaut)
  - **العربية (Arabe)** avec prise en charge native du sens d'écriture **RTL** et typographie adaptée
  - **English** (Anglais)
- **Catalogue Réel Initial (5 modèles)** :
  1. *Royal Chrono* — Noir & Or Champagne (450 DH)
  2. *Heritage Classic* — Cuir Cognac & Or Rosé (380 DH)
  3. *Vanguard Nautical* — Bleu Océan & Or Brossé (490 DH)
  4. *Sovereign Minimalist* — Noir Absolu 7mm (350 DH)
  5. *Lunar Prestige* — Argent & Cadran Nuit Étoilée (470 DH)
- **Spécifications Réelles & Vérifiées** : Boîtiers acier inoxydable 316L, étanchéité du quotidien vérifiée 3 ATM, mouvements à quartz de précision, verres minéraux trempés.

---

## 🚀 Démarrage Rapide en Local

### 1. Prérequis
- Node.js 18+ ou 24+
- npm ou pnpm

### 2. Lancement du Serveur de Développement
```bash
# Se placer dans le dossier du projet
cd elite-watche

# Lancer le serveur Next.js
npm run dev
```
La boutique est accessible sur : `http://localhost:3000`

### 3. Compilation de Production
```bash
npm run build
npm run start
```

---

## 🔐 Espace d’Administration & Identifiants

L'espace d'administration sécurisé est accessible sur :
👉 `http://localhost:3000/admin`

- **Identifiant par défaut** : `admin`
- **Mot de passe par défaut** : `EliteWatche2026!`

*(Le mot de passe et le secret JWT peuvent être modifiés à tout moment dans le fichier `.env.local`).*

### Fonctionnalités du Dashboard Admin :
1. **Tableau de Bord Financier (P&L)** :
   - Chiffre d'affaires encaissé réel (uniquement sur les commandes livrées).
   - Coût d'achat total des montres livrées.
   - Frais de livraison réels et frais d'échec / retour transporteur.
   - Coût d'emballage (15 DH/colis configurable).
   - Dépenses publicitaires Meta Ads enregistrées.
   - **Bénéfice Net Réel Calculé**.
2. **Gestion des Commandes COD** :
   - Cycle complet : `En attente confirmation` ➔ `Confirmée` ➔ `En préparation` ➔ `Expédiée` ➔ `Livrée` / `Annulée` / `Échec`.
   - Bouton d'accès direct au chat WhatsApp du client.
   - Saisie du numéro de suivi coursier (Amana Express, etc.).
3. **Gestion des Stocks & Journal d'Audit** :
   - Réservation atomique du stock à chaque commande.
   - Libération automatique du stock réservé en cas d'annulation.
   - Ajustements manuels avec motifs obligatoires consignés dans un journal d'audit.
4. **Paramètres de la Boutique** :
   - Modification du numéro WhatsApp officiel de confirmation.
   - Grille tarifaire de livraison par ville marocaine.

---

## 📦 Intégration Supabase (PostgreSQL & RLS)

Le projet intègre un moteur dual-mode :
1. **Mode Local Autonome** (immédiatement fonctionnel sans aucune configuration externe).
2. **Mode Supabase PostgreSQL** :
   - Le script complet de migration SQL avec activation du **Row Level Security (RLS)** est disponible dans [`src/lib/db/supabase-schema.sql`](src/lib/db/supabase-schema.sql).
   - Pour l'activer, il suffit de renseigner vos clés Supabase dans `.env.local` :
     ```env
     NEXT_PUBLIC_SUPABASE_URL="https://votre-projet.supabase.co"
     NEXT_PUBLIC_SUPABASE_ANON_KEY="votre-anon-key"
     SUPABASE_SERVICE_ROLE_KEY="votre-service-role-key"
     ```

---

## 🇲🇦 Conformité Légale & Données Personnelles au Maroc (CNDP)

- Conforme aux exigences de la **Loi 09-08** relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel.
- Données strictement limitées à la livraison (Nom, Téléphone, Adresse, Ville).
- Aucune donnée bancaire collectée sur le site (paiement 100% en espèces à la livraison).
- Mentions légales et politique de confidentialité CNDP complètes sur [`/policies/privacy`](src/app/policies/privacy/page.tsx).

---

## 🎯 Plan de Lancement avec Budget Réduit (2 000 – 3 000 MAD)

1. **Achat du Nom de Domaine** : Enregistrer un nom de domaine `.ma` (environ 120 - 150 MAD/an chez Genious Host ou Cap Connect) ou `.com` (100 MAD/an).
2. **Hébergement Gratuit** : Déploiement sur le plan gratuit Vercel + base de données gratuite Supabase (coût serveur = 0 MAD).
3. **Stock Initial** : Commande de 5 à 10 pièces de modèles phares (budget stock : ~1 200 à 1 500 MAD).
4. **Packaging** : Boîtes rigides noires de qualité et cartes de remerciement (environ 150 - 200 MAD pour 20 boîtes).
5. **Budget Publicitaire Test** : Campagne Meta Ads ciblée sur Casablanca, Rabat et Marrakech (500 à 800 MAD sur 7 jours) pour valider le coût par commande (CPA).
6. **Partenaire Transporteur** : Ouverture d'un compte professionnel sans frais fixes chez Amana Express, CTM Messagerie ou un prestataire COD local.
