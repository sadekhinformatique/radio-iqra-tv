import { Clock, Radio as RadioIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface GrilleItem {
  id: string;
  day: string;
  start_time: string;
  end_time: string;
  title: string;
  description: string;
}

const DAYS_ORDER = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export default function Radio() {
  const [grille, setGrille] = useState<GrilleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGrille() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('grille')
          .select('*')
          .order('start_time', { ascending: true });

        if (error) throw error;
        setGrille(data || []);
      } catch (err) {
        console.error("Error fetching grille:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGrille();
  }, []);

  // Group by day
  const groupedGrille = grille.reduce((acc, item) => {
    if (!acc[item.day]) {
      acc[item.day] = [];
    }
    acc[item.day].push(item);
    return acc;
  }, {} as Record<string, GrilleItem[]>);

  // Sort days according to DAYS_ORDER
  const sortedDays = Object.keys(groupedGrille).sort((a, b) => {
    return DAYS_ORDER.indexOf(a) - DAYS_ORDER.indexOf(b);
  });

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-12 h-12 border-4 border-iqra-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-20 px-4 md:px-8 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-iqra-green text-iqra-gold rounded-full mb-6 shadow-xl">
          <RadioIcon size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-iqra-green mb-4 uppercase tracking-tight">Grille des Programmes</h1>
        <p className="text-gray-500 uppercase tracking-widest text-xs font-bold bg-yellow-50 inline-block px-4 py-1 rounded-full border border-iqra-gold/20">Programme Hebdomadaire • RADIO IQRA TV</p>
      </div>

      <div className="space-y-12">
        {sortedDays.length > 0 ? sortedDays.map((day, groupIdx) => (
          <div key={groupIdx} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 transition-all hover:shadow-2xl">
            <div className="bg-iqra-green py-6 px-8 flex justify-between items-center">
              <h2 className="text-white font-serif font-bold text-xl uppercase tracking-wider">{day}</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-iqra-gold rounded-full animate-pulse"></span>
                <span className="text-iqra-gold-light text-xs font-bold uppercase tracking-tighter">Programmation officielle</span>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {groupedGrille[day].map((item, idx) => (
                <div key={idx} className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-6">
                    <div className="font-mono text-iqra-green bg-gray-100 px-4 py-2 rounded-xl text-sm font-bold border border-gray-200 shadow-sm group-hover:bg-iqra-gold group-hover:text-iqra-green group-hover:border-iqra-gold transition-all min-w-[120px] text-center">
                      {item.start_time} - {item.end_time}
                    </div>
                    <div>
                      <p className="text-iqra-green font-bold text-xl mb-1">{item.title}</p>
                      <p className="text-gray-400 text-sm flex items-center gap-2 uppercase tracking-wide font-medium">
                        <span className="text-iqra-gold">●</span> {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
             <p className="text-gray-400 font-medium">La grille des programmes n'est pas encore disponible dans la base de données.</p>
          </div>
        )}
      </div>

      <div className="mt-16 bg-[#fdfdfd] p-10 rounded-3xl border-2 border-dashed border-gray-200 text-center">
        <h3 className="font-serif font-bold text-2xl text-iqra-green mb-4">Note Importante</h3>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed italic">
          "Les horaires peuvent être sujets à des modifications durant les périodes de fêtes religieuses 
          ou lors d'événements spéciaux. Restez connectés pour les annonces en direct."
        </p>
      </div>
    </div>
  );
}
