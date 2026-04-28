namespace House_of_Quran
{
    // Classe représentant une étape dans le processus d'apprentissage
    internal class Step
    {
        public Step(StepType type, int[] posInWrapPanel)
        {
            Type = type; // Type d'étape
            PosInWrapPanel = posInWrapPanel; // Positions des éléments dans l'interface
        }

        internal StepType Type { get; set; }
        internal int[] PosInWrapPanel { get; set; }
    }

    // Énumération des types d'étapes d'apprentissage
    internal enum StepType
    {
        LECTURE_MOT, // Lecture mot par mot
        LECTURE_VERSET, // Lecture verset complet
        REPETITION, // Répétition d'une section
        VOID // Pause/vide
    }
}
