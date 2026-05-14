import React, { useState, useRef, useEffect } from 'react';
import { useSiteConfig } from '../../hooks/useSiteConfig';

export default function ModernFloatingPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(1);
  const { config } = useSiteConfig();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(config?.radio_stream_url || "https://play.iqra.fr/iqramac-64.mp3");
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
          console.error("Playback failed", e);
          setIsLoading(false);
          setIsPlaying(false);
        });
      }
    }
  };

  // In a real app we would use an audio ref, but here it's visual as per instructions
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-50 transition-transform duration-300 pointer-events-auto">
      <div className="bg-slate-900 text-white rounded-full p-2 pl-4 pr-6 flex items-center gap-4 shadow-2xl border border-white/10">
        <div className="size-10 rounded-full overflow-hidden bg-modern-primary shrink-0 relative">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmsTXiqifGRqC2PaZLqLvaPmDqs44H58kyTzvI38uyOrJ8QQlGqwVQ0XkJV4O3ctP1Vu8nHXAGUyXhmHjhptNO-8w6oKrKC_64hKKdwfsZ7q0Z1WepjI9CBmXwQbRkyNK1J3ndRd6M9-9MRbG9wbooJMURAb1wT-vFZNX_FIXjhGUs9gUY1STdA-UUQ_d9zI8cv9JMWCSC3A-CkNzXq3DUgFeUHR-c76AI5pSydC_by899XGGVih7-AYKGIXRT1Qro_y341-cf19M" alt="Quran" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="text-xs font-bold truncate">{config?.site_name || "Radio"} en Direct</h5>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
            <p className="text-[10px] text-modern-gold truncate">La Voix du Saint Coran</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="material-symbols-outlined text-xl">skip_previous</button>
          <button 
            onClick={togglePlay}
            disabled={isLoading}
            className={`w-10 h-10 bg-white text-slate-900 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
          >
            {isLoading ? (
               <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            ) : (
               <span className="material-symbols-outlined">{isPlaying ? 'pause' : 'play_arrow'}</span>
            )}
          </button>
          <button className="material-symbols-outlined text-xl">skip_next</button>
          
          <div className="hidden sm:flex items-center gap-2 ml-2">
            <button onClick={() => setIsMuted(!isMuted)}>
              <span className="material-symbols-outlined text-slate-400 text-lg hover:text-white">
                {isMuted ? 'volume_off' : 'volume_up'}
              </span>
            </button>
            <input 
              type="range" 
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 h-1 bg-white/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-modern-gold [&::-webkit-slider-thumb]:rounded-full cursor-pointer accent-modern-gold" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
