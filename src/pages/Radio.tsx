import { Clock, Radio as RadioIcon, Calendar, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';

interface GrilleItem {
  id: string;
  day: string;
  start_time: string;
  end_time: string;
  title: string;
  description: string;
}

const DAYS_ORDER = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

export default function Radio() {
  const [grille, setGrille] = useState<GrilleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGrille() {
      if (!supabase) { setLoading(false); return; }
      try {
        const { data, error } = await supabase.from('grille').select('*').order('start_time', { ascending: true });
        if (error) throw error;
        setGrille(data || []);
      } catch (err) {
        console.error('Error fetching grille:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchGrille();
  }, []);

  const groupedGrille = grille.reduce((acc, item) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {} as Record<string, GrilleItem[]>);

  const sortedDays = Object.keys(groupedGrille).sort((a, b) => DAYS_ORDER.indexOf(a) - DAYS_ORDER.indexOf(b));

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-night">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gold font-black uppercase tracking-widest text-xs">Chargement de la grille...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 lg:px-8 bg-night">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-[32px] bg-primary/20 text-gold mb-8 gold-glow"
          >
            <RadioIcon size={48} />
          </motion.div>
          <h1 className="text-5xl lg:text-7xl font-cairo font-black text-white mb-6 tracking-tighter uppercase">
            Grille des <span className="text-gold italic">Programmes</span>
          </h1>
          <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">
            Retrouvez tous vos rendez-vous spirituels et éducatifs au quotidien sur Radio IQRA.
          </p>
        </div>

        <div className="space-y-12">
          {sortedDays.length > 0 ? sortedDays.map((day, dIdx) => (
            <motion.div 
              key={day} 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: dIdx * 0.1 }}
              className="glass-card rounded-[40px] overflow-hidden border-white/5 shadow-2xl"
            >
              <div className="px-10 py-6 bg-gradient-to-r from-primary/30 to-transparent border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-4">
                   <Calendar size={20} className="text-gold" />
                   <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{day}</h2>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">En direct</span>
                </div>
              </div>
              <div className="divide-y divide-white/5">
                {groupedGrille[day].map((item, idx) => (
                  <div key={idx} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:bg-white/5 transition-all group">
                    <div className="flex flex-col md:flex-row md:items-center gap-8 flex-1">
                      <div className="font-mono text-gold bg-primary/20 px-6 py-3 rounded-2xl text-base font-black border border-gold/10 min-w-[160px] text-center shadow-lg group-hover:scale-105 transition-all">
                        {item.start_time} — {item.end_time}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight group-hover:text-gold transition-colors">{item.title}</h3>
                        <p className="text-gray-400 text-sm flex items-start gap-3">
                          <Sparkles size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div className="hidden md:block">
                       <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-gray-600 group-hover:border-gold group-hover:text-gold transition-all">
                          <Clock size={20} />
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )) : (
            <div className="glass-card rounded-[40px] p-24 text-center border-dashed border-white/10">
              <RadioIcon size={64} className="text-gray-700 mx-auto mb-6" />
              <p className="text-xl text-gray-500 font-medium">La grille des programmes n'est pas encore disponible.</p>
            </div>
          )}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-16 glass rounded-[32px] p-10 text-center border border-white/10 relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/5 blur-[60px] rounded-full" />
          <h3 className="font-black text-2xl text-gold mb-6 uppercase tracking-tighter italic">Note Importante</h3>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed italic font-medium">
            "Les horaires peuvent être sujets à des modifications durant les périodes de fêtes religieuses ou lors d'événements spéciaux. Restez connectés pour les annonces en direct."
          </p>
        </motion.div>
      </div>
    </div>
  );
}

