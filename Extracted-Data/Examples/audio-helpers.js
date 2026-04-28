// Audio Helpers - Logique extraite de House of Quran pour votre site d'apprentissage
// Converti en JavaScript pour utilisation web

// ============================================
// 1. GÉNÉRATION DES LIENS AUDIO
// ============================================

/**
 * Génère l'URL audio d'un mot (word-by-word)
 * @param {number} sourate - Numéro de la sourate (1-114)
 * @param {number} verset - Numéro du verset dans la sourate
 * @param {number} mot - Position du mot dans le verset
 * @returns {string} URL de l'audio
 */
function getWbwAudioUrl(sourate, verset, mot) {
    const s = String(sourate).padStart(3, '0');
    const v = String(verset).padStart(3, '0');
    const m = String(mot).padStart(3, '0');
    return `https://audio.qurancdn.com/wbw/${s}_${v}_${m}.mp3`;
}

/**
 * Génère l'URL audio d'un verset complet
 * @param {object} recitateur - Objet récitateur avec propriétés 'lien' et 'extension'
 * @param {number} sourate - Numéro de la sourate (1-114)
 * @param {number} verset - Numéro du verset dans la sourate
 * @returns {string} URL de l'audio
 */
function getVerseAudioUrl(recitateur, sourate, verset) {
    const s = String(sourate).padStart(3, '0');
    const v = String(verset).padStart(3, '0');
    return `${recitateur.lien}${s}${v}${recitateur.extension}`;
}

/**
 * Génère l'URL d'une image Tajweed
 * @param {number} sourate - Numéro de la sourate (1-114)
 * @param {number} verset - Numéro du verset
 * @param {number} mot - Position du mot
 * @returns {string} URL de l'image
 */
function getTajweedImageUrl(sourate, verset, mot) {
    return `https://static.qurancdn.com/images/w/rq-color/${sourate}/${verset}/${mot}.png`;
}

// ============================================
// 2. GESTION DES TAGS AUDIO (Format House of Quran)
// ============================================

/**
 * Crée un tag audio pour un mot
 * Format: {Sourate:3}{Verset:3}{Mot:3}
 * Exemple: 001001001 = Sourate 1, Verset 1, Mot 1
 */
function createWordTag(sourate, verset, mot) {
    return String(sourate).padStart(3, '0') 
         + String(verset).padStart(3, '0') 
         + String(mot).padStart(3, '0');
}

/**
 * Crée un tag audio pour un verset
 * Format: {Sourate:3}{Verset:3}
 */
function createVerseTag(sourate, verset) {
    return String(sourate).padStart(3, '0') 
         + String(verset).padStart(3, '0');
}

/**
 * Décode un tag audio pour extraire les informations
 */
function decodeTag(tag) {
    if (tag.length === 9) { // Mot: 001001001
        return {
            type: 'word',
            sourate: parseInt(tag.substring(0, 3)),
            verset: parseInt(tag.substring(3, 6)),
            mot: parseInt(tag.substring(6, 9))
        };
    } else if (tag.length === 6) { // Verset: 001001
        return {
            type: 'verse',
            sourate: parseInt(tag.substring(0, 3)),
            verset: parseInt(tag.substring(3, 6))
        };
    }
    return null;
}

// ============================================
// 3. LECTURE AUDIO (Web Audio API)
// ============================================

class QuranAudioPlayer {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.currentSource = null;
        this.isPlaying = false;
        this.playQueue = []; // File d'attente pour lecture séquentielle
        this.onPlayStart = null; // Callback: début de lecture
        this.onPlayEnd = null; // Callback: fin de lecture
        this.onError = null; // Callback: erreur
    }

    /**
     * Joue un fichier audio depuis une URL
     */
    async playAudio(url, textBlocks = []) {
        try {
            // Annule la lecture en cours
            this.stopAudio();

            // Charge le fichier audio
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
            
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

            // Crée la source
            this.currentSource = this.audioContext.createBufferSource();
            this.currentSource.buffer = audioBuffer;
            this.currentSource.connect(this.audioContext.destination);

            // Événement de fin
            this.currentSource.onended = () => {
                this.isPlaying = false;
                if (this.onPlayEnd) this.onPlayEnd(textBlocks);
                
                // Joue l'élément suivant dans la file d'attente
                if (this.playQueue.length > 0) {
                    const next = this.playQueue.shift();
                    this.playAudio(next.url, next.textBlocks);
                }
            };

            // Démarre la lecture
            this.currentSource.start(0);
            this.isPlaying = true;
            
            if (this.onPlayStart) this.onPlayStart(textBlocks);

        } catch (error) {
            console.error('Erreur lecture audio:', error);
            if (this.onError) this.onError(error);
        }
    }

    /**
     * Joue une séquence d'audios (utile pour lecture mot par mot)
     */
    playSequence(audioList) {
        this.playQueue = audioList.slice(1); // Garde le premier pour lecture immédiate
        this.playAudio(audioList[0].url, audioList[0].textBlocks);
    }

    /**
     * Arrête la lecture en cours
     */
    stopAudio() {
        if (this.currentSource) {
            try {
                this.currentSource.stop();
            } catch (e) {
                // Ignore si déjà arrêté
            }
            this.currentSource = null;
        }
        this.isPlaying = false;
        this.playQueue = [];
    }

    /**
     * Met en pause/reprise
     */
    togglePause() {
        if (this.audioContext.state === 'running') {
            this.audioContext.suspend();
        } else if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
}

// ============================================
// 4. LOGIQUE D'AFFICHAGE (Word-by-Word)
// ============================================

/**
 * Crée les éléments HTML pour un verset avec audio word-by-word
 * @param {object} verset - Objet verset avec texte et numéro
 * @param {number} sourateNum - Numéro de la sourate
 * @param {object} player - Instance de QuranAudioPlayer
 * @returns {HTMLElement} Élément contenant le verset
 */
function createVerseElement(verset, sourateNum, player) {
    const wrapper = document.createElement('div');
    wrapper.className = 'verse-wrapper';
    
    // Découpage du texte en mots
    const mots = verset.text.split(' ');
    let motPosition = 1;
    let addToAudio = 0; // Gestion des signes de prononciation
    
    mots.forEach((mot, index) => {
        // Gestion spéciale pour "يا أيها" (fusion)
        if (mot === 'يَا' && mots[index + 1] === 'أَيُّهَا') {
            mot = 'يَٰٓأَيُّهَا';
            // Crée le TextBlock pour ce mot fusionné
            const wordElement = createWordElement(mot, sourateNum, verset.numberInSurah, motPosition, player);
            wrapper.appendChild(wordElement);
            motPosition++;
            index++; // Skip le mot suivant car déjà traité
            return;
        }
        
        // Vérifie si c'est un signe de prononciation
        const signesPrononciation = ['ۘ', 'ۖ', 'ۗ', 'ۙ', 'ۚ', 'ۛ', 'ۜ'];
        if (signesPrononciation.some(s => mot.includes(s))) {
            addToAudio++; // Décale l'audio du mot suivant
        }
        
        const wordElement = createWordElement(mot, sourateNum, verset.numberInSurah, motPosition + addToAudio, player);
        wrapper.appendChild(wordElement);
        
        motPosition++;
    });
    
    // Ajoute le numéro de verset
    const verseNumber = document.createElement('span');
    verseNumber.className = 'verse-number';
    verseNumber.textContent = `﴿${verset.numberInSurah}﴾`;
    verseNumber.onclick = () => {
        // Joue le verset complet
        const recitateur = getCurrentRecitateur(); // À définir selon votre logique
        const url = getVerseAudioUrl(recitateur, sourateNum, verset.numberInSurah);
        player.playAudio(url, [verseNumber]);
    };
    wrapper.appendChild(verseNumber);
    
    return wrapper;
}

/**
 * Crée un élément pour un mot avec audio
 */
function createWordElement(mot, sourate, verset, motPos, player) {
    const span = document.createElement('span');
    span.className = 'word';
    span.textContent = mot + ' ';
    span.dataset.tag = createWordTag(sourate, verset, motPos);
    
    // Ajoute l'image Tajweed si activé
    if (isTajweedEnabled()) { // À définir selon votre logique
        const img = document.createElement('img');
        img.src = getTajweedImageUrl(sourate, verset, motPos);
        img.className = 'tajweed-img';
        span.appendChild(img);
    }
    
    // Événement clic pour jouer l'audio
    span.onclick = () => {
        const tag = span.dataset.tag;
        const url = getWbwAudioUrl(sourate, verset, motPos);
        
        // Highlight le mot
        document.querySelectorAll('.word').forEach(el => el.classList.remove('active'));
        span.classList.add('active');
        
        player.playAudio(url, [span]);
    };
    
    return span;
}

// ============================================
// 5. MODES D'APPRENTISSAGE
// ============================================

class LearningMode {
    constructor(player) {
        this.player = player;
        this.currentStep = 0;
        this.steps = []; // Étapes d'apprentissage
        this.isMemorizationMode = false;
        this.repetitionCount = 3; // Nombre de répétitions
        this.waitTime = 2000; // Temps d'attente en ms
    }

    /**
     * Crée les étapes d'apprentissage pour un verset
     */
    createSteps(verseWords) {
        this.steps = [];
        
        if (!this.isMemorizationMode) {
            // Mode lecture: joue chaque mot séquentiellement
            verseWords.forEach((word, index) => {
                this.steps.push({
                    type: 'LECTURE_MOT',
                    elements: [word],
                    action: () => this.playWord(word)
                });
            });
        } else {
            // Mode mémorisation: répétition avec pauses
            for (let i = 0; i < this.repetitionCount; i++) {
                // Étape de lecture
                verseWords.forEach((word, index) => {
                    this.steps.push({
                        type: 'LECTURE_MOT',
                        elements: [word],
                        action: () => this.playWord(word)
                    });
                });
                
                // Pause (VOID step)
                this.steps.push({
                    type: 'VOID',
                    duration: this.waitTime,
                    action: () => this.waitAndContinue()
                });
            }
        }
    }

    /**
     * Joue l'étape suivante
     */
    playNextStep() {
        if (this.currentStep >= this.steps.length) {
            this.currentStep = 0; // Recommence
            return;
        }
        
        const step = this.steps[this.currentStep];
        step.action();
        this.currentStep++;
    }

    playWord(wordElement) {
        const tag = wordElement.dataset.tag;
        const decoded = decodeTag(tag);
        if (decoded && decoded.type === 'word') {
            const url = getWbwAudioUrl(decoded.sourate, decoded.verset, decoded.mot);
            this.player.playAudio(url, [wordElement]);
        }
    }

    waitAndContinue() {
        setTimeout(() => {
            this.playNextStep();
        }, this.waitTime);
    }
}

// ============================================
// 6. UTILITAIRES
// ============================================

/**
 * Convertit les chiffres en chiffres arabes
 */
function convertToArabicNumerals(number) {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(number).split('').map(digit => {
        return arabicDigits[parseInt(digit)] || digit;
    }).join('');
}

/**
 * Supprime les diacritiques (pour recherche)
 */
function removeDiacritics(text) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Export pour utilisation en module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getWbwAudioUrl,
        getVerseAudioUrl,
        getTajweedImageUrl,
        createWordTag,
        createVerseTag,
        decodeTag,
        QuranAudioPlayer,
        LearningMode,
        createVerseElement,
        convertToArabicNumerals,
        removeDiacritics
    };
}
