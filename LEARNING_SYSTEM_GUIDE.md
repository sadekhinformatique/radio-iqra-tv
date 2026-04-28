# 🎓 Programme d'Apprentissage du Coran - Guide d'Intégration Complet

## 📋 Table des Matières
1. [Architecture du Système](#architecture-du-système)
2. [Installation et Configuration](#installation-et-configuration)
3. [Structure des Fichiers](#structure-des-fichiers)
4. [Guide de Déploiement](#guide-de-déploiement)
5. [Modes d'Apprentissage](#modes-dapprentissage)
6. [Système de Récompenses](#système-de-récompenses)
7. [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture du Système

### Stack Technologique
- **Frontend**: React 19 + TypeScript + Tailwind CSS + Motion
- **Backend**: Supabase (Auth + PostgreSQL + RLS)
- **Audio**: QuranCDN (word-by-word) + EveryAyah (full verses)
- **State Management**: React Hooks
- **Animations**: Framer Motion

### Composants Créés

```
src/
├── types/
│   └── learning.ts                 # Types TypeScript complets
├── hooks/
│   ├── useLearningEngine.ts        # Logic d'apprentissage
│   └── useQuranData.ts             # Récupération données
├── components/
│   ├── modern/
│   │   └── ModernLearningEngine.tsx # Component principal
│   └── learning/
│       ├── QuranDisplay.tsx         # Affichage texte Coran
│       ├── AudioController.tsx      # Gestion son
│       ├── LearningControls.tsx     # Navigation
│       ├── ModeSelector.tsx         # Choix modes
│       ├── QuizPanel.tsx            # Système quiz
│       └── ProgressDashboard.tsx    # Dashboard stats
└── pages/
    └── ModernCoranLearning.tsx      # Page principal
```

---

## 🚀 Installation et Configuration

### Étape 1: Mettre à jour les dépendances

```bash
npm install motion@latest framer-motion lucide-react
```

### Étape 2: Créer les Tables Supabase

1. Allez à la console Supabase: https://app.supabase.com
2. Ouvrez l'SQL Editor
3. Copiez-collez le contenu de `LEARNING_SYSTEM_SETUP.sql`
4. Cliquez "Run"

Les tables créées:
- `reciters` - Liste des récitateurs
- `learning_progress` - Progression d'apprentissage
- `learning_sessions` - Sessions d'étude
- `quizzes` - Questions de quiz
- `badges` - Définitions des badges
- `user_badges` - Badges débloqués
- `user_points` - Système de points
- `learning_stats` - Statistiques globales
- `leaderboard` - Classement des utilisateurs

### Étape 3: Mettre à jour les Routes

Ajoutez à votre `App.tsx` (ou votre router):

```tsx
import ModernCoranLearning from './pages/ModernCoranLearning';

// Dans vos routes:
<Route path="/coran-apprentissage" element={<ModernCoranLearning />} />

// Ou remplacer la page existante LearningProgram
<Route path="/learning" element={<ModernCoranLearning />} />
```

### Étape 4: Vérifier les Variables d'Environnement

Assurez-vous que `.env.local` contient:

```env
VITE_SUPABASE_URL=votre_url
VITE_SUPABASE_ANON_KEY=votre_clé
```

---

## 📁 Structure des Fichiers

### Types (`src/types/learning.ts`)
Définit toutes les interfaces TypeScript:
- `LearningMode` - Mode d'apprentissage
- `LearningSettings` - Configuration utilisateur
- `LearningProgress` - État de progression
- `Quiz` - Structure des questions
- `UserBadge` - Badges débloqués
- `LearningStats` - Statistiques

### Hooks (`src/hooks/useLearningEngine.ts`)
**`useLearningEngine(userId)`**
- Gère l'état d'apprentissage global
- Lecture/écriture audio
- Sauvegarde progression
- Gestion des sessions

**`useBadgeSystem(userId)`**
- Gère les badges et points
- Ajoute des récompenses
- Suivi des achievements

### Composants

#### `ModernLearningEngine.tsx` - Component Principal
- Orchestration complète du système
- Sélecteur de mode
- Interface d'apprentissage
- Dashboard et quiz

#### `QuranDisplay.tsx`
- Affichage du texte arabe
- Highlight du verset/mot actuel
- Interaction au clic
- Affichage Tajweed

#### `AudioController.tsx`
- Bouttons play/pause/stop
- Lecture mot-par-mot
- Lecture verset complet
- Indicateur de récitateur

#### `LearningControls.tsx`
- Navigation verset suivant/précédent
- Affichage progression
- Bouton terminer session
- Lancer quiz

#### `ModeSelector.tsx`
- Affichage 4 modes d'apprentissage
- Sélection récitateur
- Descriptions détaillées

#### `QuizPanel.tsx`
- Questions à choix multiples
- Vérification réponses
- Explication et score
- Système de points

#### `ProgressDashboard.tsx`
- Statistiques globales
- Affichage badges débloqués
- Calendrier d'étude
- Recommandations

---

## 🎓 Modes d'Apprentissage

### 1. 📖 Lecture Progressive
- Lisez verset par verset
- Audio complet du récitateur
- Rythme personnalisable
- Idéal pour débuter

**Diagramme**:
```
Sourate 1 → Verset 1 (Audio) → Verset 2 → Verset 3...
```

### 2. 🔤 Mot par Mot (Tajweed)
- Apprentissage granulaire
- Prononciation exacte
- Règles Tajweed intégrées
- Audio QuranCDN officiel

**Diagramme**:
```
Verset 1 → Mot 1 (Audio) → Mot 2 → Mot 3...
```

### 3. 🔄 Répétition Espacée (SRS)
- Algorithme SM-2
- Mémorisation durable
- Révision intelligente
- Basé sur l'oubli

**Diagramme**:
```
Jour 1 → Jour 3 → Jour 7 → Jour 15 → Jour 30...
```

### 4. 💪 Mémorisation Intensive
- Répétitions multiples
- Évaluation stricte
- Progression rapide
- Haute difficulté

**Diagramme**:
```
Verset 1 (×3) → Quiz → Validation → Suivant
```

---

## 🏆 Système de Récompenses

### Badges Disponibles
| Badge | Condition | Points |
|-------|-----------|--------|
| ✨ Débutant | 1 verset | 10 |
| 📖 Lecteur Assidu | 10 versets | 50 |
| 🎓 Érudit | 50 versets | 200 |
| 👑 Maître | 100 versets | 500 |
| 🔥 Streaker | 7 jours consécutifs | 100 |
| 🎯 Perfectionniste | 95% précision | 150 |
| ⏰ Chercheur | 10 heures d'étude | 300 |

### Système de Points
- Quiz réussi: +10 points
- Session complète: +50 points
- Badge débloqué: +100 points
- Jour streak: +5 points
- Classement sur Leaderboard

---

## 📊 Sauvegarde de Progression

### Données Sauvegardées Automatiquement
```
✓ Numéro du verset actuel
✓ Position du mot actuel
✓ Mode d'apprentissage
✓ Pourcentage de complétion
✓ Temps d'étude
✓ Réponses correctes
✓ Badge débloqués
```

### Reprise de Session
À chaque connexion:
1. Charger `learning_progress`
2. Récupérer le dernier verset/mot
3. Restaurer le mode/récitateur
4. Afficher le point d'arrêt

---

## 🔧 Guide de Déploiement

### 1. Vérifier les Dépendances
```bash
npm list react motion lucide-react
```

### 2. Build de Production
```bash
npm run build
```

### 3. Tester Localement
```bash
npm run dev
# Allez à http://localhost:3000/coran-apprentissage
```

### 4. Politiques RLS Supabase
Les politiques sont automatiquement créées par le SQL.
Vérifier:
1. Supabase Dashboard → Database → Policies
2. Vérifier "Users can view their own X"
3. Activer RLS sur chaque table

### 5. Déployer sur Production
```bash
git add .
git commit -m "Add modern Quran learning system"
git push
# Votre CI/CD déploira automatiquement
```

---

## 🎯 Cas d'Usage Exemple

### Utilisateur: Ahmed cherche à mémoriser Surah Al-Fatiha

1. **Connexion** → Supabase Auth
2. **Accès** → `/coran-apprentissage`
3. **Sélection Mode** → "Mémorisation Intensive"
4. **Choisir Récitateur** → "Alafasy"
5. **Lancer** → Surah 1
6. **Apprentissage** → 
   - Verset 1: Audio + Lecture (×3)
   - Quiz: Vérifier compréhension
   - Suivant...
7. **Terminer** → 
   - Progression sauvegardée
   - Points gagnés (+50)
   - Badge "Débutant" débloqué (+10)
8. **Dashboard** → Voir stats

---

## 🐛 Troubleshooting

### Problème: Les quiz ne se chargent pas
**Solution**:
```sql
-- Vérifier les données quiz
SELECT * FROM quizzes WHERE surah_number = 1;
-- Si vide, insérer les données
```

### Problème: Pas d'audio
**Solution**:
1. Vérifier la connexion internet
2. Tester les URLs:
   - Word: https://audio.qurancdn.com/wbw/001_001_001.mp3
   - Verse: https://everyayah.com/data/Alafasy/001001.mp3
3. Vérifier les logs du navigateur (F12)

### Problème: Progression non sauvegardée
**Solution**:
```sql
-- Vérifier RLS policies
SELECT * FROM learning_progress WHERE user_id = 'USER_ID';
-- Si vide, vérifier les policies

-- Redémarrer la session
-- Supabase → SQL Editor → Rerun policies
```

### Problème: Authentification échouée
**Solution**:
1. Vérifier .env.local
2. Régénérer la clé anon
3. Vérifier la configuration Supabase
4. Nettoyer les cookies

---

## 📚 Ressources Supplémentaires

### Documentation de Référence
- [Supabase Docs](https://supabase.com/docs)
- [React Hooks](https://react.dev/reference/react)
- [Motion Docs](https://motion.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)

### APIs Utilisées
- **QuranCDN**: https://audio.qurancdn.com/wbw/{s}_{v}_{m}.mp3
- **EveryAyah**: https://everyayah.com/data/{reciter}/{s}{v}.mp3
- **Al-Quran Cloud**: https://api.alquran.cloud/v1/surah/{n}

### Améliorations Futures
- [ ] Système de partage social
- [ ] Notifications push
- [ ] Modes hors-ligne
- [ ] Export PDF/CSV
- [ ] Analyse ML de progression
- [ ] Support multilingue complet
- [ ] Mode groupe/classe

---

## 💡 Conseils de Customisation

### Changer les Couleurs
Modifiez dans Tailwind config:
```js
// tailwind.config.js
colors: {
  'iqra-green': '#147065',  // Changez ici
  'iqra-gold': '#FFB400'    // Ou ici
}
```

### Ajouter des Récitateurs
```sql
INSERT INTO reciters (name, folder_name, recitation_type)
VALUES ('Nouveau Récitateur', 'folder_name', 'Murattal');
```

### Créer de Nouveaux Badges
```sql
INSERT INTO badges (name, description, icon, requirement, requirement_value)
VALUES ('Nouveau Badge', 'Description', '🎖️', 'verses', 200);
```

---

**Version**: 1.0.0  
**Dernier Update**: Avril 2026  
**Auteur**: GitHub Copilot  
**Licence**: MIT
