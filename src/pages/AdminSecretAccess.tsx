import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "motion/react";
import { Lock, User, LogIn, LayoutDashboard, Plus, Pencil, Trash2, X, Music, Save, Loader2, FileText, Image as ImageIcon, BookOpen, Volume2, Clock, CalendarRange, Mail, CheckCircle2 } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

interface Podcast {
  id: string | number;
  title: string;
  category: string;
  date: string;
  duration: string;
  audio_url: string;
}

interface Article {
  id: string | number;
  title: string;
  content: string;
  date: string;
  image_url: string;
}

interface Sourate {
  id: string | number;
  number: number;
  name_ar: string;
  name_fr: string;
  text_ar: string;
  translation_fr: string;
  audio_url: string;
}

interface GrilleItem {
  id: string;
  day: string;
  start_time: string;
  end_time: string;
  title: string;
  description: string;
}

const CATEGORIES = ["Prêche", "Tafsir", "Hadith", "Conseils", "Émission culturelle"];
const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export default function AdminSecretAccess() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<"dashboard" | "podcasts" | "articles" | "sourates" | "grille" | "config" | "messages">("dashboard");

  // Dashboard State
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [sourates, setSourates] = useState<Sourate[]>([]);
  const [grilleItems, setGrilleItems] = useState<GrilleItem[]>([]);
  const [siteConfig, setSiteConfig] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  
  const [podcastFormData, setPodcastFormData] = useState({
    title: "",
    category: "Prêche",
    date: new Date().toISOString().split('T')[0],
    duration: "",
  });

  const [articleFormData, setArticleFormData] = useState({
    title: "",
    content: "",
    date: new Date().toISOString().split('T')[0],
  });

  const [sourateFormData, setSourateFormData] = useState({
    number: 1,
    name_ar: "",
    name_fr: "",
    text_ar: "",
    translation_fr: "",
  });

  const [grilleFormData, setGrilleFormData] = useState({
    day: "Lundi",
    start_time: "08:00",
    end_time: "09:00",
    title: "",
    description: "",
  });

  const [configFormData, setConfigFormData] = useState<any>({
    site_name: "",
    primary_phone: "",
    secondary_phone: "",
    email: "",
    address: "",
    facebook_url: "",
    youtube_url: "",
    whatsapp_number: "",
    telegram_url: "",
    twitter_url: "",
    instagram_url: "",
    facebook_url: "",
    youtube_url: "",
    whatsapp_number: "",
    telegram_url: "",
    footer_text: "",
    primary_color: "#2e7d32",
    secondary_color: "#D4AF37",
    radio_stream_url: "",
    youtube_api_key: "",
    use_modern_ui: false,
    hero_title_1: "",
    hero_title_2: "",
    hero_subtitle: "",
    hero_image_url: "",
    donation_title: "",
    donation_description: "",
    donation_goal: 0,
    donation_current: 0,
    about_history: "",
    about_mission: "",
    about_vision: "",
    prayer_location: "",
    daily_quote: "",
    daily_quote_author: "",
  });

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      if (activeTab === "podcasts") fetchPodcasts();
      else if (activeTab === "articles") fetchArticles();
      else if (activeTab === "sourates") fetchSourates();
      else if (activeTab === "grille") fetchGrille();
      else if (activeTab === "config") fetchConfig();
      else fetchMessages();
    }
  }, [user, activeTab]);

  const fetchMessages = async () => {
    const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (!error) setMessages(data || []);
  };

  const markMessageAsRead = async (id: string) => {
    const { error } = await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);
    if (!error) fetchMessages();
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm("Supprimer ce message ?")) return;
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (!error) fetchMessages();
  };

  const fetchConfig = async () => {
    const { data, error } = await supabase.from('site_config').select('*').eq('id', 1).single();
    if (!error && data) {
      setSiteConfig(data);
      setConfigFormData({ ...data });
    }
  };

  const fetchPodcasts = async () => {
    const { data, error } = await supabase.from('podcasts').select('*').order('date', { ascending: false });
    if (!error) setPodcasts(data || []);
  };

  const fetchArticles = async () => {
    const { data, error } = await supabase.from('articles').select('*').order('date', { ascending: false });
    if (!error) setArticles(data || []);
  };

  const fetchSourates = async () => {
    const { data, error } = await supabase.from('sourates').select('*').order('number', { ascending: true });
    if (!error) setSourates(data || []);
  };

  const fetchGrille = async () => {
    const { data, error } = await supabase.from('grille').select('*').order('day', { ascending: true }).order('start_time', { ascending: true });
    if (!error) setGrilleItems(data || []);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPodcastFormData({ title: "", category: "Prêche", date: new Date().toISOString().split('T')[0], duration: "" });
    setArticleFormData({ title: "", content: "", date: new Date().toISOString().split('T')[0] });
    setSourateFormData({ number: sourates.length + 1, name_ar: "", name_fr: "", text_ar: "", translation_fr: "" });
    setGrilleFormData({ day: "Lundi", start_time: "08:00", end_time: "09:00", title: "", description: "" });
    setUploadFile(null);
    setEditingId(null);
    setIsFormOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEditPodcast = (p: Podcast) => { setPodcastFormData({ title: p.title, category: p.category, date: p.date, duration: p.duration }); setEditingId(p.id); setIsFormOpen(true); };
  const handleEditArticle = (a: Article) => { setArticleFormData({ title: a.title, content: a.content, date: a.date }); setEditingId(a.id); setIsFormOpen(true); };
  const handleEditSourate = (s: Sourate) => { setSourateFormData({ number: s.number, name_ar: s.name_ar, name_fr: s.name_fr, text_ar: s.text_ar, translation_fr: s.translation_fr }); setEditingId(s.id); setIsFormOpen(true); };
  const handleEditGrille = (i: GrilleItem) => { setGrilleFormData({ day: i.day, start_time: i.start_time, end_time: i.end_time, title: i.title, description: i.description }); setEditingId(i.id); setIsFormOpen(true); };

  const handleDeletePodcast = async (p: Podcast) => {
    if (!window.confirm("Supprimer ce podcast ?")) return;
    try {
      const { error } = await supabase.from('podcasts').delete().eq('id', p.id);
      if (error) throw error;
      fetchPodcasts();
    } catch (err: any) { setStatusMsg({ type: "error", text: err.message }); }
  };

  const handleDeleteArticle = async (a: Article) => {
    if (!window.confirm("Supprimer cet article ?")) return;
    try {
      const { error } = await supabase.from('articles').delete().eq('id', a.id);
      if (error) throw error;
      fetchArticles();
    } catch (err: any) { setStatusMsg({ type: "error", text: err.message }); }
  };

  const handleDeleteSourate = async (s: Sourate) => {
    if (!window.confirm("Supprimer cette sourate ?")) return;
    try {
      const { error } = await supabase.from('sourates').delete().eq('id', s.id);
      if (error) throw error;
      fetchSourates();
    } catch (err: any) { setStatusMsg({ type: "error", text: err.message }); }
  };

  const handleDeleteGrille = async (i: GrilleItem) => {
    if (!window.confirm("Supprimer cette émission ?")) return;
    try {
      const { error } = await supabase.from('grille').delete().eq('id', i.id);
      if (error) throw error;
      fetchGrille();
    } catch (err: any) { setStatusMsg({ type: "error", text: err.message }); }
  };

  const handlePodcastSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      let audio_url = "";
      if (uploadFile) {
        const path = `podcasts/${Date.now()}-${uploadFile.name}`;
        const { error: uploadError } = await supabase.storage.from('podcasts-audio').upload(path, uploadFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('podcasts-audio').getPublicUrl(path);
        audio_url = publicUrl;
      }
      if (editingId) {
        const data = audio_url ? { ...podcastFormData, audio_url } : podcastFormData;
        await supabase.from('podcasts').update(data).eq('id', editingId);
      } else {
        await supabase.from('podcasts').insert([{ ...podcastFormData, audio_url: audio_url || "" }]);
      }
      resetForm();
      fetchPodcasts();
    } catch (err: any) { setStatusMsg({ type: "error", text: err.message }); } finally { setFormLoading(false); }
  };

  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      let image_url = "";
      if (uploadFile) {
        const path = `articles/${Date.now()}-${uploadFile.name}`;
        const { error: uploadError } = await supabase.storage.from('articles-images').upload(path, uploadFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('articles-images').getPublicUrl(path);
        image_url = publicUrl;
      }
      if (editingId) {
        const data = image_url ? { ...articleFormData, image_url } : articleFormData;
        await supabase.from('articles').update(data).eq('id', editingId);
      } else {
        await supabase.from('articles').insert([{ ...articleFormData, image_url: image_url || "" }]);
      }
      resetForm();
      fetchArticles();
    } catch (err: any) { setStatusMsg({ type: "error", text: err.message }); } finally { setFormLoading(false); }
  };

  const handleSourateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingId) await supabase.from('sourates').update(sourateFormData).eq('id', editingId);
      else await supabase.from('sourates').insert([sourateFormData]);
      resetForm();
      fetchSourates();
    } catch (err: any) { setStatusMsg({ type: "error", text: err.message }); } finally { setFormLoading(false); }
  };

  const handleGrilleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingId) await supabase.from('grille').update(grilleFormData).eq('id', editingId);
      else await supabase.from('grille').insert([grilleFormData]);
      resetForm();
      fetchGrille();
    } catch (err: any) { setStatusMsg({ type: "error", text: err.message }); } finally { setFormLoading(false); }
  };

  const handleConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await supabase.from('site_config').update(configFormData).eq('id', 1);
      fetchConfig();
      setStatusMsg({ type: "success", text: "Configuration sauvegardée" });
    } catch (err: any) { setStatusMsg({ type: "error", text: err.message }); } finally { setFormLoading(false); }
  };

  const handleAssetUpload = async (file: File, type: 'logos' | 'favicons') => {
    setFormLoading(true);
    try {
      const path = `${type}/${Date.now()}-${file.name}`;
      await supabase.storage.from('site-assets').upload(path, file);
      const { data: { publicUrl } } = supabase.storage.from('site-assets').getPublicUrl(path);
      const key = type === 'logos' ? 'logo_url' : 'favicon_url';
      await supabase.from('site_config').update({ [key]: publicUrl }).eq('id', 1);
      fetchConfig();
    } catch (err: any) { setStatusMsg({ type: "error", text: err.message }); } finally { setFormLoading(false); }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#070A11] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#0F5132]/10 blur-[150px] rounded-full" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
          <div className="text-center mb-10">
             <div className="w-20 h-20 bg-gradient-to-br from-[#0F5132] to-[#D4AF37] rounded-[28px] mx-auto flex items-center justify-center shadow-3xl mb-6">
                <Lock size={32} className="text-white" />
             </div>
             <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Admin Portal</h1>
          </div>
          <form onSubmit={handleLogin} className="bg-[#0B0F19] p-10 rounded-[48px] border border-white/5 space-y-8 shadow-3xl">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white" placeholder="Email" required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white" placeholder="Password" required />
            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            <button type="submit" disabled={loading} className="w-full py-5 bg-[#D4AF37] text-[#0B0F19] font-black rounded-2xl uppercase tracking-widest">{loading ? "..." : "Entrer"}</button>
          </form>
        </motion.div>
      </div>
    );
  }

  const menuItems = [
    { id: "dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
    { id: "podcasts", label: "Podcasts", icon: Music },
    { id: "articles", label: "Blog / Articles", icon: FileText },
    { id: "sourates", label: "Saint Coran", icon: BookOpen },
    { id: "grille", label: "Grille TV", icon: CalendarRange },
    { id: "messages", label: "Messages", icon: Mail, badge: messages.filter(m => !m.is_read).length },
    { id: "config", label: "Réglages", icon: Save },
  ];

  return (
    <div className="min-h-screen bg-[#070A11] text-white flex overflow-hidden">
      <aside className="w-80 bg-[#0B0F19] border-r border-white/5 flex flex-col shrink-0">
        <div className="p-10">
           <h2 className="text-2xl font-black mb-10 tracking-tighter">IQRA <span className="text-[#D4AF37]">CMS</span></h2>
           <nav className="space-y-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden ${activeTab === item.id ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8962D] text-[#0B0F19] font-black shadow-[0_10px_30px_-5px_rgba(212,175,55,0.4)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <item.icon size={20} className={`${activeTab === item.id ? 'text-[#0B0F19]' : 'text-[#D4AF37] group-hover:scale-110 transition-transform duration-500'}`} />
                    <span className="text-[11px] uppercase tracking-[0.2em]">{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className={`relative z-10 text-[10px] px-2.5 py-1 rounded-lg ${activeTab === item.id ? 'bg-white/20 text-[#0B0F19]' : 'bg-[#D4AF37]/10 text-[#D4AF37]'} font-black`}>
                      {item.badge}
                    </span>
                  ) : null}
                  {activeTab === item.id && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              ))}
           </nav>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="mt-auto p-10 text-red-400 text-[10px] uppercase font-black tracking-widest hover:bg-red-500/5 transition-all flex items-center gap-3"><LogIn size={16} /> Déconnexion</button>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 relative">
        <div className="max-w-6xl mx-auto space-y-10">
          <header className="flex justify-between items-center mb-12">
             <div>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] mb-1">Administration</p>
                <h1 className="text-4xl font-black tracking-tight">{menuItems.find(m => m.id === activeTab)?.label}</h1>
             </div>
             {activeTab !== "config" && activeTab !== "messages" && activeTab !== "dashboard" && (
                <button onClick={() => { resetForm(); setIsFormOpen(true); }} className="px-8 py-4 bg-[#D4AF37] text-[#0B0F19] font-black rounded-2xl flex items-center gap-3 uppercase text-[10px] tracking-widest shadow-xl shadow-[#D4AF37]/20"><Plus size={18} /> Ajouter</button>
             )}
          </header>

          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                       {[
                         { label: "Podcasts", value: podcasts.length, icon: Music, color: "text-emerald-400", bg: "bg-emerald-500/5", border: "border-emerald-500/10" },
                         { label: "Articles", value: articles.length, icon: FileText, color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/5", border: "border-[#D4AF37]/10" },
                         { label: "Sourates", value: sourates.length, icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/5", border: "border-blue-500/10" },
                         { label: "Messages", value: messages.length, icon: Mail, color: "text-purple-400", bg: "bg-purple-500/5", border: "border-purple-500/10" },
                       ].map((stat, i) => (
                         <motion.div 
                           key={i}
                           whileHover={{ y: -5 }}
                           className={`glass-card p-10 rounded-[40px] ${stat.border} flex flex-col gap-6 group relative overflow-hidden bg-gradient-to-br from-white/[0.02] to-transparent`}
                         >
                            <div className={`w-16 h-16 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                               <stat.icon size={32} />
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">{stat.label}</p>
                               <h4 className="text-5xl font-black text-white tracking-tighter">{stat.value}</h4>
                            </div>
                            <div className={`absolute -right-4 -bottom-4 ${stat.color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700`}>
                               <stat.icon size={140} />
                            </div>
                         </motion.div>
                       ))}
                    </div>

                    {/* Activity & Quick Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                       <div className="lg:col-span-2 glass-card rounded-[48px] p-12 border-white/5 relative overflow-hidden bg-gradient-to-br from-[#0B0F19] to-transparent">
                          <div className="flex items-center justify-between mb-12">
                             <h3 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-4">
                                <Clock className="text-[#D4AF37]" size={24} /> Flux d'Activité
                             </h3>
                             <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-[9px] font-black text-gray-400 uppercase tracking-widest border border-white/5">
                                Temps Réel <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                             </div>
                          </div>
                          <div className="space-y-6">
                             {(podcasts.length > 0 ? podcasts : [1,2,3]).slice(0, 4).map((p: any, i) => (
                               <motion.div 
                                 key={p.id || i}
                                 initial={{ opacity: 0, x: -20 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 transition={{ delay: i * 0.1 }}
                                 className="flex items-center justify-between p-6 rounded-[32px] bg-white/[0.01] border border-white/5 hover:border-[#D4AF37]/30 hover:bg-white/[0.03] transition-all group"
                               >
                                  <div className="flex items-center gap-6">
                                     <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform shadow-inner">
                                        {p.title ? <Music size={24} /> : <div className="w-6 h-6 bg-white/10 rounded-full animate-pulse" />}
                                     </div>
                                     <div>
                                        <h4 className="font-black text-white uppercase tracking-tight text-sm">{p.title || "Chargement..."}</h4>
                                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1.5">
                                           {p.category || "Système"} • {p.date || "Maintenant"}
                                        </p>
                                     </div>
                                  </div>
                                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 transition-all">
                                     <ChevronRight size={18} />
                                  </div>
                               </motion.div>
                             ))}
                          </div>
                       </div>

                       <div className="space-y-8">
                          <div className="glass-card rounded-[48px] p-12 border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent">
                             <h3 className="text-xl font-black text-white uppercase tracking-tight mb-10">Raccourcis</h3>
                             <div className="space-y-4">
                                {[
                                  { label: "Nouveau Podcast", tab: "podcasts", icon: Music, color: "emerald" },
                                  { label: "Ajouter Article", tab: "articles", icon: FileText, color: "gold" },
                                  { label: "Mise à jour Grille", tab: "grille", icon: CalendarRange, color: "blue" },
                                ].map((btn, i) => (
                                  <button 
                                    key={i}
                                    onClick={() => { setActiveTab(btn.tab as any); setIsFormOpen(true); }} 
                                    className={`w-full py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 group ${btn.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : btn.color === 'gold' ? 'bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20' : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'}`}
                                  >
                                     <btn.icon size={18} className="group-hover:rotate-12 transition-transform" /> {btn.label}
                                  </button>
                                ))}
                             </div>
                          </div>
                          
                          <div className="glass-card rounded-[48px] p-12 border-[#D4AF37]/10 bg-[#D4AF37]/5 relative overflow-hidden group">
                             <div className="relative z-10">
                                <h3 className="text-lg font-black text-white mb-3">Statut Serveur</h3>
                                <div className="flex items-center gap-3 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6">
                                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Cloud Sync Actif
                                </div>
                                <p className="text-gray-500 text-[10px] font-bold leading-relaxed uppercase tracking-widest">Dernière sauvegarde: il y a 5 min</p>
                             </div>
                             <div className="absolute -right-8 -bottom-8 text-white/[0.02] group-hover:scale-110 transition-transform duration-700">
                                <Save size={160} />
                             </div>
                          </div>
                       </div>
                    </div>
              </motion.div>
            )}

            {activeTab === "config" && (
              <motion.form onSubmit={handleConfigSubmit} className="space-y-12">
                 <div className="bg-[#0B0F19] p-12 rounded-[56px] border border-white/5 space-y-12 shadow-2xl">
                    <section className="space-y-8">
                       <h3 className="text-[#D4AF37] font-black uppercase text-xs tracking-[0.3em] flex items-center gap-4"><span className="w-8 h-px bg-[#D4AF37]/30" /> Branding & Identité</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Nom du Site</label>
                             <input type="text" value={configFormData.site_name} onChange={e => setConfigFormData({...configFormData, site_name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Logo</label>
                                <input type="file" onChange={e => e.target.files?.[0] && handleAssetUpload(e.target.files[0], 'logos')} className="hidden" id="logo-up" />
                                <label htmlFor="logo-up" className="block w-full bg-white/5 border border-white/10 rounded-2xl py-4 text-center cursor-pointer text-[10px] font-black uppercase">Changer</label>
                             </div>
                             <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Favicon</label>
                                <input type="file" onChange={e => e.target.files?.[0] && handleAssetUpload(e.target.files[0], 'favicons')} className="hidden" id="fav-up" />
                                <label htmlFor="fav-up" className="block w-full bg-white/5 border border-white/10 rounded-2xl py-4 text-center cursor-pointer text-[10px] font-black uppercase">Changer</label>
                             </div>
                          </div>
                       </div>
                    </section>

                    <section className="space-y-8 pt-10 border-t border-white/5">
                       <h3 className="text-[#D4AF37] font-black uppercase text-xs tracking-[0.3em] flex items-center gap-4"><span className="w-8 h-px bg-[#D4AF37]/30" /> Contenu Hero (Accueil)</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <input type="text" value={configFormData.hero_title_1} onChange={e => setConfigFormData({...configFormData, hero_title_1: e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6" placeholder="Titre 1" />
                          <input type="text" value={configFormData.hero_title_2} onChange={e => setConfigFormData({...configFormData, hero_title_2: e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6" placeholder="Titre 2" />
                          <textarea value={configFormData.hero_subtitle} onChange={e => setConfigFormData({...configFormData, hero_subtitle: e.target.value})} className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 h-32" placeholder="Sous-titre" />
                          <input type="text" value={configFormData.hero_image_url} onChange={e => setConfigFormData({...configFormData, hero_image_url: e.target.value})} className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl py-4 px-6" placeholder="URL Image de fond" />
                       </div>
                    </section>

                    <section className="space-y-8 pt-10 border-t border-white/5">
                       <h3 className="text-[#D4AF37] font-black uppercase text-xs tracking-[0.3em] flex items-center gap-4"><span className="w-8 h-px bg-[#D4AF37]/30" /> Page À Propos</h3>
                       <div className="space-y-6">
                          <textarea value={configFormData.about_history} onChange={e => setConfigFormData({...configFormData, about_history: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 h-40" placeholder="Notre Histoire" />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <textarea value={configFormData.about_mission} onChange={e => setConfigFormData({...configFormData, about_mission: e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 h-32" placeholder="Mission" />
                             <textarea value={configFormData.about_vision} onChange={e => setConfigFormData({...configFormData, about_vision: e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 h-32" placeholder="Vision" />
                          </div>
                       </div>
                    </section>

                    <section className="space-y-8 pt-10 border-t border-white/5">
                       <h3 className="text-[#D4AF37] font-black uppercase text-xs tracking-[0.3em] flex items-center gap-4"><span className="w-8 h-px bg-[#D4AF37]/30" /> Citation & Spiritualité</h3>
                       <div className="space-y-6">
                          <textarea value={configFormData.daily_quote} onChange={e => setConfigFormData({...configFormData, daily_quote: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 h-24" placeholder="Citation du jour" />
                          <input type="text" value={configFormData.daily_quote_author} onChange={e => setConfigFormData({...configFormData, daily_quote_author: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6" placeholder="Auteur / Source" />
                       </div>
                    </section>

                    <section className="space-y-8 pt-10 border-t border-white/5">
                       <h3 className="text-[#D4AF37] font-black uppercase text-xs tracking-[0.3em] flex items-center gap-4"><span className="w-8 h-px bg-[#D4AF37]/30" /> Campagne de Dons & Localisation</h3>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <input type="text" value={configFormData.donation_title} onChange={e => setConfigFormData({...configFormData, donation_title: e.target.value})} className="md:col-span-3 bg-white/5 border border-white/10 rounded-2xl py-4 px-6" placeholder="Titre Campagne" />
                          <input type="number" value={configFormData.donation_goal} onChange={e => setConfigFormData({...configFormData, donation_goal: parseInt(e.target.value)})} className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6" placeholder="Objectif" />
                          <input type="number" value={configFormData.donation_current} onChange={e => setConfigFormData({...configFormData, donation_current: parseInt(e.target.value)})} className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6" placeholder="Actuel" />
                          <input type="text" value={configFormData.prayer_location} onChange={e => setConfigFormData({...configFormData, prayer_location: e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6" placeholder="Ville (Horaires prière)" />
                       </div>
                    </section>

                    <section className="space-y-8 pt-10 border-t border-white/5">
                       <h3 className="text-[#D4AF37] font-black uppercase text-xs tracking-[0.3em] flex items-center gap-4"><span className="w-8 h-px bg-[#D4AF37]/30" /> Réseaux Sociaux</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <input type="text" value={configFormData.facebook_url} onChange={e => setConfigFormData({...configFormData, facebook_url: e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6" placeholder="Facebook URL" />
                          <input type="text" value={configFormData.youtube_url} onChange={e => setConfigFormData({...configFormData, youtube_url: e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6" placeholder="YouTube URL" />
                          <input type="text" value={configFormData.whatsapp_number} onChange={e => setConfigFormData({...configFormData, whatsapp_number: e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6" placeholder="WhatsApp Number" />
                          <input type="text" value={configFormData.telegram_url} onChange={e => setConfigFormData({...configFormData, telegram_url: e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6" placeholder="Telegram URL" />
                          <input type="text" value={configFormData.instagram_url} onChange={e => setConfigFormData({...configFormData, instagram_url: e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6" placeholder="Instagram URL" />
                          <input type="text" value={configFormData.twitter_url} onChange={e => setConfigFormData({...configFormData, twitter_url: e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6" placeholder="Twitter URL" />
                       </div>
                    </section>

                    <section className="space-y-8 pt-10 border-t border-white/5">
                       <h3 className="text-[#D4AF37] font-black uppercase text-xs tracking-[0.3em] flex items-center gap-4"><span className="w-8 h-px bg-[#D4AF37]/30" /> Paramètres Techniques</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <input type="text" value={configFormData.radio_stream_url} onChange={e => setConfigFormData({...configFormData, radio_stream_url: e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6" placeholder="URL Radio Stream" />
                          <input type="password" value={configFormData.youtube_api_key} onChange={e => setConfigFormData({...configFormData, youtube_api_key: e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6" placeholder="YouTube API Key" />
                          <input type="text" value={configFormData.email} onChange={e => setConfigFormData({...configFormData, email: e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6" placeholder="Email contact" />
                          <input type="text" value={configFormData.primary_phone} onChange={e => setConfigFormData({...configFormData, primary_phone: e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6" placeholder="Téléphone" />
                       </div>
                    </section>

                    <button type="submit" disabled={formLoading} className="w-full py-6 bg-[#D4AF37] text-[#0B0F19] font-black rounded-3xl uppercase tracking-widest shadow-2xl shadow-[#D4AF37]/20 flex items-center justify-center gap-4 transition-all hover:scale-[1.02]">
                       {formLoading ? <Loader2 className="animate-spin" /> : <Save />} Enregistrer les Modifications
                    </button>
                 </div>
              </motion.form>
            )}

            {activeTab === "podcasts" && (
              <div className="grid grid-cols-1 gap-4">
                 {podcasts.map(p => (
                   <div key={p.id} className="bg-[#0B0F19] p-6 rounded-3xl border border-white/5 flex items-center justify-between group">
                      <div className="flex items-center gap-6">
                         <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center"><Music size={20} /></div>
                         <div><h4 className="font-black uppercase text-sm tracking-tight">{p.title}</h4><p className="text-[10px] text-gray-500 font-bold uppercase">{p.category} • {p.duration}</p></div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                         <button onClick={() => handleEditPodcast(p)} className="p-3 bg-white/5 rounded-xl hover:text-blue-400"><Pencil size={16} /></button>
                         <button onClick={() => handleDeletePodcast(p)} className="p-3 bg-white/5 rounded-xl hover:text-red-400"><Trash2 size={16} /></button>
                      </div>
                   </div>
                 ))}
              </div>
            )}

            {activeTab === "articles" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {articles.map(a => (
                   <div key={a.id} className="bg-[#0B0F19] p-6 rounded-[32px] border border-white/5 flex flex-col gap-4 group">
                      {a.image_url && <img src={a.image_url} className="w-full h-48 object-cover rounded-2xl" alt="" />}
                      <div className="flex justify-between items-start">
                         <h4 className="font-black uppercase text-sm tracking-tight">{a.title}</h4>
                         <div className="flex gap-2">
                            <button onClick={() => handleEditArticle(a)} className="text-gray-500 hover:text-blue-400"><Pencil size={16} /></button>
                            <button onClick={() => handleDeleteArticle(a)} className="text-gray-500 hover:text-red-400"><Trash2 size={16} /></button>
                         </div>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-3">{a.content}</p>
                   </div>
                 ))}
              </div>
            )}

            {activeTab === "sourates" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {sourates.map(s => (
                   <div key={s.id} className="bg-[#0B0F19] p-8 rounded-[32px] border border-white/5 relative group">
                      <div className="text-3xl font-black text-[#D4AF37] mb-4 text-right">{s.name_ar}</div>
                      <h4 className="font-black uppercase text-sm">{s.name_fr}</h4>
                      <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                         <button onClick={() => handleEditSourate(s)} className="p-2 bg-white/5 rounded-lg"><Pencil size={14} /></button>
                         <button onClick={() => handleDeleteSourate(s)} className="p-2 bg-white/5 rounded-lg"><Trash2 size={14} /></button>
                      </div>
                   </div>
                 ))}
              </div>
            )}

            {activeTab === "messages" && (
              <div className="space-y-4">
                 {messages.map(m => (
                   <div key={m.id} className={`bg-[#0B0F19] p-8 rounded-[40px] border border-white/5 flex justify-between items-start ${!m.is_read ? 'border-l-4 border-l-[#D4AF37]' : ''}`}>
                      <div className="space-y-4">
                         <div className="flex items-center gap-4">
                            <h4 className="text-xl font-black">{m.name}</h4>
                            <span className="text-[10px] text-gray-600 font-bold uppercase">{new Date(m.created_at).toLocaleDateString()}</span>
                         </div>
                         <p className="text-[#D4AF37] font-black uppercase text-[10px] tracking-widest">Sujet: {m.subject}</p>
                         <p className="text-gray-400 text-sm leading-relaxed">{m.message}</p>
                         <p className="text-xs font-bold text-gray-500">{m.email}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                         {!m.is_read && <button onClick={() => markMessageAsRead(m.id)} className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl"><CheckCircle2 size={20} /></button>}
                         <button onClick={() => deleteMessage(m.id)} className="p-4 bg-red-500/10 text-red-400 rounded-2xl"><Trash2 size={20} /></button>
                      </div>
                   </div>
                 ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFormOpen(false)} className="absolute inset-0 bg-[#070A11]/95 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative z-10 w-full max-w-4xl bg-[#0B0F19] rounded-[48px] border border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                 <h3 className="text-3xl font-black uppercase tracking-tighter">{editingId ? "Éditer" : "Ajouter"} Contenu</h3>
                 <button onClick={() => setIsFormOpen(false)} className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center"><X /></button>
              </div>
              <div className="p-10 overflow-y-auto custom-scrollbar">
                 <form onSubmit={(e) => {
                   if (activeTab === "podcasts") handlePodcastSubmit(e);
                   else if (activeTab === "articles") handleArticleSubmit(e);
                   else if (activeTab === "sourates") handleSourateSubmit(e);
                   else if (activeTab === "grille") handleGrilleSubmit(e);
                 }} className="space-y-8">
                    {activeTab === "podcasts" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <input type="text" value={podcastFormData.title} onChange={e => setPodcastFormData({...podcastFormData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6" placeholder="Titre" required />
                         <select value={podcastFormData.category} onChange={e => setPodcastFormData({...podcastFormData, category: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white">
                            {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0B0F19]">{c}</option>)}
                         </select>
                         <input type="text" value={podcastFormData.duration} onChange={e => setPodcastFormData({...podcastFormData, duration: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6" placeholder="Durée (ex: 45:00)" required />
                         <input type="date" value={podcastFormData.date} onChange={e => setPodcastFormData({...podcastFormData, date: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6" required />
                         <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-4">Fichier MP3</label>
                            <input type="file" onChange={e => setUploadFile(e.target.files?.[0] || null)} className="w-full bg-white/5 border border-dashed border-white/20 rounded-2xl p-8 text-center" />
                         </div>
                      </div>
                    )}
                    {activeTab === "articles" && (
                      <div className="space-y-8">
                         <input type="text" value={articleFormData.title} onChange={e => setArticleFormData({...articleFormData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6" placeholder="Titre Article" required />
                         <textarea value={articleFormData.content} onChange={e => setArticleFormData({...articleFormData, content: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 h-64" placeholder="Contenu" required />
                         <div>
                            <label className="block text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-4">Image de l'article</label>
                            <input type="file" onChange={e => setUploadFile(e.target.files?.[0] || null)} className="w-full bg-white/5 border border-dashed border-white/20 rounded-2xl p-8 text-center" />
                         </div>
                      </div>
                    )}
                    {activeTab === "sourates" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <input type="number" value={sourateFormData.number} onChange={e => setSourateFormData({...sourateFormData, number: parseInt(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6" placeholder="Numéro" required />
                         <input type="text" value={sourateFormData.name_ar} onChange={e => setSourateFormData({...sourateFormData, name_ar: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-right font-cairo text-xl" placeholder="Nom Arabe" required />
                         <input type="text" value={sourateFormData.name_fr} onChange={e => setSourateFormData({...sourateFormData, name_fr: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6" placeholder="Nom Français" required />
                         <textarea value={sourateFormData.translation_fr} onChange={e => setSourateFormData({...sourateFormData, translation_fr: e.target.value})} className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 h-32" placeholder="Traduction" />
                      </div>
                    )}
                    <button type="submit" disabled={formLoading} className="w-full py-5 bg-[#D4AF37] text-[#0B0F19] font-black rounded-2xl uppercase tracking-widest shadow-xl">
                       {formLoading ? <Loader2 className="animate-spin mx-auto" /> : (editingId ? "Actualiser" : "Confirmer")}
                    </button>
                 </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
