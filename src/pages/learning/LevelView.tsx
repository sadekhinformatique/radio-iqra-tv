import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Play, Lock, CheckCircle2, Clock, BookOpen, Star, Trophy } from 'lucide-react';

const levelDetails = {
  '1': { title: 'Alphabet Arabe', icon: Star, color: 'text-emerald-400', modules: [
    { id: 'm1', title: 'Les lettres de base', lessons: [
      { id: 'l1', title: 'Alif à Jim', completed: true, duration: '10 min' },
      { id: 'l2', title: 'Ha à Dal', completed: true, duration: '12 min' },
      { id: 'l3', title: 'Dhal à Zay', completed: false, duration: '15 min' },
    ]},
    { id: 'm2', title: 'Lettres complexes', lessons: [
      { id: 'l4', title: 'Sin à Sad', completed: false, locked: true, duration: '15 min' },
      { id: 'l5', title: 'Dad à Ain', completed: false, locked: true, duration: '18 min' },
    ]}
  ]}
};

export default function LevelView() {
  const { id } = useParams();
  const level = levelDetails[id as keyof typeof levelDetails] || levelDetails['1'];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 lg:px-8 bg-night">
      <div className="max-w-5xl mx-auto">
        <header className="mb-16">
          <Link to="/apprentissage" className="text-gold text-xs font-black uppercase tracking-widest flex items-center gap-2 mb-6 hover:underline">
            <ChevronLeft size={16} /> Retour au parcours
          </Link>
          <div className="flex items-center gap-6 mb-4">
            <div className={`w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center ${level.color}`}>
              <level.icon size={32} />
            </div>
            <h1 className="text-4xl lg:text-6xl font-cairo font-black text-white">{level.title}</h1>
          </div>
          <p className="text-gray-500 font-medium max-w-2xl">
            Progressez étape par étape pour maîtriser les bases de la langue du Saint Coran. 
            Chaque module contient des leçons interactives et des quiz de validation.
          </p>
        </header>

        <div className="space-y-12">
          {level.modules.map((module, mIdx) => (
            <motion.div 
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: mIdx * 0.1 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-black text-white/10 italic">0{mIdx + 1}</span>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">{module.title}</h3>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              <div className="grid gap-4">
                {module.lessons.map((lesson, lIdx) => (
                  <div 
                    key={lesson.id}
                    className={`glass-card rounded-[32px] p-6 flex items-center justify-between border-white/5 transition-all ${
                      lesson.locked ? 'opacity-50 grayscale pointer-events-none' : 'hover:border-gold/30 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        lesson.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gold'
                      }`}>
                        {lesson.completed ? <CheckCircle2 size={24} /> : (lesson.locked ? <Lock size={20} /> : <Play size={20} fill="currentColor" />)}
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-white uppercase tracking-tight">{lesson.title}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1">
                            <Clock size={12} /> {lesson.duration}
                          </span>
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1">
                            <BookOpen size={12} /> Vidéo & Audio
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="hidden sm:block">
                      {lesson.completed ? (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                          Terminé
                        </div>
                      ) : (
                        !lesson.locked && (
                          <button className="px-6 py-2 bg-gold text-night text-[10px] font-black rounded-xl uppercase tracking-widest hover:scale-105 transition-all">
                            Continuer
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Level Reward Section */}
        <div className="mt-20 p-12 glass-card rounded-[60px] border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent flex flex-col md:flex-row items-center gap-10">
          <div className="w-32 h-32 rounded-[40px] bg-emerald-500/20 flex items-center justify-center text-emerald-400 gold-glow">
            <Trophy size={64} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Certificat du Niveau {id}</h3>
            <p className="text-gray-400 font-medium max-w-xl">
              Terminez toutes les leçons et réussissez le quiz final pour débloquer votre certificat d'aptitude en {level.title}.
            </p>
          </div>
          <button className="px-10 py-5 bg-white/5 border border-white/10 text-white/30 font-black rounded-3xl uppercase tracking-widest text-[10px] cursor-not-allowed">
            Verrouillé
          </button>
        </div>
      </div>
    </div>
  );
}
