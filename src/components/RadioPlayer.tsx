import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Radio as RadioIcon } from "lucide-react";
import { useSiteConfig } from "../hooks/useSiteConfig";

export default function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { config } = useSiteConfig();

  // Flux réel Radio Iqra TV
  const streamUrl = config.radio_stream_url || "https://a10.asurahosting.com:8170/radio.mp3"; 

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        // Force reload the source to fix "no supported source" errors
        audioRef.current.load(); 
        
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch(e => {
            console.error("Error playing stream:", e);
            setIsLoading(false);
          });
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-br from-iqra-green to-iqra-green-dark text-white py-3 px-4 md:px-8 border-t-2 border-iqra-gold z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Info Radio */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-iqra-gold rounded-full flex items-center justify-center flex-shrink-0 shadow-lg scale-90 md:scale-100">
            <RadioIcon className="text-iqra-green" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight uppercase tracking-widest text-[#D4AF37]">{config.site_name}</h3>
            <div className="flex items-center gap-2">
              {config.use_modern_ui ? (
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0"></span>
              ) : (
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
              <p className="text-[10px] text-gray-300 uppercase font-bold tracking-tighter">En Direct</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/10 rounded-2xl p-2 px-6 backdrop-blur-md flex items-center gap-6 shadow-inner border border-white/5">
          {config.use_modern_ui ? (
             <button 
               onClick={togglePlay}
               disabled={isLoading}
               className={`w-12 h-12 bg-iqra-green text-white rounded-full flex items-center justify-center shadow-lg shadow-iqra-green/20 hover:scale-105 active:scale-95 transition-all ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
               id="play-button"
             >
               {isLoading ? (
                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
               ) : isPlaying ? (
                 <Pause size={20} fill="currentColor" />
               ) : (
                 <Play size={20} fill="currentColor" className="ml-1" />
               )}
             </button>
          ) : (
            <button 
              onClick={togglePlay}
              disabled={isLoading}
              className={`w-10 h-10 rounded-full bg-iqra-gold text-iqra-green flex items-center justify-center hover:scale-110 transition-transform shadow-lg ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
              id="play-button"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-iqra-green border-t-transparent rounded-full animate-spin"></div>
              ) : isPlaying ? (
                <Pause size={20} fill="currentColor" />
              ) : (
                <Play size={20} fill="currentColor" className="ml-1" />
              )}
            </button>
          )}
          
          <div className="hidden md:flex items-center gap-3">
            {config.use_modern_ui ? (
              <button 
                onClick={toggleMute} 
                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-iqra-green transition-all"
              >
                {isMuted ? <VolumeX size={18} className="text-white" /> : <Volume2 size={18} className="text-white" />}
              </button>
            ) : (
              <button onClick={toggleMute} className="text-iqra-gold-light hover:text-white transition-colors">
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            )}
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume} 
              onChange={handleVolumeChange}
              className="w-24 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-iqra-gold"
            />
          </div>
        </div>

        {/* Status */}
        <div className="hidden lg:flex flex-col items-end">
          <span className="text-[10px] font-bold text-iqra-gold uppercase tracking-widest mb-1">Localisation</span>
          <span className="text-sm font-semibold text-white">{config.address}</span>
        </div>

        <audio 
          ref={audioRef} 
          crossOrigin="anonymous" 
          preload="none"
        >
          <source src={streamUrl} type="audio/mpeg" />
          Votre navigateur ne supporte pas l'élément audio.
        </audio>
      </div>
    </div>
  );
}
