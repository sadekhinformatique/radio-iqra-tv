import { motion } from 'motion/react';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { ArrowRight, History, Heart, Shield, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  const { config } = useSiteConfig();

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 lg:px-8 bg-night">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/20 border border-gold/20 text-gold text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <History size={14} /> Notre Histoire
            </div>

            <h1 className="text-5xl lg:text-7xl font-cairo font-black text-white mb-8 leading-tight tracking-tighter">
              {config.site_name}
              <span className="block text-gold italic">La Voix du Saint Coran</span>
            </h1>
          </div>

          <div className="glass-card rounded-[48px] p-10 lg:p-16 space-y-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
            
            <p className="text-2xl lg:text-3xl italic text-cream font-medium leading-relaxed text-center">
              "{config.site_name} – La Voix de saint Coran. Basée au cœur du Burkina Faso, elle est une station islamique dédiée à la diffusion des enseignements authentiques de l'Islam..."
            </p>

            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="grid md:grid-cols-2 gap-12">
               <div className="space-y-6">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Notre Mission</h3>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    Notre mission est de porter la parole d'Allah et les enseignements du Prophète (PSL) jusque dans chaque foyer, en utilisant les technologies modernes pour promouvoir une compréhension juste et apaisée de notre belle religion.
                  </p>
               </div>
               <div className="space-y-6">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Notre Vision</h3>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    Situé au Burkina Faso, pays de dialogue et de tolérance, RADIO IQRA TV s'engage à être un pont entre les cultures et un phare pour ceux qui cherchent la guidée spirituelle.
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
               {[
                 { icon: Heart, title: 'Paix', desc: 'Le vivre-ensemble et la concorde sociale.', color: 'text-emerald-400' },
                 { icon: Shield, title: 'Fraternité', desc: 'Renforcer les liens entre les communautés.', color: 'text-gold' },
                 { icon: GraduationCap, title: 'Éducation', desc: 'Transmettre le savoir avec bienveillance.', color: 'text-blue-400' },
               ].map((v, i) => (
                 <div key={i} className="glass p-8 rounded-[32px] border-white/5 hover:border-white/10 transition-all">
                    <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 ${v.color}`}>
                       <v.icon size={24} />
                    </div>
                    <h4 className="text-lg font-black text-white uppercase tracking-wider mb-2">{v.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                 </div>
               ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link to="/contact" className="inline-flex items-center gap-4 px-10 py-4 bg-gold text-night font-black uppercase tracking-widest text-xs rounded-full hover:scale-105 transition-all gold-glow">
              Rejoindre l'aventure <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

