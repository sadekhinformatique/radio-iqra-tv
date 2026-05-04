import React, { useState, useRef, useEffect } from 'react';
import { useSiteConfig } from '../../hooks/useSiteConfig';

export default function ModernListenLive() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { config } = useSiteConfig();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(config?.radio_stream_url || "https://play.iqra.fr/iqramac-64.mp3");
    }
    
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
        // Important: Stop audio when leaving the page to avoid conflict with floating player
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [config?.radio_stream_url]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

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

  return (
    <main className="max-w-7xl mx-auto w-full px-6 lg:px-20 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Audio Player & Apps */}
      <div className="lg:col-span-8 flex flex-col gap-8">
        {/* Main Player Card */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-modern-primary/10 to-transparent border border-modern-primary/20 p-6 lg:p-8">
            <div className="absolute top-0 right-0 p-4">
                <span className="inline-flex items-center gap-2 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full animate-pulse uppercase tracking-wider">
                <span className="size-1.5 rounded-full bg-white"></span> Live
                </span>
            </div>
            <div className="flex flex-col items-center text-center">
                <div className="relative group">
                <div className="absolute inset-0 bg-modern-primary/20 rounded-xl blur-2xl group-hover:blur-3xl transition-all"></div>
                <div className="relative size-48 md:size-64 rounded-xl overflow-hidden shadow-2xl border-4 border-modern-gold/20">
                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuABNKJbqsxhTlZoWYUvXFgoa7h58pTun4DqPHxnCqQxaQOH2ETmdxiwranHP9sjfJbPPVV2Q0LDHLIxfiBpk61AMEsZP8R6gKlGdMszPWVpxJOzInhVO1ob1vjei_yXQ_gm8rpP-5vxfuZmdEfnmvvBy0UQxzqdUAabaZHVMaEbKsC9gZLRAGmuIoA8lulbuhxurawbSp90ZE8s9eGxKpp3wCHPUgtmJx-gbXQUQzxEQd8U61-4yN0x5TWALN32RcuPe5nWHYmDfHo" alt="Radio" />
                </div>
                </div>
                <div className="mt-6 space-y-1">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{config?.site_name || "Iqra FM"}</h2>
                <p className="text-base text-modern-primary dark:text-modern-gold font-medium">La Voix de la Sagesse</p>
                </div>
                
                {/* Simple Frequency Visualizer */}
                <div className="flex items-end justify-center gap-1.5 h-10 mt-6">
                    {Array.from({length: 5}).map((_, i) => (
                      <div key={i} className={`frequency-bar w-1.5 rounded-full ${i % 2 === 0 ? 'bg-modern-gold' : 'bg-modern-primary'}`} />
                    ))}
                </div>
            
                {/* Controls */}
                <div className="flex items-center justify-center gap-6 mt-8">
                    <button onClick={() => setIsMuted(!isMuted)} className="text-slate-400 hover:text-modern-primary transition-colors">
                        <span className="material-symbols-outlined text-2xl">{isMuted ? 'volume_off' : 'volume_mute'}</span>
                    </button>
                    <button className="text-slate-900 dark:text-white hover:text-modern-primary transition-colors">
                        <span className="material-symbols-outlined text-3xl">skip_previous</span>
                    </button>
                    <button 
                      onClick={togglePlay}
                      disabled={isLoading}
                      className={`size-16 bg-modern-primary rounded-full flex items-center justify-center text-white shadow-xl shadow-modern-primary/40 hover:scale-105 active:scale-95 transition-all ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <span className="material-symbols-outlined text-4xl">{isPlaying ? 'pause' : 'play_arrow'}</span>
                        )}
                    </button>
                    <button className="text-slate-900 dark:text-white hover:text-modern-primary transition-colors">
                        <span className="material-symbols-outlined text-3xl">skip_next</span>
                    </button>
                    <button onClick={() => setIsMuted(!isMuted)} className="text-slate-400 hover:text-modern-primary transition-colors">
                        <span className="material-symbols-outlined text-2xl">{isMuted ? 'volume_off' : 'volume_up'}</span>
                    </button>
                </div>
            </div>
        </div>

        {/* Information Callout */}
        <div className="bg-modern-primary/5 rounded-xl p-6 border border-modern-primary/10 flex items-center justify-center text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                Écoutez 24/7 sur notre fréquence, ou bien en ligne où que vous soyez.
            </p>
        </div>
      </div>

      {/* Right Column: Chat & Schedule */}
      <div className="lg:col-span-4 flex flex-col gap-8">
        <div className="rounded-xl border border-modern-primary/20 p-6 bg-modern-bg-light dark:bg-slate-900/30">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-modern-gold">event_note</span>
                AUJOURD'HUI
            </h3>
            <div className="space-y-6">
                <div className="flex gap-4 relative">
                <div className="flex flex-col items-center">
                    <div className="size-3 rounded-full bg-modern-gold border-4 border-modern-bg-light dark:border-modern-bg-dark z-10"></div>
                    <div className="w-0.5 h-full bg-modern-primary/20 absolute top-3"></div>
                </div>
                <div className="flex-1 pb-4">
                    <p className="text-xs font-bold text-modern-primary">Dès maintenant</p>
                    <h4 className="font-bold text-sm">Émission en Direct</h4>
                    <p className="text-xs text-slate-500">Sujet du jour</p>
                </div>
                </div>
                <div className="flex gap-4 relative">
                <div className="flex flex-col items-center">
                    <div className="size-3 rounded-full bg-modern-primary/40 z-10"></div>
                </div>
                <div className="flex-1">
                    <p className="text-xs font-bold text-modern-primary">Plus tard</p>
                    <h4 className="font-bold text-sm">Prêche / Rappels</h4>
                    <p className="text-xs text-slate-500">Différents conférenciers</p>
                </div>
                </div>
            </div>
            <button className="w-full mt-6 py-3 border border-modern-primary/30 rounded-lg text-xs font-bold hover:bg-modern-primary/10 transition-colors uppercase tracking-widest">
                Programme Complet
            </button>
        </div>
      </div>
    </main>
  );
}
