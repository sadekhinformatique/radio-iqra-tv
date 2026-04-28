import { motion } from 'motion/react';
import { Play, Pause, Volume2, Volume, SkipBack, SkipForward } from 'lucide-react';
import type { LearningMode, Reciter } from '../../types/learning';

interface AudioControllerProps {
  isPlaying: boolean;
  mode: LearningMode;
  onPlayWord: () => void;
  onPlayVerse: () => void;
  onStop: () => void;
  reciter: Reciter | null;
}

export default function AudioController({
  isPlaying,
  mode,
  onPlayWord,
  onPlayVerse,
  onStop,
  reciter
}: AudioControllerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-iqra-green/10 to-iqra-gold/10 rounded-3xl p-6 border border-iqra-green/20"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-iqra-green">🔊 Contrôles Audio</h3>
        {reciter && (
          <span className="text-xs bg-iqra-gold/20 text-iqra-gold px-3 py-1 rounded-full font-semibold">
            {reciter.name}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Word-by-Word Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={mode === 'word-by-word' || !isPlaying ? onPlayWord : onStop}
          className="p-4 rounded-xl bg-white border-2 border-blue-200 text-blue-600 font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2 group"
        >
          {isPlaying && mode === 'word-by-word' ? (
            <>
              <Pause size={20} />
              Pause
            </>
          ) : (
            <>
              <Play size={20} />
              Mot par Mot
            </>
          )}
        </motion.button>

        {/* Full Verse Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={mode === 'progressive-reading' || !isPlaying ? onPlayVerse : onStop}
          className="p-4 rounded-xl bg-white border-2 border-emerald-200 text-emerald-600 font-semibold hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 group"
        >
          {isPlaying && mode === 'progressive-reading' ? (
            <>
              <Pause size={20} />
              Pause
            </>
          ) : (
            <>
              <Play size={20} />
              Verset Complet
            </>
          )}
        </motion.button>

        {/* Stop Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStop}
          className="col-span-2 p-3 rounded-xl bg-red-50 border-2 border-red-200 text-red-600 font-semibold hover:bg-red-100 transition-all"
        >
          ⏹ Arrêter
        </motion.button>
      </div>

      {/* Status Indicator */}
      <div className="mt-4 p-3 bg-white rounded-xl">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
          <span className="text-sm font-semibold text-gray-600">
            {isPlaying ? '▶ Lecture en cours...' : '⏸ Arrêt'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
