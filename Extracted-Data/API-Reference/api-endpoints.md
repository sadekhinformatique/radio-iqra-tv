# API Reference - House of Quran

## 1. Texte du Coran (alquran.cloud)

### Endpoint principal
```
GET https://api.alquran.cloud/v1/quran/{edition}
```

### Éditions disponibles (exemples)
- `ar.asad` - Arabe (texte standard)
- `ar.uthmani` - Arabe (écriture Othmani)
- `en.sahih` - Anglais (traduction Sahih International)
- `fr.hamidullah` - Français (traduction Hamidullah)

### Exemple de réponse
```json
{
  "code": 200,
  "status": "OK",
  "data": {
    "surahs": [
      {
        "number": 1,
        "name": "الفاتحة",
        "englishName": "Al-Fatiha",
        "englishNameTranslation": "The Opening",
        "revelationType": "Meccan",
        "ayahs": [
          {
            "number": 1,
            "text": "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
            "numberInSurah": 1
          }
        ]
      }
    ],
    "edition": {
      "identifier": "ar.asad",
      "language": "ar",
      "name": "القرآن - صحيح",
      "englishName": "Hafs - Al-Quran Al-Karim",
      "format": "text",
      "type": "quran"
    }
  }
}
```

### Autres endpoints utiles
```
GET https://api.alquran.cloud/v1/surah/{number}/edition/{edition}
- Récupère une sourate spécifique

GET https://api.alquran.cloud/v1/ayah/{reference}/edition/{edition}
- Récupère un verset spécifique (ex: 1:1 pour sourate 1, verset 1)
```

---

## 2. Audio Word-by-Word (qurancdn.com)

### Format de l'URL
```
https://audio.qurancdn.com/wbw/{sourate:3}_{verset:3}_{mot:3}.mp3
```

### Exemples
- Sourate 1, Verset 1, Mot 1: `https://audio.qurancdn.com/wbw/001_001_001.mp3`
- Sourate 2, Verset 255, Mot 10: `https://audio.qurancdn.com/wbw/002_255_010.mp3`

### Note importante
Ce service est fourni par **Quran.com** (ex-Al Quran CDN). Les audios sont de haute qualité et synchronisés avec l'affichage.

---

## 3. Audio des récitateurs (everyayah.com)

### Format de l'URL
```
https://everyayah.com/data/{dossier_recitateur}/{sourate:3}{verset:3}.mp3
```

### Dossiers des récitateurs (extraits du code)
```
AbdulBaset_Mujawwad/    - Abdul Baset Abdul Samad (Mujawwad)
AbdulBaset_Murattal/    - Abdul Baset Abdul Samad (Murattal)
Husary_Mujawwad/        - Mahmoud Khalil Al-Husary (Mujawwad)
Husary_Murattal/        - Mahmoud Khalil Al-Husary (Murattal)
Alafasy/                - Mishary Rashid Alafasy
Jibreel/                - Abu Bakr Al-Jibreel
Minshawi_Mujawwad/      - Mohamed Siddiq Al-Minshawi (Mujawwad)
Minshawi_Murattal/      - Mohamed Siddiq Al-Minshawi (Murattal)
Rifai/                  - Ibrahim Al-Rifai
Shatri/                 - Saad Al-Ghamdi (Shatri)
Shuraym/                - Abdullah Al-Shuraym
Sudais/                 - Abdul Rahman Al-Sudais
Tunaiji/                - Mahmoud Al-Tunaiji
```

### Exemple
- Sourate 1, Verset 1 par Alafasy: `https://everyayah.com/data/Alafasy/001001.mp3`

---

## 4. Images Tajweed (qurancdn.com)

### Format de l'URL
```
https://static.qurancdn.com/images/w/rq-color/{sourate}/{verset}/{mot}.png
```

### Exemple
- Sourate 1, Verset 1, Mot 1: `https://static.qurancdn.com/images/w/rq-color/1/1/1.png`

### Couleurs du Tajweed
- **Rouge** : Arrêt obligatoire (وقف لازم)
- **Vert** : Prononciation nasale ( Gunna)
- **Bleu** : Allongement (Madd)
- **Marron** : Emphasis (Qalqala)

---

## 5. Texte brut (tanzil.net)

### Téléchargement
```
https://tanzil.net/code/plaintext/quran-uthmani.txt
```

### Format du fichier
```
{sourate}|{verset}|{texte}
```

### Exemple
```
1|1|بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
1|2|ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ
```

---

## 6. Vérification de connexion internet

### Méthode utilisée dans House of Quran
```csharp
internal static bool CheckForInternetConnection(int timeoutMs = 4500, string url = null)
{
    url ??= CultureInfo.InstalledUICulture switch
    {
        { Name: var n } when n.StartsWith("fa") => // Iran
            "http://www.aparat.com",
        { Name: var n } when n.StartsWith("zh") => // Chine
            "http://www.baidu.com",
        _ =>
            "http://www.gstatic.com/generate_204",
    };

    var request = (HttpWebRequest)WebRequest.Create(url);
    request.KeepAlive = false;
    request.Timeout = timeoutMs;
    using (var response = (HttpWebResponse)request.GetResponse())
        return true;
}
```

### Équivalent JavaScript
```javascript
async function checkInternetConnection() {
    try {
        const response = await fetch('https://www.gstatic.com/generate_204', {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-cache'
        });
        return true;
    } catch {
        return false;
    }
}
```

---

## 7. Structure des données pour votre site

### Recommandée (basée sur House of Quran)
```json
{
  "quran": {
    "surahs": [...],
    "totalAyahs": 6236,
    "lastUpdated": "2023-05-31"
  },
  "recitateurs": [...],
  "settings": {
    "defaultRecitateur": "Alafasy",
    "enableTajweed": true,
    "mode": "lecture",
    "repetitionCount": 3
  }
}
```

### Stockage local (pour hors-ligne)
```javascript
// Sauvegarde les données téléchargées
localStorage.setItem('quranData', JSON.stringify(quranJson));
localStorage.setItem('audioCache', JSON.stringify(audioIndex));

// Récupération
const quranData = JSON.parse(localStorage.getItem('quranData'));
```
