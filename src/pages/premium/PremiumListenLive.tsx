import { useState, useRef, useEffect } from 'react';
import { useSiteConfig } from '../../hooks/useSiteConfig';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Radio, Headphones, Share2 } from 'lucide-react';

export default function PremiumListenLive() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [listeners, setListeners] = useState(1284);
  const { config } = useSiteConfig();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(config?.radio_stream_url || 'https://play.iqra.fr/iqramac-64.mp3');
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
        audioRef.current.src = '';
      }
    };
  }, [config?.radio_stream_url]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const interval = setInterval(() => {
      setListeners(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

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
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="glass-card rounded-2xl p-6 lg:p-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center">
                    <Radio size={24} className="text-gold-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-cairo font-bold text-white">{config.site_name}</h1>
                    <p className="text-sm text-gray-400">La voix de la sagesse</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Live</span>
                </div>
              </div>

              <div className="flex flex-col items-center py-8">
                <div className="relative mb-8">
                  <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-full bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border-2 border-emerald-500/20 flex items-center justify-center">
                    <div className="w-40 h-40 lg:w-48 lg:h-48 rounded-full bg-gradient-to-br from-emerald-600/10 to-emerald-800/10 flex items-center justify-center">
                      <Radio size={64} className="text-gold-400/60" />
                    </div>
                  </div>
                  {isPlaying && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-1 h-8">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-emerald-400 rounded-full audio-bar"
                          style={{
                            height: `${Math.random() * 16 + 4}px`,
                            animationDelay: `${i * 0.12}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-6 mb-8">
                  <button className="p-3 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
                    <SkipBack size={24} />
                  </button>
                  <button
                    onClick={togglePlay}
                    disabled={isLoading}
                    className="w-20 h-20 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-2xl shadow-emerald-600/30 hover:bg-emerald-500 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    ) : isPlaying ? (
                      <Pause size={32} fill="currentColor" />
                    ) : (
                      <Play size={32} fill="currentColor" className="ml-1" />
                    )}
                  </button>
                  <button className="p-3 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
                    <SkipForward size={24} />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-32 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-cairo font-bold text-white mb-4 flex items-center gap-2">
                <Headphones size={16} className="text-gold-400" />
                Auditeurs en Direct
              </h3>
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold text-white">{listeners.toLocaleString()}</div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-4 bg-emerald-400 rounded-full audio-bar"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-cairo font-bold text-white mb-4">Programme en cours</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-gold-500 border-2 border-gold-500/30" />
                    <div className="w-0.5 flex-1 bg-white/5 mt-1" />
                  </div>
                  <div>
                    <p className="text-xs text-gold-400 font-semibold">Maintenant</p>
                    <h4 className="text-sm font-semibold text-white">Émission du Matin</h4>
                    <p className="text-xs text-gray-500">Rappel islamique quotidien</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">12:00</p>
                    <h4 className="text-sm font-semibold text-white">Prêche du Vendredi</h4>
                    <p className="text-xs text-gray-500">Conférence</p>
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 py-2.5 rounded-xl border border-white/10 text-sm text-gray-400 hover:text-white hover:border-white/20 transition-all">
                Voir le programme complet
              </button>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-cairo font-bold text-white mb-4">Partager</h3>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500/10 text-gold-400 text-sm font-medium hover:bg-gold-500/20 transition-all">
                <Share2 size={16} />
                Partager le direct
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
