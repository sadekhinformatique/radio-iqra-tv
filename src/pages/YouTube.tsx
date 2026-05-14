import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Youtube, Users, Calendar, Play, ExternalLink, Loader2, AlertCircle } from "lucide-react";
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
      if (!apiKey && channelId) setError("Cle API YouTube manquante.");
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
        setError("Impossible de charger les donnees YouTube.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [config.youtube_url, config.youtube_api_key]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-gold-400" size={48} /></div>;
  }

  if (error || !channel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto">
        <AlertCircle size={64} className="text-red-400 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-4">Configuration YouTube</h2>
        <p className="text-gray-400 mb-8">{error || "Veuillez configurer l'URL de votre chaine YouTube dans le panneau d'administration."}</p>
        <a href="/" className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-all">Retour</a>
      </div>
    );
  }

  const heroVideo = liveVideo || latestVideos[0];
  const gridVideos = liveVideo ? latestVideos.slice(0, 6) : latestVideos.slice(1, 7);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="relative h-48 md:h-72 overflow-hidden">
        {channel.brandingSettings?.image?.bannerExternalUrl ? (
          <img src={channel.brandingSettings.image.bannerExternalUrl} alt="" className="w-full h-full object-cover opacity-50" />
        ) : (
          <div className="w-full h-full bg-gradient-premium" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 lg:px-8 pb-6 flex items-end gap-5">
          <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full border-2 border-white/20 overflow-hidden bg-night-800 shadow-xl flex-shrink-0">
            <img src={channel.snippet.thumbnails.high.url} alt={channel.snippet.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-white">{channel.snippet.title}</h1>
            <div className="flex items-center gap-4 text-gray-400 text-sm mt-1">
              <span className="flex items-center gap-1.5"><Users size={14} className="text-gold-400" /> {formatSubscribers(channel.statistics.subscriberCount)} abonnes</span>
              <span className="flex items-center gap-1.5"><Youtube size={14} className="text-gold-400" /> {channel.statistics.videoCount} videos</span>
            </div>
          </div>
          <a href={config.youtube_url} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-all flex items-center gap-2 text-sm flex-shrink-0">
            S'abonner <ExternalLink size={14} />
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        {heroVideo && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-6 bg-gold-500 rounded-full" />
              <h2 className="text-2xl font-cairo font-bold text-white">
                {liveVideo ? "En Direct" : "Derniere Video"}
              </h2>
              {liveVideo && <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse uppercase tracking-wider">Live</span>}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3">
                <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                  <iframe
                    src={"https://www.youtube.com/embed/" + (typeof heroVideo.id === "string" ? heroVideo.id : heroVideo.id.videoId) + "?autoplay=0"}
                    title={heroVideo.snippet.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
              <div className="lg:col-span-2 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider mb-3">
                  <Calendar size={14} />
                  {new Date(heroVideo.snippet.publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-4">{heroVideo.snippet.title}</h3>
                <p className="text-gray-400 mb-6 line-clamp-4 leading-relaxed">{heroVideo.snippet.description}</p>
                <a href={"https://www.youtube.com/watch?v=" + (typeof heroVideo.id === "string" ? heroVideo.id : heroVideo.id.videoId)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all w-max">
                  Regarder <ExternalLink size={18} />
                </a>
              </div>
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gold-500 rounded-full" />
              <h2 className="text-2xl font-cairo font-bold text-white">Videos Recentes</h2>
            </div>
            <a href={config.youtube_url} target="_blank" rel="noopener noreferrer" className="text-gold-400 text-sm hover:text-gold-300 flex items-center gap-1">
              Voir tout <ExternalLink size={14} />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridVideos.map((video, idx) => {
              const videoId = typeof video.id === "string" ? video.id : video.id.videoId;
              return (
                <motion.div key={videoId} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} viewport={{ once: true }} className="group">
                  <a href={"https://www.youtube.com/watch?v=" + videoId} target="_blank" rel="noopener noreferrer" className="block glass-card rounded-xl overflow-hidden hover:border-emerald-500/30 transition-all duration-500">
                    <div className="aspect-video relative overflow-hidden">
                      <img src={video.snippet.thumbnails.high.url} alt={video.snippet.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-night-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-gold-500 text-night-900 flex items-center justify-center shadow-xl">
                          <Play size={22} fill="currentColor" className="ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-1 text-gray-500 text-[10px] font-bold uppercase mb-1">
                        <Calendar size={10} />
                        {new Date(video.snippet.publishedAt).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
                      </div>
                      <h4 className="font-bold text-white text-sm line-clamp-2 group-hover:text-gold-400 transition-colors">{video.snippet.title}</h4>
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
