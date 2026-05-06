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
    <main
      className="max-w-7xl mx-auto w-full px-6 lg:px-20 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8"
      style={{ background: 'var(--site-bg, #0f172a)', color: 'var(--site-text, #f1f5f9)' }}
    >
      <div className="lg:col-span-8 flex flex-col gap-8">
        <div
          className="relative overflow-hidden rounded-xl border p-6 lg:p-8"
          style={{
            background: 'linear-gradient(135deg, var(--site-primary-10, rgba(46,125,50,0.1)), transparent)',
            borderColor: 'var(--site-primary-20, rgba(46,125,50,0.2))',
          }}
        >
            <div className="absolute top-0 right-0 p-4">
                <span className="inline-flex items-center gap-2 text-white text-[10px] font-black px-3 py-1 rounded-full animate-pulse uppercase tracking-wider" style={{ background: '#dc2626' }}>
                <span className="size-1.5 rounded-full bg-white"></span> Live
                </span>
            </div>
            <div className="flex flex-col items-center text-center">
                <div className="relative group">
                <div
                  className="absolute inset-0 rounded-xl blur-2xl group-hover:blur-3xl transition-all"
                  style={{ background: 'var(--site-primary-20, rgba(46,125,50,0.2))' }}
                ></div>
                <div
                  className="relative size-48 md:size-64 rounded-xl overflow-hidden shadow-2xl"
                  style={{ border: '4px solid var(--site-gold-20, rgba(201,162,39,0.2))' }}
                >
                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuABNKJbqsxhTlZoWYUvXFgoa7h58pTun4DqPHxnCqQxaQOH2ETmdxiwranHP9sjfJbPPVV2Q0LDHLIxfiBpk61AMEsZP8R6gKlGdMszPWVpxJOzInhVO1ob1vjei_yXQ_gm8rpP-5vxfuZmdEfnmvvBy0UQxzqdUAabaZHVMaEbKsC9gZLRAGmuIoA8lulbuhxurawbSp90ZE8s9eGxKpp3wCHPUgtmJx-gbXQUQzxEQd8U61-4yN0x5TWALN32RcuPe5nWHYmDfHo" alt="Radio" />
                </div>
                </div>
                <div className="mt-6 space-y-1">
                <h2 className="text-2xl font-black leading-tight" style={{ color: 'var(--site-text, #f1f5f9)' }}>{config?.site_name || "Iqra FM"}</h2>
                <p className="text-base font-medium" style={{ color: 'var(--site-primary, #2e7d32)' }}>La Voix de la Sagesse</p>
                </div>
                
                <div className="flex items-end justify-center gap-1.5 h-10 mt-6">
                    {Array.from({length: 5}).map((_, i) => (
                      <div
                        key={i}
                        className="frequency-bar w-1.5 rounded-full"
                        style={{
                          background: i % 2 === 0 ? 'var(--site-gold, #c9a227)' : 'var(--site-primary, #2e7d32)',
                        }}
                      />
                    ))}
                </div>
            
                <div className="flex items-center justify-center gap-6 mt-8">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="transition-colors"
                      style={{ color: 'var(--site-text-muted, #94a3b8)' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--site-primary, #2e7d32)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--site-text-muted, #94a3b8)'; }}
                    >
                        <span className="material-symbols-outlined text-2xl">{isMuted ? 'volume_off' : 'volume_mute'}</span>
                    </button>
                    <button
                      className="transition-colors"
                      style={{ color: 'var(--site-text, #f1f5f9)' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--site-primary, #2e7d32)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--site-text, #f1f5f9)'; }}
                    >
                        <span className="material-symbols-outlined text-3xl">skip_previous</span>
                    </button>
                    <button 
                      onClick={togglePlay}
                      disabled={isLoading}
                      className={`size-16 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 active:scale-95 transition-all ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
                      style={{
                        background: 'var(--site-primary, #2e7d32)',
                        boxShadow: '0 12px 30px -5px var(--site-primary-40, rgba(46,125,50,0.4))',
                      }}
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <span className="material-symbols-outlined text-4xl">{isPlaying ? 'pause' : 'play_arrow'}</span>
                        )}
                    </button>
                    <button
                      className="transition-colors"
                      style={{ color: 'var(--site-text, #f1f5f9)' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--site-primary, #2e7d32)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--site-text, #f1f5f9)'; }}
                    >
                        <span className="material-symbols-outlined text-3xl">skip_next</span>
                    </button>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="transition-colors"
                      style={{ color: 'var(--site-text-muted, #94a3b8)' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--site-primary, #2e7d32)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--site-text-muted, #94a3b8)'; }}
                    >
                        <span className="material-symbols-outlined text-2xl">{isMuted ? 'volume_off' : 'volume_up'}</span>
                    </button>
                </div>
            </div>
        </div>

        <div
          className="rounded-xl p-6 border flex items-center justify-center text-center"
          style={{
            background: 'var(--site-primary-5, rgba(46,125,50,0.05))',
            borderColor: 'var(--site-primary-10, rgba(46,125,50,0.1))',
          }}
        >
            <p className="text-sm font-medium" style={{ color: 'var(--site-text-secondary, #94a3b8)' }}>
                Écoutez 24/7 sur notre fréquence, ou bien en ligne où que vous soyez.
            </p>
        </div>
      </div>

      <div className="lg:col-span-4 flex flex-col gap-8">
        <div
          className="rounded-xl border p-6"
          style={{
            borderColor: 'var(--site-primary-20, rgba(46,125,50,0.2))',
            background: 'var(--site-card, #1e293b)',
          }}
        >
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ color: 'var(--site-gold, #c9a227)' }}>event_note</span>
                AUJOURD'HUI
            </h3>
            <div className="space-y-6">
                <div className="flex gap-4 relative">
                <div className="flex flex-col items-center">
                    <div
                      className="size-3 rounded-full z-10"
                      style={{
                        background: 'var(--site-gold, #c9a227)',
                        border: '4px solid var(--site-card, #1e293b)',
                      }}
                    ></div>
                    <div
                      className="w-0.5 h-full absolute top-3"
                      style={{ background: 'var(--site-primary-20, rgba(46,125,50,0.2))' }}
                    ></div>
                </div>
                <div className="flex-1 pb-4">
                    <p className="text-xs font-bold" style={{ color: 'var(--site-primary, #2e7d32)' }}>Dès maintenant</p>
                    <h4 className="font-bold text-sm">Émission en Direct</h4>
                    <p className="text-xs" style={{ color: 'var(--site-text-muted, #64748b)' }}>Sujet du jour</p>
                </div>
                </div>
                <div className="flex gap-4 relative">
                <div className="flex flex-col items-center">
                    <div
                      className="size-3 rounded-full z-10"
                      style={{ background: 'var(--site-primary-40, rgba(46,125,50,0.4))' }}
                    ></div>
                </div>
                <div className="flex-1">
                    <p className="text-xs font-bold" style={{ color: 'var(--site-primary, #2e7d32)' }}>Plus tard</p>
                    <h4 className="font-bold text-sm">Prêche / Rappels</h4>
                    <p className="text-xs" style={{ color: 'var(--site-text-muted, #64748b)' }}>Différents conférenciers</p>
                </div>
                </div>
            </div>
            <button
              className="w-full mt-6 py-3 border rounded-lg text-xs font-bold transition-colors uppercase tracking-widest"
              style={{
                borderColor: 'var(--site-primary-30, rgba(46,125,50,0.3))',
                color: 'var(--site-text, #f1f5f9)',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--site-primary-10, rgba(46,125,50,0.1))'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
                Programme Complet
            </button>
        </div>
      </div>
    </main>
  );
}
