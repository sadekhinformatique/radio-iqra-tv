import { useState, useEffect } from 'react';
import { Heart, ChevronRight } from 'lucide-react';

const DONATION_AMOUNTS = [5, 10, 25, 50, 100];

export default function DonationSection() {
  const [amount, setAmount] = useState(25);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const animate = setInterval(() => {
      setProgress(prev => {
        if (prev >= 72) {
          clearInterval(animate);
          return 72;
        }
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(animate);
  }, []);

  return (
    <section className="px-4 lg:px-8 max-w-5xl mx-auto mb-16">
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 lg:p-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Heart size={24} className="text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-cairo font-bold text-white">Soutenez Notre Cause</h3>
              <p className="text-sm text-gray-400">Aidez-nous à diffuser la parole d'Allah</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400">Collectés</span>
              <span className="text-white font-bold">
                <span className="text-gold-500">{progress}%</span> — 3,600 €
              </span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 transition-all duration-500 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Objectif : 5,000 €</p>
          </div>

          <div className="grid grid-cols-5 gap-2 mb-4">
            {DONATION_AMOUNTS.map((val) => (
              <button
                key={val}
                onClick={() => setAmount(val)}
                className={`py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                  amount === val
                    ? 'bg-gold-500 text-night-900 shadow-lg shadow-gold-500/20'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'
                }`}
              >
                {val}€
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Montant libre"
            />
            <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-emerald-600/20">
              Faire un Don
              <ChevronRight size={18} />
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Chaque contribution, grande ou petite, fait une différence. Qu'Allah vous récompense.
          </p>
        </div>
      </div>
    </section>
  );
}
