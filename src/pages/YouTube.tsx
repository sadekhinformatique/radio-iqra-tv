import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Youtube, Calendar, Play, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { useSiteConfig } from "../hooks/useSiteConfig";

interface VideoEntry {
  videoId: string;
  title: string;
  publishedAt: string;
  author: string;
}

function extractChannelId(url: string): string | null {
  if (!url) return null;
  const channelMatch = url.match(/\/channel\/([a-zA-Z0-9_-]+)/);
  if (channelMatch) return channelMatch[1];
  if (url.startsWith("UC") && url.length > 20) return url;
  return null;
}

function parseXml(xmlText: string): VideoEntry[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "text/xml");
  const entries = doc.querySelectorAll("entry");
  const videos: VideoEntry[] = [];

  entries.forEach((entry) => {
    const videoIdEl = entry.querySelector("id");
    const titleEl = entry.querySelector("title");
    const publishedEl = entry.querySelector("published");
    const authorEl = entry.querySelector("author > name");

    if (videoIdEl?.textContent && titleEl?.textContent) {
      const id = videoIdEl.textContent;
      const vid = id.includes(":") ? id.split(":").pop() : id;
      videos.push({
        videoId: vid || "",
        title: titleEl.textContent,
        publishedAt: publishedEl?.textContent || "",
        author: authorEl?.textContent || "",
      });
    }
  });

  return videos;
}

export default function YouTube() {
  const { config } = useSiteConfig();
  const [videos, setVideos] = useState<VideoEntry[]>([]);
  const [channelName, setChannelName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const channelId = extractChannelId(config.youtube_url);

    if (!channelId) {
      setLoading(false);
      setError("URL de chaîne YouTube non configurée.");
      return;
    }

    async function fetchVideos() {
      try {
        setLoading(true);
        setError(null);

        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`;

        const res = await fetch(proxyUrl);
        if (!res.ok) throw new Error("Impossible de charger le flux RSS");
        const text = await res.text();
        const entries = parseXml(text);

        if (entries.length > 0) {
          setChannelName(entries[0].author);
        }
        setVideos(entries);
      } catch (err) {
        console.error("YouTube RSS error:", err);
        setError("Impossible de charger les vidéos YouTube.");
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, [config.youtube_url]);

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

  if (error || videos.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto">
        <AlertCircle size={64} className="text-red-500 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">YouTube</h2>
        <p className="text-gray-600 mb-8">{error || "Aucune vidéo trouvée."}</p>
        <a href={config.youtube_url} target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-red-600 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center gap-2">
          Voir la chaîne sur YouTube <ExternalLink size={16} />
        </a>
      </div>
    );
  }

  const heroVideo = videos[0];
  const gridVideos = videos.slice(1, 7);

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-48 md:h-80 bg-gray-900 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-iqra-green to-iqra-green-dark"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Youtube size={80} className="text-white/20" />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pb-8 flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-red-600 flex items-center justify-center shrink-0">
              <Youtube size={40} className="text-white" />
            </div>
            <div className="flex-grow text-center md:text-left mb-2">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{channelName}</h1>
              <p className="text-white/70 text-sm">Nos vidéos sur YouTube</p>
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
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-8 bg-iqra-gold rounded-full"></div>
            <h2 className="text-3xl font-serif font-bold text-iqra-green">Dernière Vidéo</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3">
              <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-100">
                <iframe
                  src={`https://www.youtube.com/embed/${heroVideo.videoId}`}
                  title={heroVideo.title}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              </div>
            </div>
            <div className="lg:col-span-2 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-iqra-gold font-bold text-xs uppercase tracking-[0.2em] mb-4">
                <Calendar size={14} />
                {new Date(heroVideo.publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                {heroVideo.title}
              </h3>
              <div className="flex gap-4">
                <a
                  href={`https://www.youtube.com/watch?v=${heroVideo.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-iqra-green text-white font-bold rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-xl"
                >
                  Regarder sur YouTube <ExternalLink size={20} />
                </a>
              </div>
            </div>
          </div>
        </section>

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
            {gridVideos.map((video, idx) => (
              <motion.div
                key={video.videoId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <a
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-100 transition-all"
                >
                  <div className="aspect-video relative overflow-hidden bg-gray-900">
                    <img
                      src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                      alt={video.title}
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
                      {new Date(video.publishedAt).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
                    </div>
                    <h4 className="font-bold text-gray-900 leading-tight line-clamp-2 min-h-[3rem] group-hover:text-iqra-green transition-colors">
                      {video.title}
                    </h4>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
