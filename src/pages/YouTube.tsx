import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Youtube, Users, Calendar, Play, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { useSiteConfig } from "../hooks/useSiteConfig";

interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  customUrl: string;
  publishedAt: string;
  thumbnails: {
    medium: { url: string };
    high: { url: string };
  };
  brandingSettings: {
    image?: { bannerExternalUrl: string };
  };
  statistics: {
    viewCount: string;
    subscriberCount: string;
    videoCount: string;
  };
}

interface YouTubeVideo {
  id: { videoId: string } | string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      high: { url: string };
      maxres?: { url: string };
    };
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
    // Common patterns: youtube.com/channel/UC... or youtube.com/c/Name or youtube.com/@Name
    // For simplicity, we'll assume the user provides a full URL and we try to find /channel/
    const channelMatch = url.match(/\/channel\/([a-zA-Z0-9_-]+)/);
    if (channelMatch) return channelMatch[1];
    
    // Fallback if it's just the ID
    if (url.startsWith("UC") && url.length > 20) return url;
    
    return null;
  };

  const formatSubscribers = (countStr: string) => {
    const count = parseInt(countStr);
    if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
    if (count >= 1000) return (count / 1000).toFixed(1) + "k";
    return count.toString();
  };

  useEffect(() => {
    const channelId = extractChannelId(config.facebook_url); // Wait, I should probably check config.youtube_url
    const actualChannelId = extractChannelId(config.youtube_url);
    const apiKey = config.youtube_api_key;

    if (!actualChannelId || !apiKey) {
      setLoading(false);
      if (!apiKey && actualChannelId) setError("Clé API YouTube manquante dans la configuration.");
      return;
    }

    async function fetchYouTubeData() {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch Channel Info
        const chanRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${actualChannelId}&key=${apiKey}`);
        const chanData = await chanRes.json();
        
        if (chanData.error) throw new Error(chanData.error.message);
        if (chanData.items?.[0]) setChannel(chanData.items[0]);

        // 2. Check for Live Stream
        const liveRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${actualChannelId}&type=video&eventType=live&key=${apiKey}`);
        const liveData = await liveRes.json();
        if (liveData.items?.[0]) setLiveVideo(liveData.items[0]);

        // 3. Fetch Latest Videos
        const videosRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${actualChannelId}&type=video&order=date&maxResults=10&key=${apiKey}`);
        const videosData = await videosRes.json();
        if (videosData.items) {
          // Filter out the live video if it's the same
          const filtered = videosData.items.filter((v: any) => v.id.videoId !== liveVideo?.id);
          setLatestVideos(filtered);
        }

      } catch (err: any) {
        console.error("YouTube API error:", err);
        setError("Impossible de charger les données YouTube. Vérifiez votre clé API ou l'ID de la chaîne.");
      } finally {
        setLoading(false);
      }
    }

    fetchYouTubeData();
  }, [config.youtube_url, config.youtube_api_key, liveVideo?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-iqra-green" size={48} />
          <p className="font-bold text-gray-400 uppercase tracking-widest text-sm">Chargement de la chaîne...</p>
        </div>
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto">
        <AlertCircle size={64} className="text-red-500 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Configuration YouTube</h2>
        <p className="text-gray-600 mb-8">{error || "Veuillez configurer l'URL de votre chaîne YouTube dans le panneau d'administration."}</p>
        <a href="/" className="px-8 py-3 bg-iqra-green text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-all">
          Retour à l'accueil
        </a>
      </div>
    );
  }

  const heroVideo = liveVideo || latestVideos[0];
  const gridVideos = liveVideo ? latestVideos.slice(0, 6) : latestVideos.slice(1, 7);

  return (
    <div className="min-h-screen bg-white">
      {/* Channel Header */}
      <div className="relative h-48 md:h-80 bg-gray-900 overflow-hidden">
        {channel.brandingSettings?.image?.bannerExternalUrl ? (
          <img 
            src={channel.brandingSettings.image.bannerExternalUrl} 
            alt="Bannière" 
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-iqra-green to-iqra-green-dark"></div>
        )}
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pb-8 flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white shrink-0">
              <img src={channel.snippet.thumbnails.high.url} alt={channel.snippet.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-grow text-center md:text-left mb-2">
               <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{channel.snippet.title}</h1>
               <div className="flex items-center justify-center md:justify-start gap-4 text-white/80 text-sm">
                 <div className="flex items-center gap-1.5">
                   <Users size={16} className="text-iqra-gold" />
                   <span>{formatSubscribers(channel.statistics.subscriberCount)} abonnés</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                   <Youtube size={16} className="text-iqra-gold" />
                   <span>{channel.statistics.videoCount} vidéos</span>
                 </div>
               </div>
            </div>
            <a 
              href={config.youtube_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg"
            >
              S'abonner <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Featured Content (Live or Last Video) */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-8 bg-iqra-gold rounded-full"></div>
            <h2 className="text-3xl font-serif font-bold text-iqra-green">
              {liveVideo ? "En Direct Actuellement" : "Dernière Vidéo"}
            </h2>
            {liveVideo && (
              <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full animate-pulse ml-2 uppercase tracking-widest">
                Direct
              </span>
            )}
          </div>

          {heroVideo && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
              <div className="lg:col-span-3">
                <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl group relative border-4 border-gray-100">
                  <iframe 
                    src={`https://www.youtube.com/embed/${typeof heroVideo.id === 'string' ? heroVideo.id : heroVideo.id.videoId}?autoplay=0`}
                    title={heroVideo.snippet.title}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                </div>
              </div>
              <div className="lg:col-span-2 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-iqra-gold font-bold text-xs uppercase tracking-[0.2em] mb-4">
                  <Calendar size={14} />
                  {new Date(heroVideo.snippet.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                  {heroVideo.snippet.title}
                </h3>
                <p className="text-gray-600 mb-8 line-clamp-4 leading-loose">
                  {heroVideo.snippet.description}
                </p>
                <div className="flex gap-4">
                  <a 
                    href={`https://www.youtube.com/watch?v=${typeof heroVideo.id === 'string' ? heroVideo.id : heroVideo.id.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-iqra-green text-white font-bold rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-xl"
                  >
                    Regarder sur YouTube <ExternalLink size={20} />
                  </a>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Latest Videos Grid */}
        <section>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-iqra-gold rounded-full"></div>
              <h2 className="text-3xl font-serif font-bold text-iqra-green">Vidéos Récentes</h2>
            </div>
            <a 
              href={config.youtube_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-iqra-green font-bold text-sm hover:text-iqra-gold transition-colors flex items-center gap-2"
            >
              Voir Tout <ExternalLink size={16} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridVideos.map((video, idx) => {
               const videoId = typeof video.id === 'string' ? video.id : video.id.videoId;
               return (
                <motion.div 
                  key={videoId}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <a 
                    href={`https://www.youtube.com/watch?v=${videoId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-100 transition-all"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={video.snippet.thumbnails.high.url} 
                        alt={video.snippet.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-iqra-green/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-iqra-green shadow-xl">
                          <Play size={24} fill="currentColor" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase mb-2">
                        <Calendar size={12} />
                        {new Date(video.snippet.publishedAt).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                      </div>
                      <h4 className="font-bold text-gray-900 leading-tight line-clamp-2 min-h-[3rem] group-hover:text-iqra-green transition-colors">
                        {video.snippet.title}
                      </h4>
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
