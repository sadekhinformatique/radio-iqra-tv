# House of Quran - Données extraites

Ce dossier contient toutes les données, la logique et les exemples extraits de l'application **House of Quran** pour vous permettre de créer votre propre site d'apprentissage du Coran.

## Contenu

- **GUIDE-D-UTILISATION.md** - Guide complet avec exemples de code (COMMENCER ICI)
- **Models/** - Modèles de données en C# (Quran.cs, Recitateur.cs, Step.cs)
- **Logic/** - Documentation de la logique (audio, apprentissage, téléchargement)
- **API-Reference/** - Documentation des APIs et endpoints
- **Examples/** - Exemples de code prêts à l'emploi (JSON, JavaScript)

## Démarrage rapide

1. Lisez le **GUIDE-D-UTILISATION.md**
2. Copiez les exemples de `Examples/audio-helpers.js`
3. Configurez vos endpoints API (voir `API-Reference/api-endpoints.md`)
4. Implémentez les modes d'apprentissage (voir `Logic/LearningModes.md`)

## APIs utilisées

- Texte : `https://api.alquran.cloud/v1/quran/ar.asad`
- Audio mot par mot : `https://audio.qurancdn.com/wbw/`
- Audio récitateurs : `https://everyayah.com/data/`
- Images Tajweed : `https://static.qurancdn.com/images/w/rq-color/`

## Structure des tags audio

```
Mot : {Sourate:3}{Verset:3}{Mot:3}
Exemple : 001001001 = Sourate 1, Verset 1, Mot 1

Verset : {Sourate:3}{Verset:3}
Exemple : 001001 = Sourate 1, Verset 1
```

## Licence

Les données et la logique sont extraites de House of Quran pour usage éducatif. Respectez les conditions d'utilisation des APIs tierces.
