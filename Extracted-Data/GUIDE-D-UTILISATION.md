# GUIDE COMPLET - Utilisation des données House of Quran pour votre site d'apprentissage

## Introduction
Ce dossier contient toutes les données et la logique extraites de l'application **House of Quran** pour vous permettre de créer votre propre site d'apprentissage du Coran.

---

## Structure des fichiers extraits

```
Extracted-Data/
├── Guide-d-utilisation.md          # Ce fichier (point de départ)
├── Models/                         # Modèles de données (C#)
│   ├── Quran.cs                    # Structure des sourates et versets
│   ├── Recitateur.cs               # Structure des récitateurs
│   └── Step.cs                     # Étapes d'apprentissage
├── Logic/                          # Logique de l'application
│   ├── AudioPlaybackLogic.md       # Logique de lecture audio
│   ├── LearningModes.md            # Modes apprentissage (lecture/mémorisation)
│   └── DownloadLogic.md            # Logique de téléchargement hors-ligne
├── API-Reference/                  # Documentation des APIs
│   └── api-endpoints.md            # Endpoints pour texte, audio, images
└── Examples/                       # Exemples de code
    ├── quran-data-example.json     # Exemple de structure JSON
    ├── recitateurs-example.json    # Exemple de récitateurs
    └── audio-helpers.js            # Logique JavaScript prête à l'emploi
```

---

## 1. Récupération des données du Coran

### Option A : Via l'API alquran.cloud (Recommandé)
```javascript
// Récupère tout le Coran en arabe
fetch('https://api.alquran.cloud/v1/quran/ar.asad')
  .then(response => response.json())
  .then(data => {
    const quranData = data.data.surahs;
    console.log(`Coran chargé : ${quranData.length} sourates`);
    // Sauvegarde pour utilisation hors-ligne
    localStorage.setItem('quran', JSON.stringify(quranData));
  });
```

### Option B : Via le fichier texte brut (tanzil.net)
```javascript
// Télécharge le fichier texte
fetch('https://tanzil.net/code/plaintext/quran-uthmani.txt')
  .then(response => response.text())
  .then(text => {
    const lines = text.split('\n');
    const quran = [];
    let currentSurah = null;
    
    lines.forEach(line => {
      const parts = line.split('|');
      if (parts.length === 3) {
        const surahNum = parseInt(parts[0]);
        const verseNum = parseInt(parts[1]);
        const verseText = parts[2];
        
        if (!currentSurah || currentSurah.number !== surahNum) {
          currentSurah = { number: surahNum, ayahs: [] };
          quran.push(currentSurah);
        }
        
        currentSurah.ayahs.push({
          numberInSurah: verseNum,
          text: verseText
        });
      }
    });
  });
```

---

## 2. Intégration audio

### Audio Word-by-Word (mot par mot)
```javascript
// Fonction extraite de House of Quran
function playWordAudio(sourate, verset, mot) {
    const url = `https://audio.qurancdn.com/wbw/${
        String(sourate).padStart(3, '0')}_${
        String(verset).padStart(3, '0')}_${
        String(mot).padStart(3, '0')}.mp3`;
    
    const audio = new Audio(url);
    audio.play();
    
    return audio; // Pour pouvoir contrôler la lecture
}

// Exemple : Joue le premier mot de la première sourate
playWordAudio(1, 1, 1);
```

### Audio Verset complet (via récitateur)
```javascript
// Configuration des récitateurs
const recitateurs = [
  { nom: 'Alafasy', lien: 'https://everyayah.com/data/Alafasy/', ext: '.mp3' },
  { nom: 'AbdulBaset', lien: 'https://everyayah.com/data/AbdulBaset_Murattal/', ext: '.mp3' }
];

function playVerseAudio(recitateur, sourate, verset) {
    const url = `${recitateur.lien}${
        String(sourate).padStart(3, '0')}${
        String(verset).padStart(3, '0')}${recitateur.ext}`;
    
    const audio = new Audio(url);
    audio.play();
    
    return audio;
}

// Exemple
playVerseAudio(recitateurs[0], 1, 1);
```

---

## 3. Implémentation des modes d'apprentissage

### Mode Lecture (séquentiel)
```javascript
class LectureMode {
    constructor() {
        this.currentIndex = 0;
        this.wordElements = []; // Éléments DOM des mots
        this.isPlaying = false;
    }
    
    start(verseWords) {
        this.wordElements = verseWords;
        this.currentIndex = 0;
        this.isPlaying = true;
        this.playNextWord();
    }
    
    playNextWord() {
        if (!this.isPlaying || this.currentIndex >= this.wordElements.length) {
            this.isPlaying = false;
            return;
        }
        
        const wordEl = this.wordElements[this.currentIndex];
        const tag = wordEl.dataset.tag;
        
        // Highlight le mot
        wordEl.classList.add('active');
        
        // Joue l'audio
        const { sourate, verset, mot } = decodeTag(tag);
        const audio = playWordAudio(sourate, verset, mot);
        
        audio.onended = () => {
            wordEl.classList.remove('active');
            this.currentIndex++;
            this.playNextWord();
        };
    }
    
    stop() {
        this.isPlaying = false;
    }
}
```

### Mode Mémorisation (avec répétitions)
```javascript
class MemorizationMode {
    constructor() {
        this.steps = [];
        this.currentStep = 0;
        this.repetitionCount = 3;
        this.waitTime = 2000; // 2 secondes
    }
    
    createSteps(verseWords) {
        this.steps = [];
        
        for (let round = 0; round < this.repetitionCount; round++) {
            // Étape 1 : Écouter le verset
            this.steps.push({
                type: 'LISTEN',
                action: () => this.playFullVerse()
            });
            
            // Étape 2 : Pause (essayer de réciter)
            this.steps.push({
                type: 'RECITE',
                duration: this.waitTime,
                action: () => this.waitAndCheck()
            });
            
            // Étape 3 : Vérifier (réécouter)
            this.steps.push({
                type: 'CHECK',
                action: () => this.playFullVerse()
            });
        }
    }
    
    playNextStep() {
        if (this.currentStep >= this.steps.length) {
            console.log('Mémorisation terminée !');
            return;
        }
        
        const step = this.steps[this.currentStep];
        step.action();
        this.currentStep++;
    }
    
    playFullVerse() {
        // Logique pour jouer tout le verset
        console.log('Lecture du verset...');
        // ...
    }
    
    waitAndCheck() {
        console.log('À vous de réciter !');
        setTimeout(() => {
            this.playNextStep();
        }, this.waitTime);
    }
}
```

---

## 4. Affichage avec Tajweed

### HTML/CSS
```html
<style>
.verse-wrapper {
    font-size: 24px;
    line-height: 1.8;
    font-family: 'Scheherazade New', serif;
    direction: rtl;
}

.word {
    cursor: pointer;
    position: relative;
    display: inline-block;
    margin: 0 4px;
}

.word.active {
    background-color: #fff3cd;
    border-radius: 4px;
}

.tajweed-img {
    position: absolute;
    bottom: -30px;
    left: 0;
    width: 100%;
    height: auto;
    pointer-events: none;
}

.verse-number {
    color: #0a5;
    font-family: 'Me Quran', sans-serif;
    cursor: pointer;
}
</style>

<div id="quran-display"></div>

<script>
// Affiche une sourate
function displaySurah(surahData) {
    const container = document.getElementById('quran-display');
    container.innerHTML = '';
    
    surahData.ayahs.forEach(verse => {
        const verseEl = createVerseElement(verse, surahData.number);
        container.appendChild(verseEl);
    });
}
</script>
```

---

## 5. Utilisation hors-ligne (caching)

### Service Worker (pour PWA)
```javascript
// sw.js - Service Worker pour le cache
const CACHE_NAME = 'house-of-quran-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/audio-helpers.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
```

### Cache des audios téléchargés
```javascript
// Télécharge et cache un audio
async function cacheAudio(url, sourate, verset, mot) {
    const cache = await caches.open('quran-audio');
    const response = await fetch(url);
    await cache.put(url, response.clone());
    
    // Sauvegarde les métadonnées
    const audioIndex = JSON.parse(localStorage.getItem('audioIndex') || '{}');
    audioIndex[`${sourate}_${verset}_${mot}`] = url;
    localStorage.setItem('audioIndex', JSON.stringify(audioIndex));
}

// Vérifie si un audio est en cache
async function getCachedAudio(sourate, verset, mot) {
    const cache = await caches.open('quran-audio');
    const key = `${sourate}_${verset}_${mot}`;
    const audioIndex = JSON.parse(localStorage.getItem('audioIndex') || '{}');
    
    if (audioIndex[key]) {
        const response = await cache.match(audioIndex[key]);
        if (response) return response;
    }
    
    return null; // Pas en cache
}
```

---

## 6. Modèles de données (pour votre base de données)

### Collection Quran (MongoDB/MySQL)
```sql
-- Table Surahs
CREATE TABLE Surahs (
    id INT PRIMARY KEY,
    name_arabic VARCHAR(255),
    name_english VARCHAR(255),
    name_translation VARCHAR(255),
    revelation_type ENUM('Meccan', 'Medinan'),
    total_ayahs INT
);

-- Table Ayahs
CREATE TABLE Ayahs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    surah_id INT,
    number_in_surah INT,
    text_arabic TEXT,
    juz INT,
    page INT,
    FOREIGN KEY (surah_id) REFERENCES Surahs(id)
);

-- Table Recitateurs
CREATE TABLE Recitateurs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255),
    bytes VARCHAR(100),
    lien_base VARCHAR(500),
    extension VARCHAR(10)
);
```

### Format JSON pour NoSQL
```json
{
  "_id": "1_1",
  "surah": 1,
  "numberInSurah": 1,
  "text": "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
  "audio_wbw": "https://audio.qurancdn.com/wbw/001_001_001.mp3",
  "audio_verse": {
    "Alafasy": "https://everyayah.com/data/Alafasy/001001.mp3",
    "AbdulBaset": "https://everyayah.com/data/AbdulBaset_Murattal/001001.mp3"
  }
}
```

---

## 7. Points importants à retenir

### 🔹 Structure des Tags (crucial pour l'audio)
- **Mot** : `001001001` = Sourate 1, Verset 1, Mot 1
- **Verset** : `001001` = Sourate 1, Verset 1

### 🔹 URLs des ressources
| Ressource | Format d'URL |
|-----------|--------------|
| Audio mot | `https://audio.qurancdn.com/wbw/{s}_{v}_{m}.mp3` |
| Audio verset | `{recitateur.lien}{s}{v}.mp3` |
| Image Tajweed | `https://static.qurancdn.com/images/w/rq-color/{s}/{v}/{m}.png` |
| Texte | `https://api.alquran.cloud/v1/quran/ar.asad` |

### 🔹 Gestion des signes de prononciation
Certains mots contiennent des signes (ۘ ۖ ۗ ۙ ۚ ۛ ۜ) qui n'ont pas d'audio propre. Dans ce cas :
- L'audio du mot suivant est décalé d'une unité
- Variable `addToAudio` dans le code original gère cela

### 🔹 Modes de récitation
1. **wbw+verse** : Mot par mot PUIS verset complet
2. **wbw only** : Mot par mot uniquement
3. **verse only** : Verset complet uniquement

---

## 8. Conseils pour votre site

### Performance
- Utilisez le **lazy loading** pour les sourates longues (Al-Baqarah : 286 versets)
- Mettez en cache les audios fréquemment utilisés
- Comprimez les images Tajweed

### Accessibilité
- Ajoutez des `aria-label` sur les éléments audio
- Supportez la navigation au clavier (flèches, espace)
- Proposez des réglages de vitesse de lecture

### Pour l'apprentissage
- Implémentez des statistiques (mots mémorisés, temps passé)
- Ajoutez un système de répétition espacée (SRS)
- Permettez à l'utilisateur de marquer ses versets favoris

---

## 9. Exemple complet (HTML + JS minimal)

Voir le fichier `Examples/audio-helpers.js` pour une implémentation complète prête à l'emploi.

---

## Ressources complémentaires
- **Quran.com API** : https://quran.com/developers
- **Al-Quran Cloud API** : https://alquran.cloud/api
- **EveryAyah** : https://everyayah.com (liste des récitateurs)
- **Tanzil.net** : https://tanzil.net (textes authentiques)

---

**Note** : Les données extraites sont libres d'utilisation sous licence de l'application originale. Respectez les conditions d'utilisation des APIs tierces.
