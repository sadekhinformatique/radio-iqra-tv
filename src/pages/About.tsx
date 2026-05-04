import { motion } from "motion/react";
import { useSiteConfig } from "../hooks/useSiteConfig";

export default function About() {
  const { config } = useSiteConfig();

  return (
    <div className="py-12 px-4 md:px-8 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-iqra-gold font-bold uppercase tracking-[0.3em] text-xs mb-3">Notre Histoire</h1>
        <h2 className="text-2xl md:text-4xl font-serif font-bold text-iqra-green mb-8">{config.site_name} — La Voix du Saint Coran</h2>
        
        <div className="prose prose-lg text-gray-700 font-serif leading-loose space-y-8">
          <p className="text-xl italic text-iqra-green">
            "{config.site_name} – La Voix de saint Coran Basée au cœur du Burkina Faso, {config.site_name} est une station islamique dédiée à la diffusion des enseignements authentiques de l'Islam, dans un esprit de paix, de fraternité et d'éducation spirituelle..."
          </p>
          
          <p>
            Notre mission est de porter la parole d'Allah et les enseignements du Prophète (PSL) 
            jusque dans chaque foyer, en utilisant les technologies modernes pour promouvoir 
            une compréhension juste et apaisée de notre belle religion.
          </p>

          <div className="bg-gray-50 p-8 rounded-2xl border-l-4 border-iqra-gold">
            <h3 className="font-sans font-bold text-iqra-green uppercase tracking-wider text-sm mb-4">Nos Valeurs</h3>
            <ul className="list-none space-y-4 font-sans text-base">
              <li className="flex gap-3">
                <span className="text-iqra-gold font-bold">01.</span>
                <span><strong>Paix :</strong> Œuvrer pour la concorde sociale et le vivre-ensemble.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-iqra-gold font-bold">02.</span>
                <span><strong>Fraternité :</strong> Renforcer les liens entre les croyants et toutes les communautés.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-iqra-gold font-bold">03.</span>
                <span><strong>Éducation :</strong> Transmettre le savoir religieux avec rigueur et bienveillance.</span>
              </li>
            </ul>
          </div>

          <p>
            Situé au Burkina Faso, pays de dialogue et de tolérance, RADIO IQRA TV s'engage 
            à être un pont entre les cultures et un phare pour ceux qui cherchent la guidée spirituelle.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
