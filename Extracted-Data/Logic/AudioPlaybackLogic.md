# Logique de lecture audio - House of Quran

## Vue d'ensemble
L'application utilise deux modes de lecture audio :
1. **Word-by-Word (Mot par mot)** : Audio de chaque mot individuel
2. **Verse (Verset complet)** : Audio du verset entier par un récitateur

## 1. Structure des Tags audio

### Format du Tag pour les mots (Word-by-Word)
```
Format : {Sourate:3}{Verset:3}{Mot:3}
Exemple : 001001001 = Sourate 1, Verset 1, Mot 1
```

### Format du Tag pour les versets
```
Format : {Sourate:3}{Verset:3}
Exemple : 001001 = Sourate 1, Verset 1
```

## 2. Logique de lecture des mots (PlayWordAudio)

### Algorithme :
1. **Récupération du tag audio** depuis le `TextBlock.Tag`
2. **Construction du chemin local** :
   ```
   data/quran/{EnglishName}/wbw/{Sourate}{Verset}_{Mot}.mp3
   Exemple : data/quran/Al-Fatiha/wbw/001_001_001.mp3
   ```
3. **Vérification de disponibilité** :
   - Si fichier local existe → Lecture depuis le fichier local
   - Sinon si connexion internet → Lecture depuis l'URL
   - Sinon → Message d'erreur
4. **Gestion des couleurs** : Le mot en cours de lecture change de couleur (Foreground/Background)

### URLs de secours (en ligne) :
```
https://audio.qurancdn.com/wbw/{Sourate:3}_{Verset:3}_{Mot:3}.mp3
Exemple : https://audio.qurancdn.com/wbw/001_001_001.mp3
```

## 3. Logique de lecture des versets (PlayVerseAudio)

### Algorithme :
1. **Récupération du récitateur sélectionné** depuis `comboBox_Recitateur`
2. **Construction du chemin local** :
   ```
   data/quran/{EnglishName}/verse/{IndexRecitateur}-{Sourate}{Verset}{Extension}
   Exemple : data/quran/Al-Fatiha/verse/0-001001.mp3
   ```
3. **Vérification de disponibilité** (même logique que pour les mots)
4. **Lecture audio** avec mise en surbrillance du verset

### URLs de secours (en ligne) :
```
{Recitateur.Lien}{Sourate:3}{Verset:3}{Recitateur.Extension}
Exemple : https://everyayah.com/data/Alafasy/001001.mp3
```

## 4. Gestion des signes de prononciation

Certains mots contiennent des signes de prononciation (ۘ، ۖ، ۗ، ۙ، ۚ، ۛ، ۜ).
- Ces signes n'ont pas d'audio propre
- L'audio du mot suivant est décalé d'une unité
- Variable `addToAudio` gère ce décalage

## 5. Utilitaires audio (AudioUtilities)

### Fonctions principales :
- `PauseAllPlayingAudio()` : Met en pause tous les audios en cours
- `PlayMp3FromLocalFile(file, textBlocks)` : Joue un fichier MP3 local
- `PlayAudioFromUrl(url, textBlocks)` : Joue un audio depuis une URL
- `PlayMp3FromLocalFile(files, textBlocks)` : Joue une liste de fichiers MP3
- `PlayAudioFromUrl(urls, textBlocks)` : Joue une liste d'URLs

### Format des fichiers supportés :
- MP3 (.mp3) via `NAudio.Wave`
- OGG (.ogg) via `NAudio.Vorbis`

## 6. Logique de Tajweed (images colorées)

### Affichage des règles de Tajweed :
```
URL : https://static.qurancdn.com/images/w/rq-color/{Sourate}/{Verset}/{Mot}.png
```

### Condition d'affichage :
- Contrôlée par `Properties.Settings.Default.Tajweed`
- Si activé : Affiche l'image Tajweed derrière chaque mot
- Si désactivé : Affiche uniquement le texte arabe
