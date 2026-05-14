import { useState, useRef, useEffect } from 'react';
import { useSiteConfig } from '../../hooks/useSiteConfig';
import { Play, Pause, Volume2, VolumeX, Radio, X, Maximize2, Minimize2, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PremiumFloatingPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isExpanded, setIsExpanded] = useState(false);
  const { config } = useSiteConfig();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(config?.radio_stream_url || 'https://play.iqra.fr/iqramac-64.mp3');
    }
    audioRef.current.volume = volume;
    audioRef.current.muted = isMuted;

    const handleCanPlay = () => setIsLoading(false);
    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => { setIsLoading(false); setIsPlaying(true); };
    const handlePause = () => setIsPlaying(false);

    audioRef.current.addEventListener('canplay', handleCanPlay);
    audioRef.current.addEventListener('waiting', handleWaiting);
    audioRef.current.addEventListener('playing', handlePlaying);
    audioRef.current.addEventListener('pause', handlePause);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('canplay', handleCanPlay);
        audioRef.current.removeEventListener('waiting', handleWaiting);
        audioRef.current.removeEventListener('playing', handlePlaying);
        audioRef.current.removeEventListener('pause', handlePause);
      }
    };
  }, [config?.radio_stream_url]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        setIsLoading(true);
        audioRef.current.play().catch(e => {
          console.error('Playback failed', e);
          setIsLoading(false);
          setIsPlaying(false);
        });
      }
    }
  };

  return (
    <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-8 z-[100] pointer-events-none">
      <motion.div 
        layout
        className="pointer-events-auto glass-card rounded-[32px] overflow-hidden gold-glow md:w-[400px] ml-auto"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="p-4 flex items-center gap-4">
          {/* Cover/Icon */}
          <div className="relative group flex-shrink-0">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isPlaying ? 'bg-primary gold-glow' : 'bg-white/5'}`}>
              <Radio size={24} className={isPlaying ? 'text-gold' : 'text-gray-500'} />
            </div>
            {isPlaying && (
              <div className="absolute -bottom-1 -right-1 flex items-center gap-0.5 px-2 py-1 bg-red-500 rounded-full border-2 border-night">
                <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                <span className="text-[8px] font-black text-white">LIVE</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-black text-white truncate uppercase tracking-tight">Radio IQRA en Direct</h4>
            <div className="flex items-center gap-2 mt-1">
              {isPlaying ? (
                <div className="flex items-center gap-0.5 h-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-0.5 bg-emerald-400 rounded-full audio-flow" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Prêt à diffuser</p>
              )}
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              disabled={isLoading}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isPlaying ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gold text-night hover:scale-105'}`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause size={20} fill="currentColor" />
              ) : (
                <Play size={20} fill="currentColor" className="ml-0.5" />
              )}
            </button>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </button>
          </div>
        </div>

        {/* Expanded Controls */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-6 pb-6 overflow-hidden border-t border-white/5 pt-4"
            >
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-3 flex-1">
                  <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-white">
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <div className="relative flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 bg-gold rounded-full transition-all" 
                      style={{ width: `${volume * 100}%` }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 font-bold w-8">{Math.round(volume * 100)}%</span>
                </div>
                
                <button 
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.pause();
                      setIsPlaying(false);
                      setIsExpanded(false);
                    }
                  }}
                  className="p-2 text-gray-500 hover:text-red-400"
                >
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

