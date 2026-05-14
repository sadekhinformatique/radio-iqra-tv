import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, ArrowRight, Trophy, Sparkles, RefreshCw, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const sampleQuiz = {
  title: "Validation : Alphabet Arabe - Module 1",
  questions: [
    {
      id: 1,
      question: "Quelle est la première lettre de l'alphabet arabe ?",
      options: ["Ba (ب)", "Alif (أ)", "Ta (ت)", "Jim (ج)"],
      correct: 1,
      explanation: "L'Alif (أ) est la première lettre, elle sert souvent de support pour le son 'a'."
    },
    {
      id: 2,
      question: "Comment se prononce la lettre 'ب' ?",
      options: ["Comme un 'T'", "Comme un 'S'", "Comme un 'B'", "Comme un 'N'"],
      correct: 2,
      explanation: "La lettre Ba (ب) se prononce comme le 'B' français."
    }
  ]
};

export default function QuizView() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === sampleQuiz.questions[currentStep].correct) {
      setScore(prev => prev + 1);
    }
  };

  const nextStep = () => {
    if (currentStep < sampleQuiz.questions.length - 1) {
      setCurrentStep(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-night flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass-card rounded-[60px] p-12 text-center border-white/5 shadow-2xl"
        >
          <div className="w-24 h-24 bg-gold/20 rounded-[40px] mx-auto flex items-center justify-center text-gold mb-8 gold-glow">
            <Trophy size={48} />
          </div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tight mb-2">Félicitations !</h2>
          <p className="text-gray-500 font-medium mb-8 uppercase tracking-widest text-xs">Vous avez terminé le quiz</p>
          
          <div className="text-7xl font-black text-gold mb-10">
            {Math.round((score / sampleQuiz.questions.length) * 100)}%
          </div>
          
          <div className="space-y-4">
            <Link to="/apprentissage" className="block w-full py-5 bg-gold text-night font-black rounded-3xl uppercase tracking-widest text-xs hover:scale-105 transition-all">
              Continuer le parcours
            </Link>
            <button onClick={() => window.location.reload()} className="block w-full py-5 bg-white/5 text-white font-bold rounded-3xl flex items-center justify-center gap-3">
              <RefreshCw size={18} /> Recommencer
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const question = sampleQuiz.questions[currentStep];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-night">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 text-center">
          <p className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mb-4">Évaluation de Niveau</p>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">{sampleQuiz.title}</h1>
          <div className="flex items-center justify-center gap-2 mt-6">
            {sampleQuiz.questions.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentStep ? 'w-12 bg-gold' : (i < currentStep ? 'w-6 bg-emerald-500' : 'w-6 bg-white/10')}`} />
            ))}
          </div>
        </header>

        <motion.div 
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card rounded-[48px] p-10 border-white/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
            <Sparkles size={120} />
          </div>

          <h3 className="text-2xl font-black text-white mb-10 leading-tight">
            {question.question}
          </h3>

          <div className="grid gap-4">
            {question.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === question.correct;
              const showCheck = isAnswered && isCorrect;
              const showWrong = isAnswered && isSelected && !isCorrect;

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={isAnswered}
                  className={`w-full p-6 rounded-[28px] border-2 text-left transition-all flex items-center justify-between group ${
                    showCheck ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' :
                    showWrong ? 'bg-red-500/20 border-red-500 text-red-400' :
                    isSelected ? 'border-gold bg-gold/10 text-white' : 'bg-white/5 border-white/5 hover:border-white/10 text-gray-400'
                  }`}
                >
                  <span className="font-bold">{option}</span>
                  {showCheck && <CheckCircle2 size={24} />}
                  {showWrong && <XCircle size={24} />}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {isAnswered && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-10 p-6 bg-white/5 rounded-[32px] border-l-4 border-gold"
              >
                <p className="text-sm text-gray-400 leading-relaxed italic">
                  <span className="text-gold font-black uppercase text-[10px] block mb-2 tracking-widest">Explication</span>
                  {question.explanation}
                </p>
                <button 
                  onClick={nextStep}
                  className="mt-8 w-full py-4 bg-gold text-night font-black rounded-2xl uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all"
                >
                  {currentStep === sampleQuiz.questions.length - 1 ? "Voir les résultats" : "Question Suivante"} <ArrowRight size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
