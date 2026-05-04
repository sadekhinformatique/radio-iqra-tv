import { motion } from 'motion/react';
import { BookOpen, Zap, RotateCw, Brain, ArrowRight } from 'lucide-react';
import type { LearningMode, Reciter } from '../../types/learning';

interface ModeSelectorProps {
  onModeSelected: (mode: LearningMode) => void;
  currentMode: LearningMode;
  reciters: Reciter[];
  onReciterChange: (reciter: Reciter) => void;
}

const modes = [
  {
    id: 'progressive-reading',
    name: '📖 Lecture Progressive',
    description: 'Lisez le Coran verset par verset avec assistance audio',
    icon: BookOpen,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600'
  },
  {
    id: 'word-by-word',
    name: '🔤 Mot par Mot',
    description: 'Apprenez chaque mot individuellement avec Tajweed',
    icon: Zap,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600'
  },
  {
    id: 'spaced-repetition',
    name: '🔄 Répétition Espacée',
    description: 'Système SRS pour une mémorisation durable',
    icon: RotateCw,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600'
  },
  {
    id: 'memorization',
    name: '💪 Mémorisation',
    description: 'Entraînement intensif pour la mémorisation',
    icon: Brain,
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600'
  }
];

export default function ModeSelector({
  onModeSelected,
  currentMode,
  reciters,
  onReciterChange
}: ModeSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Reciter Selection */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 shadow-xl border border-gray-50"
      >
        <h2 className="text-xl font-bold text-iqra-green mb-4 flex items-center gap-2">
          🎙️ Sélectionnez un Récitateur
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reciters.map((reciter) => (
            <motion.button
              key={reciter.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onReciterChange(reciter)}
              className="p-4 rounded-2xl border-2 border-gray-100 hover:border-iqra-gold bg-white hover:bg-iqra-gold/5 transition-all text-left"
            >
              <p className="font-bold text-gray-800">{reciter.name}</p>
              <p className="text-xs text-gray-500 mt-1">{reciter.recitation_type}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Mode Selection */}
      <div>
        <h2 className="text-xl font-bold text-iqra-green mb-4">
          Choisissez votre Mode d'Apprentissage
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modes.map((mode, idx) => {
            const Icon = mode.icon;
            const isSelected = currentMode === mode.id;

            return (
              <motion.button
                key={mode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onModeSelected(mode.id as LearningMode)}
                className={`relative overflow-hidden rounded-3xl p-6 text-left transition-all ${
                  isSelected
                    ? 'ring-2 ring-iqra-gold shadow-2xl'
                    : 'shadow-lg border border-gray-50'
                } ${mode.bgColor}`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 ${isSelected ? 'opacity-5' : ''} transition-all`} />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {mode.name}
                      </h3>
                      <p className="text-gray-600 text-xs mt-1">{mode.description}</p>
                    </div>
                    <Icon className={`${mode.textColor}`} size={24} />
                  </div>

                  {/* Benefits */}
                  <div className="mt-4 space-y-1">
                    {mode.id === 'progressive-reading' && (
                      <>
                        <p className="text-xs text-gray-600">✓ Parfait pour débuter</p>
                        <p className="text-xs text-gray-600">✓ Rythme libre</p>
                        <p className="text-xs text-gray-600">✓ Audio complet</p>
                      </>
                    )}
                    {mode.id === 'word-by-word' && (
                      <>
                        <p className="text-xs text-gray-600">✓ Prononciation exacte</p>
                        <p className="text-xs text-gray-600">✓ Tajweed intégré</p>
                        <p className="text-xs text-gray-600">✓ Maîtrise des sons</p>
                      </>
                    )}
                    {mode.id === 'spaced-repetition' && (
                      <>
                        <p className="text-xs text-gray-600">✓ Mémorisation durable</p>
                        <p className="text-xs text-gray-600">✓ Algorithme SRS</p>
                        <p className="text-xs text-gray-600">✓ Optimal scientifique</p>
                      </>
                    )}
                    {mode.id === 'memorization' && (
                      <>
                        <p className="text-xs text-gray-600">✓ Intensive et rapide</p>
                        <p className="text-xs text-gray-600">✓ Répétition forte</p>
                        <p className="text-xs text-gray-600">✓ Évaluation stricte</p>
                      </>
                    )}
                  </div>

                  {/* Select Button */}
                  {isSelected ? (
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-iqra-gold text-white rounded-xl font-bold text-sm">
                      ✓ Sélectionné
                    </div>
                  ) : (
                    <div className="mt-4 inline-flex items-center gap-2 text-iqra-gold font-bold hover:gap-3 transition-all text-sm">
                      Commencer <ArrowRight size={16} />
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-iqra-green/5 to-iqra-gold/5 rounded-3xl p-4 border border-iqra-green/10"
      >
        <p className="text-xs text-gray-600">
          💡 <span className="font-semibold">Conseil:</span> Vous pouvez changer de mode à tout moment. Votre progression sera sauvegardée automatiquement.
        </p>
      </motion.div>
    </div>
  );
}
