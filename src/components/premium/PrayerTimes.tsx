import { useState, useEffect } from 'react';
import { Clock, Sun, Sunrise, Sunset, Moon, MapPin } from 'lucide-react';

interface PrayerTime {
  name: string;
  time: string;
  icon: typeof Sun;
  arabicName: string;
}

const PRAYERS: PrayerTime[] = [
  { name: 'Fajr', time: '05:12', icon: Sunrise, arabicName: 'الفجر' },
  { name: 'Dhuhr', time: '12:30', icon: Sun, arabicName: 'الظهر' },
  { name: 'Asr', time: '15:45', icon: Sun, arabicName: 'العصر' },
  { name: 'Maghrib', time: '18:15', icon: Sunset, arabicName: 'المغرب' },
  { name: 'Isha', time: '19:45', icon: Moon, arabicName: 'العشاء' },
];

function getCurrentPrayerIndex(): number {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (let i = PRAYERS.length - 1; i >= 0; i--) {
    const [h, m] = PRAYERS[i].time.split(':').map(Number);
    const prayerMinutes = h * 60 + m;
    if (currentMinutes >= prayerMinutes) return i;
  }
  return PRAYERS.length - 1;
}

export default function PrayerTimes() {
  const [currentIndex, setCurrentIndex] = useState(getCurrentPrayerIndex());
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const update = () => {
      setCurrentIndex(getCurrentPrayerIndex());
      setCurrentTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  const nextPrayer = PRAYERS[currentIndex < PRAYERS.length - 1 ? currentIndex + 1 : 0];
  const currentPrayer = PRAYERS[currentIndex];

  return (
    <section className="px-4 lg:px-8 max-w-7xl mx-auto mb-16">
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-gold-500" />
              <h3 className="text-lg font-cairo font-bold text-white">Horaires de Prière</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin size={14} />
              <span>Ouagadougou</span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 mb-6">
            {PRAYERS.map((prayer, idx) => {
              const isCurrent = idx === currentIndex;
              const isNext = idx === currentIndex + 1 || (currentIndex === PRAYERS.length - 1 && idx === 0);
              const isPast = idx < currentIndex;

              return (
                <div
                  key={prayer.name}
                  className={`relative rounded-xl p-3 text-center transition-all duration-300 ${
                    isCurrent
                      ? 'bg-emerald-600/20 border border-emerald-500/30 gold-glow-sm'
                      : isNext
                        ? 'bg-gold-500/10 border border-gold-500/20'
                        : isPast
                          ? 'bg-white/5 border border-white/5 opacity-50'
                          : 'bg-white/5 border border-white/5'
                  }`}
                >
                  <prayer.icon
                    size={16}
                    className={`mx-auto mb-1 ${
                      isCurrent ? 'text-emerald-400' : isNext ? 'text-gold-400' : 'text-gray-500'
                    }`}
                  />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {prayer.name}
                  </p>
                  <p className={`text-xs font-cairo font-bold mt-0.5 ${
                    isCurrent ? 'text-emerald-400' : isNext ? 'text-gold-400' : 'text-gray-300'
                  }`}>
                    {prayer.time}
                  </p>
                  {isCurrent && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="glass rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                <Clock size={18} className="text-gold-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Prochaine prière</p>
                <p className="text-sm font-cairo font-bold text-white">
                  {nextPrayer.name} — <span className="text-gold-400">{nextPrayer.time}</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">{currentTime}</p>
              <p className="text-[10px] text-gray-500">{currentPrayer.name} en cours</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
