# Logique de téléchargement - House of Quran

## Vue d'ensemble
L'application permet de télécharger les audios pour une utilisation hors-ligne.

---

## 1. Structure des dossiers de données

```
data/
├── Quran.json                          # Données textuelles du Coran (114 sourates)
├── recitateur.json                     # Liste des récitateurs
├── quran/
│   └── {EnglishName}/                 # Dossier par sourate (ex: Al-Fatiha)
│       ├── verse/                      # Audios des versets complets
│       │   └── {RecitateurIndex}-{Sourate}{Verset}{Extension}
│       │       Ex: 0-001001.mp3
│       ├── wbw/                        # Audios word-by-word (mot par mot)
│       │   └── {Sourate}{Verset}_{Mot}.mp3
│       │       Ex: 001_001_001.mp3
│       └── tajweed/                    # Images des règles de Tajweed
│           └── {Sourate}_{Verset}_{Mot}.png
```

---

## 2. Génération des liens de téléchargement

### Audio Word-by-Word
```csharp
private string GetWordDownloadLink(int surahId, int verseId, int motPos)
{
    // surahId : Index de la sourate (0-based)
    // verseId : Numéro du verset dans la sourate
    // motPos : Position du mot dans le verset
    
    return "https://audio.qurancdn.com/wbw/" 
        + (surahId + 1).ToString().PadLeft(3, '0') + "_"
        + verseId.ToString().PadLeft(3, '0') + "_"
        + motPos.ToString().PadLeft(3, '0') 
        + ".mp3";
}
```

### Audio Verset complet
```csharp
private string GetVerseDownloadLink(int surahId, int versePos, int recitateur)
{
    // recitateur : Index du récitateur dans la liste Recitateurs
    
    return Recitateurs[recitateur].Lien 
        + (surahId + 1).ToString().PadLeft(3, '0') 
        + versePos.ToString().PadLeft(3, '0') 
        + Recitateurs[recitateur].Extension;
}
```

### Image Tajweed
```
https://static.qurancdn.com/images/w/rq-color/{Sourate+1}/{Verset}/{Mot}.png
```

---

## 3. Processus de téléchargement

### Initialisation
1. **Vérification de la connexion internet** : `Utilities.CheckForInternetConnection()`
2. **Chargement de la liste de téléchargement** : `Properties.Settings.Default.DownloadList`
3. **Index actuel** : `Properties.Settings.Default.CurrentDownloadIndex`

### Téléchargement asynchrone
```csharp
private void DownloadAll(int recitateur = -1, int sourateIndex = -1)
{
    if (HaveInternet)
    {
        string url = Properties.Settings.Default.DownloadList[...];
        string folderPath;
        
        if (url.Contains("wbw")) // Mot par mot
        {
            folderPath = @"data\quran\" + Quran![sourateIndex - 1].EnglishName 
                + @"\wbw\" + url.Substring(35, 7) + ".mp3";
        }
        else if (url.Contains("data")) // Verset
        {
            folderPath = @"data\quran\" + Quran![sourateIndex - 1].EnglishName 
                + @"\verse\" + recitateur + "-" 
                + url.Substring(url.LastIndexOf("/") + 4, 3) 
                + Recitateurs[recitateur].Extension;
        }
        else // Tajweed
        {
            folderPath = @"data\quran\" + Quran![sourateIndex - 1].EnglishName 
                + @"\tajweed\" + ...;
        }
        
        WcDownloader.DownloadFileAsync(new Uri(url), folderPath);
    }
}
```

### Événement de fin de téléchargement
```csharp
private void DownloadFileCompleted(object sender, AsyncCompletedEventArgs e)
{
    // Si dernier fichier de la liste
    if (CurrentDownloadIndex == DownloadList.Count - 1)
    {
        progressBar_downloader.Value = 0;
        SaveQuran(); // Sauvegarde l'état
        DownloadList.Clear();
    }
    else
    {
        // Passe au fichier suivant
        CurrentDownloadIndex++;
        string nextUrl = DownloadList[CurrentDownloadIndex];
        DownloadAll(...);
    }
}
```

---

## 4. Gestion hors-ligne (Offline)

### Suppression des données
```csharp
private void checkBox_HorsLigne_Unchecked(object sender, RoutedEventArgs e)
{
    // Si un seul récitateur téléchargé pour cette sourate
    if (Quran[...].DownloadedRecitateur.Count == 1)
    {
        // Supprime tout le dossier de la sourate
        Directory.Delete(@"data\quran\" + EnglishName, true);
    }
    else
    {
        // Supprime uniquement les fichiers du récitateur sélectionné
        string rootFolderPath = @"data\quran\" + EnglishName + @"\verse";
        string filesToDelete = comboBox_Recitateur.SelectedIndex + "-";
        
        string[] fileList = Directory.GetFiles(rootFolderPath)
            .Where(x => x.Contains(filesToDelete)).ToArray();
        
        foreach (string file in fileList)
            File.Delete(file);
    }
}
```

---

## 5. Vérification de l'état de téléchargement

### Couleur des éléments dans l'interface
- **Vert** : Audio téléchargé et disponible hors-ligne
- **Rouge** : Audio non téléchargé, nécessite une connexion
- **Gris** : En cours de téléchargement

### Fonction `ColorEffectOnDownloadedRecitator(int sourateId)`
Met à jour l'interface pour refléter les récitateurs dont les audios sont téléchargés.

---

## 6. Reprise du téléchargement

### Au démarrage de l'application
```csharp
private void ContinueDownloading()
{
    // Si un téléchargement était en cours lors de la fermeture
    if (Properties.Settings.Default.DownloadList.Count > 0 
        && Properties.Settings.Default.CurrentDownloadIndex > 0)
    {
        // Reprend au dernier fichier téléchargé
        DownloadAll(...);
    }
}
```

---

## 7. Liste des récitateurs (Utilities.cs)

### Génération du fichier `recitateur.json`
```csharp
internal static void RecitateurToJson()
{
    List<Recitateur> recitateurs = new List<Recitateur>();
    
    // Lecture du fichier brut (format particulier)
    List<string> lines = File.ReadAllLines(@"data\dev\recitateurbrute.txt");
    
    for (int i = 0; i < lines.Count; i++)
    {
        if (lines[i].Contains("subfolder"))
        {
            string nom = ...; // Extraction du nom
            string nom2 = ...; // Type (Mujawwad, etc.)
            string nom3 = ...; // Dossier sur everyayah.com
            
            recitateurs.Add(new Recitateur(
                nom.Replace("_", " "), 
                nom2, 
                "https://everyayah.com/data/" + nom3 + "/", 
                ".mp3"
            ));
        }
    }
    
    // Tri par nom
    recitateurs = recitateurs.OrderBy(x => x.Nom).ToList();
    
    // Sauvegarde en JSON
    File.WriteAllText(@"data\recitateur.json", 
        JsonConvert.SerializeObject(recitateurs, Formatting.Indented));
}
```

### Récitateurs de secours (commentés dans le code)
```csharp
// recitateurs.Add(new Recitateur("AbdulBaset", "Mujawwad", "https://verses.quran.com/AbdulBaset/Mujawwad/ogg/", ".ogg"));
// recitateurs.Add(new Recitateur("AbdulBaset", "Murattal", "https://verses.quran.com/AbdulBaset/Murattal/ogg/", ".ogg"));
// recitateurs.Add(new Recitateur("Husary", "Mujawwad", "https://verses.quran.com/Husary/Mujawwad/ogg/", ".ogg"));
// etc.
```
