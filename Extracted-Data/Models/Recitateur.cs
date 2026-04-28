using System;

namespace House_of_Quran
{
    // Classe représentant un récitateur du Coran
    public class Recitateur
    {
        public Recitateur(string nom, string type, string lien, string extension)
        {
            Nom = nom; // Nom du récitateur
            Bytes = type; // Type de récitation (ex: "Mujawwad", "Murattal")
            Lien = lien; // URL de base pour télécharger les audios
            Extension = extension; // Extension du fichier audio (".mp3" ou ".ogg")
        }

        public string Nom { get; set; }
        public string Bytes { get; set; }
        public string Lien { get; set; }
        public string Extension { get; set; }
    }
}
