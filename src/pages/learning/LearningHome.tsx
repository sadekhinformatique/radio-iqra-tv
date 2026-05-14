import { motion } from 'motion/react';
import { BookOpen, Star, Trophy, ArrowRight, CheckCircle2, Lock, Play, GraduationCap, Users, Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLearning } from '../../hooks/useLearning';

const levels = [
  { id: 1, title: 'Alphabet Arabe', desc: 'Maîtrisez les 28 lettres et leur prononciation correcte.', icon: Star, color: 'text-emerald-400', bg: 'bg-emerald-500/10', lessons: 12 },
  { id: 2, title: 'Lecture & Syllabes', desc: 'Apprenez à combiner les lettres avec les voyelles.', icon: BookOpen, color: 'text-gold', bg: 'bg-gold/10', lessons: 15 },
  { id: 3, title: 'Lecture du Coran', desc: 'Commencez à lire vos premiers versets coraniques.', icon: GraduationCap, color: 'text-blue-400', bg: 'bg-blue-500/10', lessons: 20 },
  { id: 4, title: 'Règles de Tajwid', desc: 'Perfectionnez votre récitation avec les règles de tajwid.', icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-500/10', lessons: 25 },
  { id: 5, title: 'Mémorisation', desc: 'Mémorisez les sourates avec une méthode structurée.', icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/10', lessons: 30 },
  { id: 6, title: 'Compréhension', desc: 'Comprenez le sens profond du message divin.', icon: Heart, color: 'text-red-400', bg: 'bg-red-500/10', lessons: 18 },
  { id: 7, title: 'Pratiques & Invocations', desc: 'Apprenez les bases du culte et les douas essentiels.', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10', lessons: 22 },
];

export default function LearningHome() {
  const { userProgress } = useLearning();

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 lg:px-8 bg-night overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]" />
        <div className="absolute top-40 right-[-10%] w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-20 left-[-10%] w-[500px] h-[500px] bg-gold/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/20 border border-gold/20 text-gold text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <Sparkles size={14} /> Académie Radio Iqra
            </div>
            <h1 className="text-5xl lg:text-8xl font-cairo font-black text-white leading-[1.1] mb-8 tracking-tighter">
              Apprenez le <span className="text-gold italic">Coran</span><br />
              avec Excellence.
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed font-medium">
              Une plateforme interactive conçue pour vous accompagner de l'alphabet jusqu'à la mémorisation complète, 
              avec des méthodes modernes et spirituelles.
            </p>
            <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
              <Link to="/learning/alphabet" className="px-10 py-5 bg-gold text-night font-black rounded-3xl premium-shadow hover:scale-105 transition-all flex items-center gap-3 uppercase tracking-widest text-xs">
                Commencer l'apprentissage <ArrowRight size={18} />
              </Link>
              <button className="px-10 py-5 glass border-white/10 text-white font-bold rounded-3xl hover:bg-white/5 transition-all flex items-center gap-3">
                <Play size={18} fill="white" /> Voir la démo
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex-1 relative"
          >
            <div className="relative z-10 rounded-[60px] overflow-hidden glass p-4 border-white/10 gold-glow">
              <img 
                src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop" 
                alt="Coran Learning" 
                className="rounded-[50px] w-full"
              />
            </div>
            {/* Floating Stats Card */}
            <div className="absolute -bottom-10 -left-10 glass p-8 rounded-[40px] border-emerald-500/20 shadow-2xl animate-bounce-slow">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Trophy size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Ma Progression</p>
                  <p className="text-2xl font-black text-white">45% Terminé</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Level Progression Grid */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-cairo font-black text-white uppercase tracking-tight mb-4">Votre <span className="text-gold">Parcours</span></h2>
            <div className="w-24 h-1 bg-gold mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {levels.map((level, i) => (
              <motion.div 
                key={level.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                <Link to={`/learning/level/${level.id}`} className="block">
                  <div className="glass-card rounded-[48px] p-8 h-full flex flex-col border-white/5 hover:border-gold/30 transition-all group-hover:-translate-y-2">
                    <div className={`w-16 h-16 rounded-2xl ${level.bg} ${level.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                      <level.icon size={32} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-white mb-4 leading-tight">{level.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-6">
                        {level.desc}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{level.lessons} Leçons</span>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gold opacity-0 group-hover:opacity-100 transition-all">
                        <ArrowRight size={16} />
                      </div>
                    </div>

                    {/* Lock Status Example (only for first level unlocked) */}
                    {level.id > 1 && (
                      <div className="absolute inset-0 bg-night/60 backdrop-blur-[2px] rounded-[48px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <div className="bg-white/10 p-4 rounded-2xl">
                          <Lock size={24} className="text-white/40" />
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Interactive Stats Section */}
        <section className="glass-card rounded-[60px] p-12 lg:p-20 border-white/5 bg-gradient-to-br from-[#0F5132]/20 to-transparent">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { label: 'Étudiants actifs', val: '12,450+', icon: Users, color: 'text-blue-400' },
              { label: 'Leçons complétées', val: '85,000+', icon: CheckCircle2, color: 'text-emerald-400' },
              { label: 'Certificats délivrés', val: '1,200+', icon: Trophy, color: 'text-gold' },
            ].map((stat, i) => (
              <div key={i} className="space-y-4">
                <div className={`w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center ${stat.color}`}>
                  <stat.icon size={32} />
                </div>
                <h4 className="text-5xl font-black text-white tracking-tighter">{stat.val}</h4>
                <p className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
