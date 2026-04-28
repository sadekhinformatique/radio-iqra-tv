# Modes d'apprentissage - House of Quran

## Vue d'ensemble
L'application propose deux modes d'apprentissage distincts :
1. **Mode Lecture** : Lecture continue avec suivi visuel
2. **Mode Mémorisation** : Répétition et apprentissage par cœur

---

## 1. Mode Lecture (Lecture Automatique)

### Description
Lit le Coran séquentiellement, mot par mot ou verset par verset, avec surbrillance visuelle.

### Logique de fonctionnement
1. **Choix du type de récitation** (radio buttons) :
   - `radioButton_recitation_wbwandverse` (Valeur 1) : Mot par mot PUIS verset complet
   - `radioButton_recitation_wbw` (Valeur 2) : Mot par mot uniquement
   - `radioButton_recitation_verse` (Valeur 3) : Verset complet uniquement

2. **Lecture séquentielle** :
   - Parcourt les `TextBlock` dans `WrapPanel_QuranText`
   - Joue l'audio correspondant à chaque élément
   - Passe automatiquement à l'élément suivant quand l'audio finit

3. **Gestion de la répétition** :
   - `checkbox_repeter_lecture` : Active la répétition
   - `integerUpDown_tempsRepeter` : Nombre de répétitions
   - `integerUpDown_tempsRepeterSeconde` : Temps d'attente entre les répétitions

### Étapes de lecture (Steps)
Créées par `CreateMemorisationStep()` (utilisée aussi pour la lecture) :

```csharp
internal enum StepType {
    LECTURE_MOT,      // Lire un mot
    LECTURE_VERSET,   // Lire un verset complet
    REPETITION,       // Répéter une section
    VOID              // Pause
}
```

### Exemple d'étape :
```csharp
new Step(
    StepType.LECTURE_MOT, 
    new int[] { position_du_mot_dans_wrappanel }
)
```

---

## 2. Mode Mémorisation

### Description
Aide l'utilisateur à mémoriser le Coran par répétition et test.

### Logique de fonctionnement
1. **Séquence de mémorisation** :
   - L'utilisateur écoute un mot/verset
   - L'audio se tait (VOID step)
   - L'utilisateur doit réciter de mémoire
   - L'audio revient pour vérification (REPETITION step)

2. **Paramètres** :
   - `integerUpDown_tempsMemoRepeter` : Nombre de répétitions pour mémoriser
   - `integerUpDown_tempsMemoRepeterSeconde` : Temps d'attente en seconde

3. **Navigation** :
   - `ActualMemorisationStep` : Index de l'étape actuelle
   - `MemorisationSteps` : Liste de toutes les étapes
   - `PlayNextMemorisationStep` : Passe à l'étape suivante

### Différence avec le mode lecture
- Le mode mémorisation insère des étapes `VOID` (silence) entre les lectures
- L'utilisateur doit cliquer pour passer à l'étape suivante (pas automatique)
- Les répétitions sont plus fréquentes

---

## 3. Gestion des événements clavier

### Touches supportées :
- **Flèche droite / Espace** : Étape suivante (`Button_Right_Click`)
- **Flèche gauche** : Étape précédente (`Button_Left_Click`)
- **P** : Play/Pause (`Button_PlayPause_Click`)

### Délégation d'actions :
```csharp
PlayNextLectureStep = Button_Right_Click;      // Mode lecture
PlayNextMemorisationStep = Button_Right_Click; // Mode mémorisation
PlayPause = Button_PlayPause_Click;           // Les deux modes
```

---

## 4. État de lecture (Variables globales)

### Variables importantes :
- `ActualPlayingTextBlockPos` : Position du TextBlock en cours de lecture
- `TogglePlayPauseAudio` : État play/pause
- `LastWasAudio` : Dernière action était un audio (utile pour les répétitions)
- `ActualMemorisationStep` : Index de l'étape de mémorisation actuelle
- `MemorisationSteps` : Liste des étapes générées

---

## 5. Affichage du Coran (AfficherSourate)

### Processus d'affichage :
1. **Nettoyage** : `WrapPanel_QuranText.Children.Clear()`
2. **En-tête** : Nom arabe, nombre de versets, type de sourate
3. **Boucle sur les versets** :
   - Pour chaque verset, découpage en mots
   - Création d'un `TextBlock` par mot
   - Attribution du tag audio (format : 001001001)
   - Ajout de l'image Tajweed si activé
   - Ajout du numéro de verset (format : ﴿1﴾)
4. **Gestion spéciale** :
   - `يَا أَيُّهَا` → fusionné en `يَٰٓأَيُّهَا`
   - Signes de prononciation → décalage audio (`addToAudio++`)

### Polices utilisées :
- Défaut : Police configurée dans `MainWindow.CurrentFont`
- Numéros de versets : Police `Me_Quran` (si police actuelle n'est pas Scheherazade ou Othmani)
