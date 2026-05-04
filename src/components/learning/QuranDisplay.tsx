import { motion } from 'motion/react';
import type { Surah } from '../../types/learning';

interface QuranDisplayProps {
  surah: Surah;
  currentVerse: number;
  currentWord: number;
  showTajweed: boolean;
  showTranslation: boolean;
  onVerseClick: (verseIndex: number) => void;
  onWordClick: (wordIndex: number) => void;
}

export default function QuranDisplay({
  surah,
  currentVerse,
  currentWord,
  showTajweed,
  onVerseClick,
  onWordClick
}: QuranDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-2xl border border-gray-50 overflow-hidden"
    >
      {/* Surah Header */}
      <div className="bg-gradient-to-r from-iqra-green to-iqra-gold p-6 text-white">
        <div className="text-center">
          <p className="text-4xl font-serif mb-2 text-iqra-gold">{surah.name_ar}</p>
          <h1 className="text-3xl font-bold mb-2">{surah.name_fr}</h1>
          <p className="text-white/80 text-base">
            {surah.ayahs.length} آية • Sourate {surah.number}
          </p>
        </div>
      </div>

      {/* Quran Text */}
      <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
        {surah.ayahs.map((ayah, verseIdx) => (
          <motion.div
            key={ayah.numberInSurah}
            onClick={() => onVerseClick(verseIdx)}
            animate={{
              backgroundColor:
                verseIdx === currentVerse
                  ? 'rgb(252, 246, 234)' // bg-amber-50
                  : 'transparent'
            }}
            transition={{ duration: 0.2 }}
            className="p-4 rounded-2xl cursor-pointer hover:bg-iqra-gold/5 transition-all group"
          >
            {/* Verse Number */}
            <div className="flex items-start justify-between mb-3">
              <div className="w-8 h-8 rounded-full bg-iqra-gold text-white flex items-center justify-center font-bold text-xs">
                {ayah.numberInSurah}
              </div>
              {verseIdx === currentVerse && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-3 py-1 bg-iqra-gold/20 text-iqra-gold text-xs font-bold rounded-full"
                >
                  Verset actuel
                </motion.div>
              )}
            </div>

            {/* Arabic Text */}
            <div className="mb-4">
              <div className="text-right text-2xl leading-relaxed font-serif text-iqra-green group-hover:text-iqra-gold transition-colors">
                {ayah.words.map((word, wordIdx) => (
                  <motion.span
                    key={`${verseIdx}-${wordIdx}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onWordClick(wordIdx);
                    }}
                    animate={{
                      backgroundColor:
                        verseIdx === currentVerse && wordIdx === currentWord
                          ? 'rgba(255, 180, 0, 0.3)'
                          : 'transparent',
                      color:
                        verseIdx === currentVerse && wordIdx === currentWord
                          ? 'rgb(20, 112, 101)'
                          : 'inherit'
                    }}
                    transition={{ duration: 0.1 }}
                    className="mx-1 px-2 py-1 rounded cursor-pointer hover:bg-iqra-gold/20 transition-colors inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>

              {/* Tajweed Badge */}
              {showTajweed && (
                <div className="mt-3 text-center text-xs bg-emerald-50 text-emerald-700 py-2 rounded-lg font-semibold">
                  🎯 Tajweed: Suivez les règles de prononciation
                </div>
              )}
            </div>

            {/* Verse Number in Circle (Islamic style) */}
            <div className="text-center mb-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-iqra-gold/50 text-iqra-gold text-xs font-bold">
                ۝
              </span>
            </div>

            {/* Translation */}
            <div className="pt-3 border-t border-iqra-gold/10">
              <p className="text-gray-600 text-sm leading-relaxed italic">
                {/* Placeholder - À récupérer depuis l'API */}
                📖 Traduction française du verset {ayah.numberInSurah}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
