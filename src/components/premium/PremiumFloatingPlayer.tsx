import { useState, useRef, useEffect } from 'react';
import { useSiteConfig } from '../../hooks/useSiteConfig';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Radio, X, Maximize2, Minimize2 } from 'lucide-react';

export default function PremiumFloatingPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMinimized, setIsMinimized] = useState(true);
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

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
        <button
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-2xl shadow-emerald-600/30 hover:bg-emerald-500 transition-all duration-300 hover:scale-105 active:scale-95 gold-glow-sm"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause size={22} fill="currentColor" />
          ) : (
            <Play size={22} fill="currentColor" className="ml-0.5" />
          )}
        </button>
        {isPlaying && (
          <div className="flex items-center gap-0.5 px-3 py-1.5 rounded-full bg-emerald-600/20 backdrop-blur-md border border-emerald-500/20">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-0.5 bg-emerald-400 rounded-full audio-bar"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
            <span className="text-[10px] text-emerald-400 font-semibold ml-1.5">LIVE</span>
          </div>
        )}
        <button
          onClick={() => setIsMinimized(false)}
          className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md text-gray-400 hover:text-white flex items-center justify-center transition-all duration-200 text-xs"
        >
          <Maximize2 size={12} />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-in">
      <div className="glass-card rounded-2xl p-4 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 flex items-center justify-center">
              <Radio size={16} className="text-emerald-400" />
            </div>
            <div>
              <h5 className="text-sm font-semibold text-white leading-tight">{config?.site_name || 'Radio'} en Direct</h5>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] text-gray-400">LIVE</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              <Minimize2 size={14} />
            </button>
            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.pause();
                  setIsPlaying(false);
                }
              }}
              className="p-1.5 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <SkipBack size={16} />
            </button>
            <button
              onClick={togglePlay}
              disabled={isLoading}
              className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-500 transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause size={18} fill="currentColor" />
              ) : (
                <Play size={18} fill="currentColor" className="ml-0.5" />
              )}
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <SkipForward size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setIsMuted(!isMuted)} className="p-1.5 text-gray-400 hover:text-white transition-colors">
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
