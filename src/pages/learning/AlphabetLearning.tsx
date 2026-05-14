import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { arabicAlphabet, ArabicLetter } from '../../data/alphabet';
import { Volume2, ChevronLeft, Info, Trophy, Play, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AlphabetLearning() {
  const [selectedLetter, setSelectedLetter] = useState<ArabicLetter | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = (url: string) => {
    setIsPlaying(true);
    const audio = new Audio(url);
    audio.play().catch(e => console.warn("Audio play failed (placeholder url)"));
    audio.onended = () => setIsPlaying(false);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 lg:px-8 bg-night">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div>
            <Link to="/apprentissage" className="text-gold text-xs font-black uppercase tracking-widest flex items-center gap-2 mb-4 hover:underline">
              <ChevronLeft size={16} /> Retour au parcours
            </Link>
            <h1 className="text-4xl lg:text-6xl font-cairo font-black text-white">L'Alphabet <span className="text-gold italic">Arabe</span></h1>
            <p className="text-gray-500 font-medium mt-2">Cliquez sur une lettre pour écouter sa prononciation et voir ses détails.</p>
          </div>
          
          <div className="glass p-6 rounded-[32px] border-white/5 flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Maîtrise</p>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[20%]" />
                </div>
                <span className="text-xs font-black text-white">0/28</span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Alphabet Grid */}
          <div className="lg:col-span-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4">
            {arabicAlphabet.map((letter) => (
              <motion.button
                key={letter.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedLetter(letter);
                  playAudio(letter.audio_url);
                }}
                className={`aspect-square flex flex-col items-center justify-center rounded-[32px] transition-all border-2 ${
                  selectedLetter?.id === letter.id 
                  ? 'bg-gold/20 border-gold shadow-lg shadow-gold/20' 
                  : 'bg-white/5 border-white/5 hover:border-white/10'
                }`}
              >
                <span className="text-4xl font-cairo font-black text-white mb-2">{letter.char}</span>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{letter.name}</span>
              </motion.button>
            ))}
          </div>

          {/* Letter Detail Card */}
          <aside className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {selectedLetter ? (
                <motion.div 
                  key={selectedLetter.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-card rounded-[48px] p-10 border-white/5 sticky top-32"
                >
                  <div className="text-center mb-10">
                    <div className="w-32 h-32 bg-primary/20 rounded-[40px] mx-auto flex items-center justify-center mb-6 gold-glow border border-gold/20">
                      <span className="text-7xl font-cairo font-black text-white">{selectedLetter.char}</span>
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">{selectedLetter.name}</h2>
                    <p className="text-gold font-bold uppercase tracking-widest text-xs mt-2">Transcription : {selectedLetter.transliteration}</p>
                  </div>

                  <div className="space-y-6">
                    <button 
                      onClick={() => playAudio(selectedLetter.audio_url)}
                      className={`w-full py-5 rounded-2xl flex items-center justify-center gap-4 font-black uppercase tracking-widest text-xs transition-all ${
                        isPlaying ? 'bg-emerald-500 text-night' : 'bg-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      <Volume2 size={20} className={isPlaying ? 'animate-pulse' : ''} /> 
                      {isPlaying ? 'Écoute en cours...' : 'Écouter la prononciation'}
                    </button>

                    <div className="p-6 bg-white/5 rounded-[32px] space-y-4">
                      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Info size={14} /> Astuce
                      </h4>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        La lettre <span className="text-gold font-bold">{selectedLetter.name}</span> se prononce avec {selectedLetter.id % 2 === 0 ? 'le bout de la langue' : 'le fond de la gorge'}. 
                        Essayez de répéter après l'audio pour perfectionner votre tajwid.
                      </p>
                    </div>

                    <button className="w-full py-5 bg-gold/10 text-gold border border-gold/20 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-gold/20 transition-all">
                      <CheckCircle2 size={16} /> Marquer comme appris
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 glass-card rounded-[48px] border-dashed border-white/10 opacity-50">
                  <Play size={48} className="text-gold mb-6 animate-pulse" />
                  <p className="text-gray-400 font-medium">Sélectionnez une lettre pour commencer l'aventure.</p>
                </div>
              )}
            </AnimatePresence>
          </aside>
        </div>
      </div>
    </div>
  );
}
