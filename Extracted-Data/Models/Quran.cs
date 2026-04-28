using System;
using System.Collections.Generic;

namespace House_of_Quran
{
    // Classe représentant un verset (Ayah) du Coran
    public class Ayah
    {
        public int Number { get; set; } // Numéro global du verset dans le Coran
        public string Text { get; set; } // Texte arabe du verset
        public int NumberInSurah { get; set; } // Numéro du verset dans la sourate
        public int Juz { get; set; } // Numéro du Juz (partie de 1/30)
        public int Manzil { get; set; } // Numéro du Manzil (partie de 1/7)
        public int Page { get; set; } // Numéro de page (mushaf standard)
        public int Ruku { get; set; } // Numéro du Ruku (section)
        public int HizbQuarter { get; set; } // Quart du Hizb
        public object Sajda { get; set; } // Indique si le verset contient une prosternation
    }

    // Classe représentant une sourate (Surah) du Coran
    public class Surah
    {
        public int Number { get; set; } // Numéro de la sourate (1-114)
        public string Name { get; set; } // Nom arabe de la sourate
        public string EnglishName { get; set; } // Nom en anglais
        public string EnglishNameTranslation { get; set; } // Traduction du nom en anglais
        public string RevelationType { get; set; } // Type de révélation : "Meccan" ou "Medinan"
        public List<Ayah> Ayahs { get; set; } // Liste des versets de la sourate
        public List<int> DownloadedRecitateur { get; set; } // Liste des récitateurs dont l'audio est téléchargé
    }
}
