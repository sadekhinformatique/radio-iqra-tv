import { Clock, Radio as RadioIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

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
      <div className="min-h-screen pt-28 flex justify-center">
        <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-500/10 text-gold-400 mb-6">
            <RadioIcon size={32} />
          </div>
          <h1 className="text-4xl lg:text-5xl font-cairo font-bold text-white mb-4">Grille des Programmes</h1>
          <p className="text-gray-400 text-sm">Programme Hebdomadaire • RADIO IQRA TV</p>
        </div>

        <div className="space-y-6">
          {sortedDays.length > 0 ? sortedDays.map((day) => (
            <div key={day} className="glass-card rounded-2xl overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-emerald-600/20 to-emerald-800/10 border-b border-white/5 flex justify-between items-center">
                <h2 className="text-lg font-cairo font-bold text-white">{day}</h2>
                <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
              </div>
              <div className="divide-y divide-white/5">
                {groupedGrille[day].map((item, idx) => (
                  <div key={idx} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-5">
                      <div className="font-mono text-emerald-400 bg-emerald-600/10 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-500/20 min-w-[120px] text-center">
                        {item.start_time} - {item.end_time}
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg mb-0.5">{item.title}</p>
                        <p className="text-gray-500 text-xs flex items-center gap-2">
                          <span className="text-gold-400">●</span> {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )) : (
            <div className="glass-card rounded-2xl p-12 text-center">
              <p className="text-gray-500">La grille des programmes n'est pas encore disponible.</p>
            </div>
          )}
        </div>

        <div className="mt-10 glass rounded-2xl p-8 text-center">
          <h3 className="font-cairo font-bold text-xl text-gold-400 mb-3">Note Importante</h3>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed italic">
            "Les horaires peuvent être sujets à des modifications durant les périodes de fêtes religieuses ou lors d'événements spéciaux. Restez connectés pour les annonces en direct."
          </p>
        </div>
      </div>
    </div>
  );
}
