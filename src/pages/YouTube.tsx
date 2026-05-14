import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Youtube, Users, Calendar, Play, ExternalLink, Loader2, AlertCircle, Tv, Sparkles } from "lucide-react";
import { useSiteConfig } from "../hooks/useSiteConfig";

interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnails: { medium: { url: string }; high: { url: string } };
  brandingSettings?: { image?: { bannerExternalUrl: string } };
  statistics: { viewCount: string; subscriberCount: string; videoCount: string };
}

interface YouTubeVideo {
  id: { videoId: string } | string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: { high: { url: string }; maxres?: { url: string } };
  };
}

export default function YouTube() {
  const { config } = useSiteConfig();
  const [channel, setChannel] = useState<YouTubeChannel | null>(null);
  const [liveVideo, setLiveVideo] = useState<YouTubeVideo | null>(null);
  const [latestVideos, setLatestVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const extractChannelId = (url: string) => {
    if (!url) return null;
    const match = url.match(/\/channel\/([a-zA-Z0-9_-]+)/);
    if (match) return match[1];
    if (url.startsWith("UC") && url.length > 20) return url;
    return null;
  };

  const formatSubscribers = (count: string) => {
    const n = parseInt(count);
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "k";
    return count;
  };

  useEffect(() => {
    const channelId = extractChannelId(config.youtube_url);
    const apiKey = config.youtube_api_key;
    if (!channelId || !apiKey) {
      setLoading(false);
      if (!apiKey && channelId) setError("Clé API YouTube manquante.");
      return;
    }
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const chanRes = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=" + channelId + "&key=" + apiKey);
        const chanData = await chanRes.json();
        if (chanData.error) throw new Error(chanData.error.message);
        if (chanData.items?.[0]) setChannel(chanData.items[0]);

        const liveRes = await fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + channelId + "&type=video&eventType=live&key=" + apiKey);
        const liveData = await liveRes.json();
        const live = liveData.items?.[0] ?? null;
        if (live) setLiveVideo(live);

        const videosRes = await fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + channelId + "&type=video&order=date&maxResults=10&key=" + apiKey);
        const videosData = await videosRes.json();
        if (videosData.items) {
          const liveId = live ? (typeof live.id === "string" ? live.id : live.id?.videoId) : null;
          setLatestVideos(videosData.items.filter((v: any) => v.id?.videoId !== liveId));
        }
      } catch (err: any) {
        console.error("YouTube API error:", err);
        setError("Impossible de charger les données YouTube.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [config.youtube_url, config.youtube_api_key]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-night">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gold font-black uppercase tracking-widest text-xs">Connexion à YouTube...</p>
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto bg-night">
        <AlertCircle size={64} className="text-red-500 mb-6" />
        <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Configuration YouTube</h2>
        <p className="text-gray-400 mb-8 text-lg">{error || "Veuillez configurer l'URL de votre chaine YouTube dans le panneau d'administration."}</p>
        <a href="/" className="px-10 py-4 bg-primary text-gold font-black uppercase tracking-widest text-xs rounded-full gold-glow">Retour</a>
      </div>
    );
  }

  const heroVideo = liveVideo || latestVideos[0];
  const gridVideos = liveVideo ? latestVideos.slice(0, 6) : latestVideos.slice(1, 7);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-night">
      {/* Channel Header */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        {channel.brandingSettings?.image?.bannerExternalUrl ? (
          <img src={channel.brandingSettings.image.bannerExternalUrl} alt="" className="w-full h-full object-cover opacity-40 scale-105" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-night opacity-50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 lg:px-8 pb-10">
          <div className="flex flex-col md:row items-center md:items-end gap-8">
            <div className="w-28 h-28 lg:w-36 lg:h-36 rounded-[40px] border-4 border-white/10 overflow-hidden bg-night shadow-2xl flex-shrink-0 gold-glow">
              <img src={channel.snippet.thumbnails.high.url} alt={channel.snippet.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                 <h1 className="text-3xl lg:text-5xl font-black text-white uppercase tracking-tighter">{channel.snippet.title}</h1>
                 <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                 </div>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full"><Users size={14} className="text-gold" /> {formatSubscribers(channel.statistics.subscriberCount)} abonnés</span>
                <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full"><Youtube size={14} className="text-red-500" /> {channel.statistics.videoCount} vidéos</span>
                <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full"><Tv size={14} className="text-emerald-400" /> Direct TV</span>
              </div>
            </div>
            <a 
              href={config.youtube_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-10 py-4 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-xs rounded-full transition-all flex items-center gap-3 shadow-2xl"
            >
              S'abonner <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        {heroVideo && (
          <section className="mb-24">
            <div className="flex items-center justify-between mb-12">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-gold">
                    <Tv size={24} />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter">
                    {liveVideo ? "En Direct" : "Dernière Diffusion"}
                  </h2>
               </div>
               {liveVideo && (
                 <div className="flex items-center gap-3 px-4 py-2 bg-red-600/10 border border-red-600/20 rounded-full">
                    <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Live Now</span>
                 </div>
               )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8">
                <div className="aspect-video bg-black rounded-[40px] overflow-hidden shadow-2xl border-4 border-white/5 gold-glow">
                  <iframe
                    src={"https://www.youtube.com/embed/" + (typeof heroVideo.id === "string" ? heroVideo.id : heroVideo.id.videoId) + "?autoplay=0&rel=0"}
                    title={heroVideo.snippet.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
              <div className="lg:col-span-4 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-gold text-xs font-black uppercase tracking-[0.2em] mb-6">
                  <Calendar size={16} />
                  {new Date(heroVideo.snippet.publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </div>
                <h3 className="text-3xl lg:text-4xl font-black text-white mb-6 uppercase tracking-tighter leading-tight">{heroVideo.snippet.title}</h3>
                <p className="text-gray-400 text-lg mb-10 line-clamp-6 leading-relaxed font-medium">{heroVideo.snippet.description}</p>
                <div className="flex gap-4">
                   <a href={"https://www.youtube.com/watch?v=" + (typeof heroVideo.id === "string" ? heroVideo.id : heroVideo.id.videoId)} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all border border-white/10">
                    YouTube <ExternalLink size={16} className="inline ml-2" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-red-500">
                 <Youtube size={24} />
               </div>
               <h2 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter">Vidéos Récentes</h2>
            </div>
            <a href={config.youtube_url} target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-white/5 hover:bg-white/10 text-gold font-black uppercase tracking-widest text-[10px] rounded-full transition-all border border-white/5">
              Voir la chaîne
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridVideos.map((video, idx) => {
              const videoId = typeof video.id === "string" ? video.id : video.id.videoId;
              return (
                <motion.div 
                  key={videoId} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  transition={{ delay: idx * 0.05 }} 
                  viewport={{ once: true }} 
                  className="group"
                >
                  <a href={"https://www.youtube.com/watch?v=" + videoId} target="_blank" rel="noopener noreferrer" className="block glass-card rounded-[32px] overflow-hidden border-white/5 hover:border-gold/30 transition-all duration-500 shadow-xl">
                    <div className="aspect-video relative overflow-hidden">
                      <img src={video.snippet.thumbnails.high.url} alt={video.snippet.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-night/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                        <div className="w-16 h-16 rounded-full bg-gold text-night flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                          <Play size={28} fill="currentColor" className="ml-1" />
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 px-3 py-1 bg-night/80 backdrop-blur-md rounded-full border border-white/10">
                         <span className="text-[8px] font-black text-gold uppercase tracking-[0.2em]">HD</span>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-3 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <Sparkles size={12} className="text-gold" />
                        {new Date(video.snippet.publishedAt).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
                      </div>
                      <h4 className="text-xl font-black text-white leading-tight uppercase tracking-tight group-hover:text-gold transition-colors line-clamp-2">{video.snippet.title}</h4>
                    </div>
                  </a>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

