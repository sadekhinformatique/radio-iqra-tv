import { LucideIcon, Search } from "lucide-react";
import { motion } from "motion/react";

interface EmptyListProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  category: string;
}

export default function EmptyListPage({ title, subtitle, icon: Icon, category }: EmptyListProps) {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gold-500/10 text-gold-400 rounded-2xl mb-6">
          <Icon size={40} />
        </div>
        <h1 className="text-4xl lg:text-5xl font-cairo font-bold text-white mb-4">{title}</h1>
        <p className="text-gray-400 max-w-xl mx-auto">{subtitle}</p>
      </div>

      <div className="mb-10 max-w-xl mx-auto flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder={"Rechercher un " + category.toLowerCase() + "..."}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>
        <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all text-xs uppercase tracking-wider">
          Filtrer
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-2xl py-24 flex flex-col items-center justify-center text-center px-6"
      >
        <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center mb-6">
          <Icon className="text-gray-600" size={32} />
        </div>
        <h3 className="text-xl font-cairo font-bold text-gray-500 mb-2">Aucun contenu disponible</h3>
        <p className="text-gray-600 text-sm italic">Revenez bientot pour decouvrir nos nouveautes.</p>
      </motion.div>
    </div>
  );
}
