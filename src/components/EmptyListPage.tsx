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
    <div className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-iqra-gold/10 text-iqra-gold rounded-3xl mb-6">
          <Icon size={40} />
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-iqra-green mb-4">{title}</h1>
        <p className="text-gray-500 max-w-xl mx-auto font-medium">{subtitle}</p>
      </div>

      {/* Search Placeholder */}
      <div className="mb-12 max-w-2xl mx-auto flex gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder={`Rechercher un ${category.toLowerCase()}...`}
            className="w-full pl-12 pr-4 py-4 rounded-full bg-gray-50 border border-gray-100 focus:bg-white focus:border-iqra-gold transition-all outline-none"
          />
        </div>
        <button className="px-8 py-4 bg-iqra-green text-white font-bold rounded-full uppercase tracking-widest text-xs shadow-lg hover:bg-iqra-green/90 transition-all">
          Filtrer
        </button>
      </div>

      {/* Empty State */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border-2 border-dashed border-gray-100 py-32 rounded-3xl flex flex-col items-center justify-center text-center px-6"
      >
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <Icon className="text-gray-200" size={32} />
        </div>
        <h3 className="text-xl font-serif font-bold text-gray-400 mb-2">Aucun contenu disponible pour le moment</h3>
        <p className="text-gray-400 text-sm italic">Revenez bientôt pour découvrir nos nouveautés.</p>
      </motion.div>
    </div>
  );
}
