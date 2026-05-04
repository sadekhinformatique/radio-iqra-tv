import { motion } from 'motion/react';
import {
  SkipBack,
  SkipForward,
  CheckCircle2,
  HelpCircle,
  RotateCcw
} from 'lucide-react';

interface LearningControlsProps {
  currentVerse: number;
  totalVerses: number;
  onPrevious: () => void;
  onNext: () => void;
  onMarkComplete: () => void;
  onQuiz: () => void;
}

export default function LearningControls({
  currentVerse,
  totalVerses,
  onPrevious,
  onNext,
  onMarkComplete,
  onQuiz
}: LearningControlsProps) {
  const isAtEnd = currentVerse >= totalVerses - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-4 shadow-xl border border-gray-50"
    >
      <div className="grid grid-cols-4 gap-2 mb-4">
        {/* Previous */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPrevious}
          disabled={currentVerse === 0}
          className="p-2.5 rounded-lg bg-gray-50 text-iqra-green hover:bg-iqra-green/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold flex items-center justify-center gap-2"
        >
          <SkipBack size={18} />
          <span className="hidden sm:inline">Précédent</span>
        </motion.button>

        {/* Progress */}
        <div className="col-span-2 flex items-center justify-center p-2 rounded-lg bg-iqra-gold/10">
          <span className="text-sm font-bold text-iqra-green">
            {currentVerse + 1} / {totalVerses}
          </span>
        </div>

        {/* Next */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="p-2.5 rounded-lg bg-iqra-gold/10 text-iqra-gold hover:bg-iqra-gold/20 transition-all font-semibold flex items-center justify-center gap-2"
        >
          <span className="hidden sm:inline">Suivant</span>
          <SkipForward size={18} />
        </motion.button>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onQuiz}
          className="p-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all font-semibold flex items-center justify-center gap-2"
        >
          <HelpCircle size={18} />
          <span className="hidden sm:inline">Quiz</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            // Reset to verse 0
          }}
          className="p-3 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all font-semibold flex items-center justify-center gap-2"
        >
          <RotateCcw size={18} />
          <span className="hidden sm:inline">Recommencer</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMarkComplete}
          disabled={!isAtEnd}
          className="p-3 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={18} />
          <span className="hidden sm:inline">Terminer</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
