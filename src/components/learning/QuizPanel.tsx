import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Quiz } from '../../types/learning';

interface QuizPanelProps {
  surahNumber: number;
  verseNumber: number;
  onClose: () => void;
  onComplete: (score: number) => void;
}

interface QuizQuestion extends Quiz {
  userAnswer?: number;
  isCorrect?: boolean;
}

export default function QuizPanel({
  surahNumber,
  verseNumber,
  onClose,
  onComplete
}: QuizPanelProps) {
  const [quiz, setQuiz] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadQuiz();
  }, [surahNumber, verseNumber]);

  const loadQuiz = async () => {
    setLoading(true);
    try {
      // Essayer de charger depuis Supabase
      const { data } = await supabase
        .from('quizzes')
        .select('*')
        .eq('surah_number', surahNumber)
        .eq('verse_number', verseNumber)
        .limit(1)
        .single();

      if (data) {
        setQuiz(data as QuizQuestion);
      } else {
        // Quiz par défaut si pas de données
        setQuiz({
          id: `quiz_${surahNumber}_${verseNumber}`,
          surah_number: surahNumber,
          verse_number: verseNumber,
          type: 'comprehension',
          question: `Quelle est la signification principale du verset ${verseNumber} de la sourate ${surahNumber}?`,
          options: [
            'Première option de réponse',
            'Deuxième option de réponse',
            'Troisième option de réponse',
            'Quatrième option de réponse'
          ],
          correct_answer: 0,
          explanation: `Cette question teste votre compréhension du verset. La bonne réponse est l'option 1.`
        } as QuizQuestion);
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
    const isCorrect = index === quiz?.correct_answer;
    setScore(isCorrect ? 10 : 0);

    // Marquer la réponse
    if (quiz) {
      setQuiz({
        ...quiz,
        userAnswer: index,
        isCorrect
      });
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <div className="animate-spin w-12 h-12 border-4 border-iqra-gold border-t-transparent rounded-full" />
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-white flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">📝 Quiz d'Évaluation</h2>
              <p className="text-blue-100 mt-2">Sourate {surahNumber}, Verset {verseNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {quiz && (
              <>
                {/* Question */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {quiz.question}
                  </h3>
                  <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {quiz.type === 'memorization'
                      ? '💾 Mémorisation'
                      : quiz.type === 'comprehension'
                      ? '📖 Compréhension'
                      : '🎯 Tajweed'}
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {quiz.options.map((option, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === quiz.correct_answer;
                    const isUserWrong =
                      isSelected && quiz.userAnswer !== undefined && !quiz.isCorrect;

                    return (
                      <motion.button
                        key={idx}
                        whileHover={!showResult ? { scale: 1.02 } : {}}
                        onClick={() => !showResult && handleAnswer(idx)}
                        disabled={showResult}
                        className={`w-full p-4 rounded-2xl font-semibold text-left transition-all border-2 ${
                          showResult
                            ? isCorrect
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                              : isUserWrong
                              ? 'bg-red-50 border-red-300 text-red-700'
                              : 'bg-gray-50 border-gray-200 text-gray-600'
                            : isSelected
                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                            : 'bg-white border-gray-100 text-gray-700 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {showResult && isCorrect && (
                            <CheckCircle2 size={20} className="text-emerald-600" />
                          )}
                          {showResult && isUserWrong && (
                            <XCircle size={20} className="text-red-600" />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-2xl ${
                        quiz.isCorrect
                          ? 'bg-emerald-50 border border-emerald-200'
                          : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      {quiz.isCorrect ? (
                        <>
                          <p className="font-bold text-emerald-700 mb-2">
                            ✓ Bravo! Réponse correcte!
                          </p>
                          <p className="text-emerald-600 text-sm">
                            {quiz.explanation}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-bold text-red-700 mb-2">
                            ✗ Réponse incorrecte
                          </p>
                          <p className="text-red-600 text-sm mb-3">
                            {quiz.explanation}
                          </p>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Score */}
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-iqra-gold/10 rounded-2xl text-center"
                  >
                    <p className="text-lg font-bold text-iqra-gold">
                      🎯 Score: {score}/10 points
                    </p>
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 flex gap-3 justify-end border-t border-gray-100">
            <button
              onClick={() => {
                setSelectedAnswer(null);
                setShowResult(false);
                loadQuiz();
              }}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
            >
              Nouvelle question
            </button>
            <button
              onClick={() => {
                onComplete(score);
                onClose();
              }}
              className="px-6 py-3 bg-iqra-gold text-white font-semibold rounded-xl hover:bg-iqra-gold/90 transition-all"
            >
              Fermer
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
