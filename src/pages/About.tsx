import { motion } from 'motion/react';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  const { config } = useSiteConfig();

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-semibold mb-6">
            Notre Histoire
          </div>

          <h1 className="text-4xl lg:text-6xl font-cairo font-black text-white mb-6 leading-tight">
            {config.site_name}
            <span className="block text-gradient-gold">La Voix du Saint Coran</span>
          </h1>

          <div className="glass-card rounded-2xl p-8 lg:p-10 space-y-8">
            <p className="text-xl italic text-gray-300 font-medium leading-relaxed">
              "{config.site_name} – La Voix de saint Coran. Basée au cœur du Burkina Faso, {config.site_name} est une station islamique dédiée à la diffusion des enseignements authentiques de l'Islam, dans un esprit de paix, de fraternité et d'éducation spirituelle..."
            </p>

            <p className="text-gray-400 leading-relaxed">
              Notre mission est de porter la parole d'Allah et les enseignements du Prophète (PSL) jusque dans chaque foyer, en utilisant les technologies modernes pour promouvoir une compréhension juste et apaisée de notre belle religion.
            </p>

            <div className="glass rounded-xl p-6 border-l-4 border-gold-500">
              <h3 className="font-cairo font-bold text-gold-400 text-sm mb-4 uppercase tracking-wider">Nos Valeurs</h3>
              <ul className="space-y-4">
                {[
                  { num: '01', title: 'Paix', desc: 'Œuvrer pour la concorde sociale et le vivre-ensemble.' },
                  { num: '02', title: 'Fraternité', desc: 'Renforcer les liens entre les croyants et toutes les communautés.' },
                  { num: '03', title: 'Éducation', desc: 'Transmettre le savoir religieux avec rigueur et bienveillance.' },
                ].map((v) => (
                  <li key={v.num} className="flex gap-3">
                    <span className="text-gold-500 font-bold text-sm">{v.num}.</span>
                    <span className="text-gray-300"><strong className="text-white">{v.title} :</strong> {v.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-gray-400 leading-relaxed">
              Situé au Burkina Faso, pays de dialogue et de tolérance, RADIO IQRA TV s'engage à être un pont entre les cultures et un phare pour ceux qui cherchent la guidée spirituelle.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500/10 border border-gold-500/20 text-gold-400 font-semibold rounded-full text-sm hover:bg-gold-500/20 transition-all">
              Nous contacter <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
