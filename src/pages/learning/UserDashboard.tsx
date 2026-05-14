import { motion } from 'motion/react';
import { Trophy, Star, Clock, Calendar, ChevronRight, GraduationCap, Medal, Zap, BookOpen } from 'lucide-react';
import { useLearning } from '../../hooks/useLearning';

export default function UserDashboard() {
  const { userProgress } = useLearning();

  const badges = [
    { id: 1, name: 'Premier Pas', icon: Star, color: 'text-amber-400', earned: true },
    { id: 2, name: 'Explorateur Coranique', icon: BookOpen, color: 'text-emerald-400', earned: true },
    { id: 3, name: 'Maître du Tajwid', icon: Zap, color: 'text-gold', earned: false },
    { id: 4, name: 'Hafiz Débutant', icon: Trophy, color: 'text-blue-400', earned: false },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 lg:px-8 bg-night">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Profile Header */}
        <header className="flex flex-col md:flex-row items-center gap-10 bg-gradient-to-r from-primary/20 to-transparent p-12 rounded-[60px] border border-white/5">
          <div className="w-32 h-32 rounded-[40px] bg-gold flex items-center justify-center text-night text-5xl font-black shadow-2xl shadow-gold/20">
            JD
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-black text-white mb-2">Salam, <span className="text-gold">Jean-Daniel</span></h1>
            <p className="text-gray-500 font-medium uppercase tracking-widest text-[10px]">Étudiant de niveau 2 • Inscrit depuis Mai 2024</p>
            <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
               <div className="px-5 py-2 glass border-white/10 rounded-xl text-[10px] font-black text-white flex items-center gap-2">
                 <Trophy size={14} className="text-gold" /> 1,250 Points
               </div>
               <div className="px-5 py-2 glass border-white/10 rounded-xl text-[10px] font-black text-white flex items-center gap-2">
                 <Zap size={14} className="text-amber-400" /> 7 Jours de Streak
               </div>
            </div>
          </div>
          <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all">
            Modifier le profil
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Stats Column */}
          <div className="lg:col-span-2 space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="glass-card rounded-[48px] p-10 border-white/5">
                  <Clock size={32} className="text-blue-400 mb-6" />
                  <p className="text-4xl font-black text-white mb-1">12h 45m</p>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Temps d'apprentissage total</p>
               </div>
               <div className="glass-card rounded-[48px] p-10 border-white/5">
                  <GraduationCap size={32} className="text-emerald-400 mb-6" />
                  <p className="text-4xl font-black text-white mb-1">18/45</p>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Leçons complétées</p>
               </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card rounded-[60px] p-12 border-white/5">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-8">Activités Récentes</h3>
              <div className="space-y-6">
                {[
                  { title: "Alphabet : Alif à Jim", date: "Il y a 2 heures", type: "Cours", score: "100%" },
                  { title: "Quiz de Tajwid - Intro", date: "Hier", type: "Évaluation", score: "85%" },
                  { title: "Sourate Al-Fatiha", date: "Il y a 3 jours", type: "Mémorisation", score: "En cours" },
                ].map((act, idx) => (
                  <div key={idx} className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-gold/30 transition-all group">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <h4 className="font-black text-white uppercase tracking-tight text-sm">{act.title}</h4>
                        <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">{act.type} • {act.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{act.score}</span>
                       <ChevronRight size={18} className="text-gray-700 ml-2 inline" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Badges Column */}
          <aside className="space-y-12">
            <div className="glass-card rounded-[60px] p-12 border-white/5">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                <Medal size={24} className="text-gold" /> Badges
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {badges.map(badge => (
                  <div key={badge.id} className={`flex flex-col items-center gap-4 ${badge.earned ? 'opacity-100' : 'opacity-20 grayscale'}`}>
                    <div className={`w-20 h-20 rounded-[28px] bg-white/5 flex items-center justify-center ${badge.color} border border-white/5`}>
                      <badge.icon size={36} />
                    </div>
                    <p className="text-[9px] font-black text-center text-white uppercase tracking-widest leading-tight">{badge.name}</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 py-4 bg-white/5 text-white font-bold rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                Voir tout les badges
              </button>
            </div>

            {/* Next Goal */}
            <div className="glass-card rounded-[60px] p-12 border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent">
              <h4 className="text-gold text-[10px] font-black uppercase tracking-widest mb-4">Objectif actuel</h4>
              <p className="text-xl font-black text-white mb-6">Finir le niveau 1 : Alphabet</p>
              <div className="w-full h-3 bg-white/5 rounded-full mb-4">
                <div className="h-full bg-emerald-500 w-[75%] rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
              </div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Encore 3 leçons pour débloquer le certificat !</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
