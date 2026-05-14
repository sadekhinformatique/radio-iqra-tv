import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw, Repeat, ChevronLeft, ChevronRight, Settings, Volume2 } from 'lucide-react';

export default function MemorizationView() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeatCount, setRepeatCount] = useState(3);
  const [currentRepeat, setCurrentRepeat] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentRepeat(0);
    if (audioRef.current) audioRef.current.currentTime = 0;
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-night text-white">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16">
          <p className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mb-4">Module Mémorisation</p>
          <h1 className="text-4xl font-black uppercase tracking-tight mb-4">Sourate Al-Fatiha</h1>
          <p className="text-gray-500 font-medium">Verset 1 : Bismillahir Rahmanir Rahim</p>
        </header>

        {/* Verset Display */}
        <div className="glass-card rounded-[60px] p-16 text-center border-white/5 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 text-8xl font-cairo">1</div>
          <p className="text-6xl md:text-8xl font-cairo font-bold mb-10 leading-relaxed text-gradient-gold">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="text-xl text-gray-400 font-medium italic">
            Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.
          </p>
        </div>

        {/* Memorization Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Repeat Settings */}
          <div className="glass p-8 rounded-[40px] border-white/5 flex flex-col justify-center gap-6">
            <div className="flex items-center justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
              <span>Répétitions</span>
              <span className="text-gold">{currentRepeat} / {repeatCount}</span>
            </div>
            <div className="flex justify-between items-center bg-white/5 rounded-2xl p-2">
              {[3, 5, 10, 20].map(count => (
                <button 
                  key={count}
                  onClick={() => setRepeatCount(count)}
                  className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${repeatCount === count ? 'bg-gold text-night' : 'text-gray-400 hover:text-white'}`}
                >
                  {count}x
                </button>
              ))}
            </div>
          </div>

          {/* Main Player */}
          <div className="glass-card rounded-[48px] p-8 border-gold/20 flex flex-col items-center justify-center gap-8 shadow-2xl shadow-gold/5">
            <div className="flex items-center gap-8">
              <button onClick={handleReset} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <RotateCcw size={20} />
              </button>
              <button 
                onClick={handlePlayPause}
                className="w-24 h-24 rounded-full bg-gold flex items-center justify-center text-night shadow-xl shadow-gold/20 hover:scale-110 transition-all"
              >
                {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
              </button>
              <button className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <Repeat size={20} />
              </button>
            </div>
            
            <div className="w-full space-y-2">
               <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                 <motion.div 
                    animate={{ width: isPlaying ? '100%' : '0%' }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="h-full bg-gold"
                 />
               </div>
               <div className="flex justify-between text-[10px] font-mono text-gray-600">
                 <span>0:00</span>
                 <span>0:05</span>
               </div>
            </div>
          </div>

          {/* Navigation & Audio Options */}
          <div className="glass p-8 rounded-[40px] border-white/5 flex flex-col justify-center gap-6">
             <div className="flex items-center justify-between">
                <button className="p-4 bg-white/5 rounded-2xl hover:text-gold transition-all"><ChevronLeft /></button>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Verset Suivant</span>
                <button className="p-4 bg-white/5 rounded-2xl hover:text-gold transition-all"><ChevronRight /></button>
             </div>
             <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
                <Volume2 size={18} className="text-gray-500" />
                <div className="flex-1 h-1 bg-white/10 rounded-full">
                  <div className="w-2/3 h-full bg-white/30 rounded-full" />
                </div>
             </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="p-10 glass-card rounded-[48px] border-white/5">
              <h4 className="text-gold text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2"><Settings size={14}/> Mode Apprentissage</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Le mode "Mémorisation Active" répète automatiquement chaque verset selon votre réglage. 
                Une pause de 3 secondes est insérée entre chaque répétition pour vous permettre de réciter.
              </p>
           </div>
           <div className="p-10 glass-card rounded-[48px] border-white/5 flex items-center justify-center text-center">
              <div>
                <p className="text-3xl font-black text-white mb-2">Hafiz Goal</p>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Vous avez mémorisé 15% de cette sourate</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
