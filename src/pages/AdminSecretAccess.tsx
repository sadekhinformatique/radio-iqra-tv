import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { Lock, User, LogIn, LayoutDashboard, Plus, Pencil, Trash2, X, Music, Save, Loader2, FileText, Image as ImageIcon, BookOpen, Volume2, Clock, CalendarRange } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"podcasts" | "articles" | "sourates" | "grille" | "config">("podcasts");

  // Dashboard State
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [sourates, setSourates] = useState<Sourate[]>([]);
  const [grilleItems, setGrilleItems] = useState<GrilleItem[]>([]);
  const [siteConfig, setSiteConfig] = useState<any>(null);
  
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
    footer_text: "",
    primary_color: "#2e7d32",
    secondary_color: "#D4AF37",
    radio_stream_url: "",
  });

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Protection noindex
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  useEffect(() => {
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
      else fetchConfig();
    }
  }, [user, activeTab]);

  const fetchConfig = async () => {
    const { data, error } = await supabase
      .from('site_config')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (error) {
      console.error("Error fetching config:", error);
    } else if (data) {
      setSiteConfig(data);
      setConfigFormData({
        site_name: data.site_name || "",
        primary_phone: data.primary_phone || "",
        secondary_phone: data.secondary_phone || "",
        email: data.email || "",
        address: data.address || "",
        facebook_url: data.facebook_url || "",
        youtube_url: data.youtube_url || "",
        whatsapp_number: data.whatsapp_number || "",
        telegram_url: data.telegram_url || "",
        twitter_url: data.twitter_url || "",
        instagram_url: data.instagram_url || "",
        footer_text: data.footer_text || "",
        primary_color: data.primary_color || "#2e7d32",
        secondary_color: data.secondary_color || "#D4AF37",
        radio_stream_url: data.radio_stream_url || "",
      });
    }
  };

  const fetchPodcasts = async () => {
    const { data, error } = await supabase
      .from('podcasts')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error("Error fetching podcasts:", error);
    } else {
      setPodcasts(data || []);
    }
  };

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error("Error fetching articles:", error);
    } else {
      setArticles(data || []);
    }
  };

  const fetchSourates = async () => {
    const { data, error } = await supabase
      .from('sourates')
      .select('*')
      .order('number', { ascending: true });
    
    if (error) {
      console.error("Error fetching sourates:", error);
    } else {
      setSourates(data || []);
    }
  };

  const fetchGrille = async () => {
    const { data, error } = await supabase
      .from('grille')
      .select('*')
      .order('day', { ascending: true })
      .order('start_time', { ascending: true });
    
    if (error) {
      console.error("Error fetching grille:", error);
    } else {
      setGrilleItems(data || []);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const resetForm = () => {
    setPodcastFormData({
      title: "",
      category: "Prêche",
      date: new Date().toISOString().split('T')[0],
      duration: "",
    });
    setArticleFormData({
      title: "",
      content: "",
      date: new Date().toISOString().split('T')[0],
    });
    setSourateFormData({
      number: sourates.length + 1,
      name_ar: "",
      name_fr: "",
      text_ar: "",
      translation_fr: "",
    });
    setGrilleFormData({
      day: "Lundi",
      start_time: "08:00",
      end_time: "09:00",
      title: "",
      description: "",
    });
    setUploadFile(null);
    setEditingId(null);
    setIsFormOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEditPodcast = (podcast: Podcast) => {
    setPodcastFormData({
      title: podcast.title || "",
      category: podcast.category || "Prêche",
      date: podcast.date || new Date().toISOString().split('T')[0],
      duration: podcast.duration || "",
    });
    setEditingId(podcast.id);
    setIsFormOpen(true);
  };

  const handleEditArticle = (article: Article) => {
    setArticleFormData({
      title: article.title || "",
      content: article.content || "",
      date: article.date || new Date().toISOString().split('T')[0],
    });
    setEditingId(article.id);
    setIsFormOpen(true);
  };

  const handleEditSourate = (sourate: Sourate) => {
    setSourateFormData({
      number: sourate.number,
      name_ar: sourate.name_ar || "",
      name_fr: sourate.name_fr || "",
      text_ar: sourate.text_ar || "",
      translation_fr: sourate.translation_fr || "",
    });
    setEditingId(sourate.id);
    setIsFormOpen(true);
  };

  const handleEditGrille = (item: GrilleItem) => {
    setGrilleFormData({
      day: item.day || "Lundi",
      start_time: item.start_time || "08:00",
      end_time: item.end_time || "09:00",
      title: item.title || "",
      description: item.description || "",
    });
    setEditingId(item.id);
    setIsFormOpen(true);
  };

  const handleDeletePodcast = async (podcast: Podcast) => {
    if (!window.confirm(`Supprimer le podcast "${podcast.title}" ?`)) return;

    try {
      if (podcast.audio_url.includes('podcasts-audio')) {
        const parts = podcast.audio_url.split('/');
        const filePath = parts[parts.length - 1];
        if (filePath) {
          await supabase.storage.from('podcasts-audio').remove([filePath]);
        }
      }

      const { error } = await supabase.from('podcasts').delete().eq('id', podcast.id);
      if (error) throw error;

      setStatusMsg({ type: "success", text: "Podcast supprimé avec succès" });
      fetchPodcasts();
    } catch (err: any) {
      setStatusMsg({ type: "error", text: "Erreur lors de la suppression: " + err.message });
    }
  };

  const handleDeleteArticle = async (article: Article) => {
    if (!window.confirm(`Supprimer l'article "${article.title}" ?`)) return;

    try {
      if (article.image_url.includes('articles-images')) {
        const parts = article.image_url.split('/');
        const filePath = parts[parts.length - 1];
        if (filePath) {
          await supabase.storage.from('articles-images').remove([filePath]);
        }
      }

      const { error } = await supabase.from('articles').delete().eq('id', article.id);
      if (error) throw error;

      setStatusMsg({ type: "success", text: "Article supprimé avec succès" });
      fetchArticles();
    } catch (err: any) {
      setStatusMsg({ type: "error", text: "Erreur lors de la suppression: " + err.message });
    }
  };

  const handleDeleteSourate = async (sourate: Sourate) => {
    if (!window.confirm(`Supprimer la sourate "${sourate.name_fr}" ?`)) return;

    try {
      if (sourate.audio_url && sourate.audio_url.includes('sourates-audio')) {
        const parts = sourate.audio_url.split('/');
        const filePath = parts[parts.length - 1];
        if (filePath) {
          await supabase.storage.from('sourates-audio').remove([filePath]);
        }
      }

      const { error } = await supabase.from('sourates').delete().eq('id', sourate.id);
      if (error) throw error;

      setStatusMsg({ type: "success", text: "Sourate supprimée avec succès" });
      fetchSourates();
    } catch (err: any) {
      setStatusMsg({ type: "error", text: "Erreur lors de la suppression: " + err.message });
    }
  };

  const handleDeleteGrille = async (item: GrilleItem) => {
    if (!window.confirm(`Supprimer l'émission "${item.title}" ?`)) return;

    try {
      const { error } = await supabase.from('grille').delete().eq('id', item.id);
      if (error) throw error;
      setStatusMsg({ type: "success", text: "Émission supprimée" });
      fetchGrille();
    } catch (err: any) {
      setStatusMsg({ type: "error", text: "Erreur: " + err.message });
    }
  };

  const handlePodcastSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setStatusMsg({ type: "", text: "" });

    try {
      let audioUrl = "";
      if (uploadFile) {
        const fileExt = uploadFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('podcasts-audio')
          .upload(fileName, uploadFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('podcasts-audio').getPublicUrl(fileName);
        audioUrl = publicUrl;
      }

      if (editingId) {
        const updateData: any = { ...podcastFormData };
        if (audioUrl) updateData.audio_url = audioUrl;
        const { error } = await supabase.from('podcasts').update(updateData).eq('id', editingId);
        if (error) throw error;
        setStatusMsg({ type: "success", text: "Podcast mis à jour !" });
      } else {
        if (!audioUrl) throw new Error("Un fichier MP3 est requis");
        const { error } = await supabase.from('podcasts').insert([{ ...podcastFormData, audio_url: audioUrl }]);
        if (error) throw error;
        setStatusMsg({ type: "success", text: "Podcast ajouté !" });
      }
      resetForm();
      fetchPodcasts();
    } catch (err: any) {
      setStatusMsg({ type: "error", text: "Erreur: " + err.message });
    } finally {
      setFormLoading(false);
    }
  };

  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setStatusMsg({ type: "", text: "" });

    try {
      let imageUrl = "";
      if (uploadFile) {
        const fileExt = uploadFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('articles-images')
          .upload(fileName, uploadFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('articles-images').getPublicUrl(fileName);
        imageUrl = publicUrl;
      }

      if (editingId) {
        const updateData: any = { ...articleFormData };
        if (imageUrl) updateData.image_url = imageUrl;
        const { error } = await supabase.from('articles').update(updateData).eq('id', editingId);
        if (error) throw error;
        setStatusMsg({ type: "success", text: "Article mis à jour !" });
      } else {
        if (!imageUrl) throw new Error("Une image est requise");
        const { error } = await supabase.from('articles').insert([{ ...articleFormData, image_url: imageUrl }]);
        if (error) throw error;
        setStatusMsg({ type: "success", text: "Article ajouté !" });
      }
      resetForm();
      fetchArticles();
    } catch (err: any) {
      setStatusMsg({ type: "error", text: "Erreur: " + err.message });
    } finally {
      setFormLoading(false);
    }
  };

  const handleSourateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setStatusMsg({ type: "", text: "" });

    try {
      let audioUrl = "";
      if (uploadFile) {
        const fileExt = uploadFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('sourates-audio')
          .upload(fileName, uploadFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('sourates-audio').getPublicUrl(fileName);
        audioUrl = publicUrl;
      }

      if (editingId) {
        const updateData: any = { ...sourateFormData };
        if (audioUrl) updateData.audio_url = audioUrl;
        const { error } = await supabase.from('sourates').update(updateData).eq('id', editingId);
        if (error) throw error;
        setStatusMsg({ type: "success", text: "Sourate mise à jour !" });
      } else {
        const { error } = await supabase.from('sourates').insert([{ ...sourateFormData, audio_url: audioUrl || "" }]);
        if (error) throw error;
        setStatusMsg({ type: "success", text: "Sourate ajoutée !" });
      }
      resetForm();
      fetchSourates();
    } catch (err: any) {
      setStatusMsg({ type: "error", text: "Erreur: " + err.message });
    } finally {
      setFormLoading(false);
    }
  };

  const handleGrilleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setStatusMsg({ type: "", text: "" });

    try {
      if (editingId) {
        const { error } = await supabase.from('grille').update(grilleFormData).eq('id', editingId);
        if (error) throw error;
        setStatusMsg({ type: "success", text: "Grille mise à jour !" });
      } else {
        const { error } = await supabase.from('grille').insert([grilleFormData]);
        if (error) throw error;
        setStatusMsg({ type: "success", text: "Émission ajoutée !" });
      }
      resetForm();
      fetchGrille();
    } catch (err: any) {
      setStatusMsg({ type: "error", text: "Erreur: " + err.message });
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setStatusMsg({ type: "", text: "" });

    try {
      const updateData = { ...configFormData, updated_at: new Date().toISOString() };
      
      const { error } = await supabase
        .from('site_config')
        .update(updateData)
        .eq('id', 1);

      if (error) throw error;
      
      setStatusMsg({ type: "success", text: "Configuration enregistrée !" });
      fetchConfig();
    } catch (err: any) {
      setStatusMsg({ type: "error", text: "Erreur: " + err.message });
    } finally {
      setFormLoading(false);
    }
  };

  const handleAssetUpload = async (file: File, type: 'logos' | 'favicons') => {
    if (!file) return;
    setFormLoading(true);
    setStatusMsg({ type: "", text: "" });

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}-${Date.now()}.${fileExt}`;
      const filePath = `${type}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('site-assets').getPublicUrl(filePath);
      
      const updateKey = type === 'logos' ? 'logo_url' : 'favicon_url';
      const { error: dbError } = await supabase
        .from('site_config')
        .update({ [updateKey]: publicUrl })
        .eq('id', 1);

      if (dbError) throw dbError;

      setStatusMsg({ type: "success", text: `${type === 'logos' ? 'Logo' : 'Favicon'} mis à jour !` });
      fetchConfig();
    } catch (err: any) {
      setStatusMsg({ type: "error", text: "Erreur upload: " + err.message });
    } finally {
      setFormLoading(false);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col p-4 md:p-8">
        <header className="max-w-6xl w-full mx-auto flex flex-col md:flex-row justify-between items-center mb-6 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-iqra-gold/10 text-iqra-gold rounded-2xl flex items-center justify-center shadow-sm">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-iqra-green">Dashboard Admin</h1>
              <p className="text-gray-400 text-sm font-medium">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {activeTab !== "config" && (
              <button 
                onClick={() => setIsFormOpen(true)}
                className="px-6 py-3 bg-iqra-gold text-iqra-green font-bold rounded-2xl flex items-center gap-2 hover:scale-105 transition-all shadow-lg text-sm"
              >
                <Plus size={18} /> Nouveau {activeTab === "podcasts" ? "Podcast" : activeTab === "articles" ? "Article" : activeTab === "sourates" ? "Sourate" : "Émission"}
              </button>
            )}
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-gray-400 hover:text-red-500 font-bold uppercase tracking-widest text-[10px] transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="max-w-6xl w-full mx-auto flex border-b border-gray-200 mb-8">
          <button 
            onClick={() => setActiveTab("podcasts")}
            className={`px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${
              activeTab === "podcasts" ? "border-iqra-gold text-iqra-green" : "border-transparent text-gray-400"
            }`}
          >
            <div className="flex items-center gap-2">
              <Music size={16} /> Podcasts
            </div>
          </button>
          <button 
            onClick={() => setActiveTab("articles")}
            className={`px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${
              activeTab === "articles" ? "border-iqra-gold text-iqra-green" : "border-transparent text-gray-400"
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText size={16} /> Articles (Conseils)
            </div>
          </button>
          <button 
            onClick={() => setActiveTab("sourates")}
            className={`px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${
              activeTab === "sourates" ? "border-iqra-gold text-iqra-green" : "border-transparent text-gray-400"
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen size={16} /> Coran
            </div>
          </button>
          <button 
            onClick={() => setActiveTab("grille")}
            className={`px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${
              activeTab === "grille" ? "border-iqra-gold text-iqra-green" : "border-transparent text-gray-400"
            }`}
          >
            <div className="flex items-center gap-2">
              <CalendarRange size={16} /> Grille
            </div>
          </button>
          <button 
            onClick={() => setActiveTab("config")}
            className={`px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${
              activeTab === "config" ? "border-iqra-gold text-iqra-green" : "border-transparent text-gray-400"
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock size={16} /> Configuration
            </div>
          </button>
        </div>

        <main className="max-w-6xl w-full mx-auto flex-grow">
          {statusMsg.text && (
            <div className={`mb-8 p-4 rounded-2xl text-sm font-bold text-center border animate-in fade-in slide-in-from-top-4 duration-300 ${
              statusMsg.type === "success" ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"
            }`}>
              {statusMsg.text}
            </div>
          )}

          {activeTab === "podcasts" ? (
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Podcast</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Catégorie</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-medium text-gray-600">
                    {podcasts.map(podcast => (
                      <tr key={podcast.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-iqra-green/5 text-iqra-green rounded-lg flex items-center justify-center">
                              <Music size={14} />
                            </div>
                            <span className="text-iqra-green font-bold text-sm truncate max-w-[200px]">{podcast.title}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <span className="px-2 py-1 bg-gray-100 rounded-md text-[10px] font-bold text-gray-500 uppercase">{podcast.category}</span>
                        </td>
                        <td className="px-8 py-4 text-xs font-mono">{podcast.date}</td>
                        <td className="px-8 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleEditPodcast(podcast)} className="p-2 text-gray-400 hover:text-iqra-green hover:bg-iqra-green/5 rounded-lg transition-all">
                              <Pencil size={18} />
                            </button>
                            <button onClick={() => handleDeletePodcast(podcast)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === "articles" ? (
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Article</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-medium text-gray-600">
                    {articles.map(article => (
                      <tr key={article.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                              <img src={article.image_url} alt="" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-iqra-green font-bold text-sm truncate max-w-[200px]">{article.title}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4 text-xs font-mono">{article.date}</td>
                        <td className="px-8 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleEditArticle(article)} className="p-2 text-gray-400 hover:text-iqra-green hover:bg-iqra-green/5 rounded-lg transition-all">
                              <Pencil size={18} />
                            </button>
                            <button onClick={() => handleDeleteArticle(article)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === "sourates" ? (
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sourate</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">N°</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-medium text-gray-600">
                    {sourates.map(sourate => (
                      <tr key={sourate.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-4">
                          <div className="flex flex-col">
                            <span className="text-iqra-green font-bold text-sm">{sourate.name_fr}</span>
                            <span className="text-xs text-gray-400 font-serif" dir="rtl">{sourate.name_ar}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4 text-xs font-mono">{sourate.number}</td>
                        <td className="px-8 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleEditSourate(sourate)} className="p-2 text-gray-400 hover:text-iqra-green hover:bg-iqra-green/5 rounded-lg transition-all">
                              <Pencil size={18} />
                            </button>
                            <button onClick={() => handleDeleteSourate(sourate)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === "config" ? (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Assets Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center gap-6">
                   <h3 className="text-xl font-bold text-iqra-green">Logo du site</h3>
                   <div className="w-48 h-48 bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200 overflow-hidden">
                      {siteConfig?.logo_url ? (
                        <img src={siteConfig.logo_url} alt="Logo" className="max-w-full max-h-full object-contain" />
                      ) : (
                        <ImageIcon size={48} className="text-gray-300" />
                      )}
                   </div>
                   <input 
                    type="file" 
                    accept="image/*" 
                    onChange={e => e.target.files?.[0] && handleAssetUpload(e.target.files[0], 'logos')}
                    className="hidden" 
                    id="logo-upload" 
                   />
                   <label htmlFor="logo-upload" className="px-6 py-2 bg-iqra-gold text-iqra-green font-bold rounded-xl cursor-pointer hover:bg-iqra-gold/80 transition-colors text-sm">
                     {formLoading ? "Chargement..." : "Changer le logo"}
                   </label>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center gap-6">
                   <h3 className="text-xl font-bold text-iqra-green">Favicon</h3>
                   <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200 overflow-hidden">
                      {siteConfig?.favicon_url ? (
                        <img src={siteConfig.favicon_url} alt="Favicon" className="w-12 h-12 object-contain" />
                      ) : (
                        <ImageIcon size={24} className="text-gray-300" />
                      )}
                   </div>
                   <input 
                    type="file" 
                    accept="image/x-icon,image/png,image/svg+xml" 
                    onChange={e => e.target.files?.[0] && handleAssetUpload(e.target.files[0], 'favicons')}
                    className="hidden" 
                    id="favicon-upload" 
                   />
                   <label htmlFor="favicon-upload" className="px-6 py-2 bg-iqra-gold text-iqra-green font-bold rounded-xl cursor-pointer hover:bg-iqra-gold/80 transition-colors text-sm">
                     {formLoading ? "Chargement..." : "Changer le favicon"}
                   </label>
                </div>
              </div>

              {/* Main Config Form */}
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <form onSubmit={handleConfigSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* General Info */}
                    <div className="md:col-span-2">
                       <h3 className="text-sm font-bold text-iqra-gold uppercase tracking-widest mb-4 border-l-4 border-iqra-gold pl-4">Informations Générales</h3>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Nom du site</label>
                      <input type="text" value={configFormData.site_name} onChange={e => setConfigFormData({...configFormData, site_name: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-iqra-gold outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Stream Radio URL</label>
                      <input type="text" value={configFormData.radio_stream_url} onChange={e => setConfigFormData({...configFormData, radio_stream_url: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-iqra-gold outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Couleur Primaire</label>
                      <div className="flex gap-4">
                        <input type="color" value={configFormData.primary_color} onChange={e => setConfigFormData({...configFormData, primary_color: e.target.value})} className="w-12 h-12 rounded-lg cursor-pointer border-none" />
                        <input type="text" value={configFormData.primary_color} onChange={e => setConfigFormData({...configFormData, primary_color: e.target.value})} className="flex-grow bg-gray-50 border border-gray-100 rounded-2xl px-4 text-xs font-mono" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Couleur Secondaire</label>
                      <div className="flex gap-4">
                        <input type="color" value={configFormData.secondary_color} onChange={e => setConfigFormData({...configFormData, secondary_color: e.target.value})} className="w-12 h-12 rounded-lg cursor-pointer border-none" />
                        <input type="text" value={configFormData.secondary_color} onChange={e => setConfigFormData({...configFormData, secondary_color: e.target.value})} className="flex-grow bg-gray-50 border border-gray-100 rounded-2xl px-4 text-xs font-mono" />
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="md:col-span-2 pt-4">
                       <h3 className="text-sm font-bold text-iqra-gold uppercase tracking-widest mb-4 border-l-4 border-iqra-gold pl-4">Coordonnées</h3>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Téléphone Principal</label>
                      <input type="text" value={configFormData.primary_phone} onChange={e => setConfigFormData({...configFormData, primary_phone: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-iqra-gold outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Téléphone Secondaire</label>
                      <input type="text" value={configFormData.secondary_phone} onChange={e => setConfigFormData({...configFormData, secondary_phone: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-iqra-gold outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Email</label>
                      <input type="email" value={configFormData.email} onChange={e => setConfigFormData({...configFormData, email: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-iqra-gold outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Adresse Physique</label>
                      <input type="text" value={configFormData.address} onChange={e => setConfigFormData({...configFormData, address: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-iqra-gold outline-none transition-all" />
                    </div>

                    {/* Social networks */}
                    <div className="md:col-span-2 pt-4">
                       <h3 className="text-sm font-bold text-iqra-gold uppercase tracking-widest mb-4 border-l-4 border-iqra-gold pl-4">Réseaux Sociaux</h3>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Facebook URL</label>
                      <input type="text" value={configFormData.facebook_url} onChange={e => setConfigFormData({...configFormData, facebook_url: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-iqra-gold outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">YouTube URL</label>
                      <input type="text" value={configFormData.youtube_url} onChange={e => setConfigFormData({...configFormData, youtube_url: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-iqra-gold outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">WhatsApp (Numéro)</label>
                      <input type="text" value={configFormData.whatsapp_number} onChange={e => setConfigFormData({...configFormData, whatsapp_number: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-iqra-gold outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Telegram URL</label>
                      <input type="text" value={configFormData.telegram_url} onChange={e => setConfigFormData({...configFormData, telegram_url: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-iqra-gold outline-none transition-all" />
                    </div>

                    {/* Footer */}
                    <div className="md:col-span-2 pt-4">
                       <h3 className="text-sm font-bold text-iqra-gold uppercase tracking-widest mb-4 border-l-4 border-iqra-gold pl-4">Pied de page</h3>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Texte du footer</label>
                      <textarea rows={4} value={configFormData.footer_text} onChange={e => setConfigFormData({...configFormData, footer_text: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-iqra-gold outline-none transition-all resize-none" />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 p-4 bg-gray-50 rounded-3xl">
                     <button type="submit" disabled={formLoading} className="px-8 py-4 bg-iqra-green text-white font-bold rounded-2xl shadow-xl hover:bg-iqra-green/90 transition-all flex items-center gap-2 disabled:opacity-50 uppercase tracking-widest text-sm">
                        {formLoading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Enregistrer la configuration</>}
                     </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Émission</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Jour</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Horaire</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-medium text-gray-600">
                    {grilleItems.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-4">
                          <span className="text-iqra-green font-bold text-sm">{item.title}</span>
                        </td>
                        <td className="px-8 py-4">
                          <span className="text-xs">{item.day}</span>
                        </td>
                        <td className="px-8 py-4 text-xs font-mono">
                          {item.start_time} - {item.end_time}
                        </td>
                        <td className="px-8 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleEditGrille(item)} className="p-2 text-gray-400 hover:text-iqra-green hover:bg-iqra-green/5 rounded-lg transition-all">
                              <Pencil size={18} />
                            </button>
                            <button onClick={() => handleDeleteGrille(item)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>

        {/* Modal Form */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-iqra-green/20 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-serif font-bold text-iqra-green">
                  {editingId ? "Modifier" : "Ajouter"} {activeTab === "podcasts" ? "un podcast" : activeTab === "articles" ? "un article" : activeTab === "sourates" ? "une sourate" : "une émission"}
                </h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={24} />
                </button>
              </div>

              {activeTab === "podcasts" ? (
                <form onSubmit={handlePodcastSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Titre</label>
                      <input type="text" required value={podcastFormData.title} onChange={e => setPodcastFormData({...podcastFormData, title: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-iqra-gold outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Catégorie</label>
                      <select value={podcastFormData.category} onChange={e => setPodcastFormData({...podcastFormData, category: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-iqra-gold outline-none transition-all">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Date</label>
                      <input type="date" required value={podcastFormData.date} onChange={e => setPodcastFormData({...podcastFormData, date: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-iqra-gold outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Durée (ex: 25:10)</label>
                      <input type="text" required value={podcastFormData.duration} onChange={e => setPodcastFormData({...podcastFormData, duration: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-iqra-gold outline-none transition-all" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Fichier MP3</label>
                      <input type="file" accept="audio/*" ref={fileInputRef} onChange={e => setUploadFile(e.target.files?.[0] || null)} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-iqra-gold/10 file:text-iqra-gold hover:file:bg-iqra-gold/20" />
                    </div>
                  </div>
                  <button type="submit" disabled={formLoading} className="w-full bg-iqra-green text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-iqra-green/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-widest text-sm">
                    {formLoading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Enregistrer</>}
                  </button>
                </form>
              ) : activeTab === "articles" ? (
                <form onSubmit={handleArticleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Titre</label>
                    <input type="text" required value={articleFormData.title} onChange={e => setArticleFormData({...articleFormData, title: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-iqra-gold outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Contenu</label>
                    <textarea required rows={5} value={articleFormData.content} onChange={e => setArticleFormData({...articleFormData, content: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-iqra-gold outline-none transition-all resize-none" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Date</label>
                      <input type="date" required value={articleFormData.date} onChange={e => setArticleFormData({...articleFormData, date: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-iqra-gold outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Image</label>
                      <input type="file" accept="image/*" ref={fileInputRef} onChange={e => setUploadFile(e.target.files?.[0] || null)} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-iqra-gold/10 file:text-iqra-gold hover:file:bg-iqra-gold/20" />
                    </div>
                  </div>
                  <button type="submit" disabled={formLoading} className="w-full bg-iqra-green text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-iqra-green/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-widest text-sm">
                    {formLoading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Enregistrer</>}
                  </button>
                </form>
              ) : activeTab === "sourates" ? (
                <form onSubmit={handleSourateSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Numéro</label>
                      <input type="number" required value={sourateFormData.number} onChange={e => setSourateFormData({...sourateFormData, number: parseInt(e.target.value)})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-iqra-gold outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Nom Arabe</label>
                      <input type="text" required value={sourateFormData.name_ar} dir="rtl" onChange={e => setSourateFormData({...sourateFormData, name_ar: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-iqra-gold outline-none transition-all font-serif" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Nom Français</label>
                      <input type="text" required value={sourateFormData.name_fr} onChange={e => setSourateFormData({...sourateFormData, name_fr: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-iqra-gold outline-none transition-all" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Texte Arabe</label>
                      <textarea required rows={4} dir="rtl" value={sourateFormData.text_ar} onChange={e => setSourateFormData({...sourateFormData, text_ar: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-iqra-gold outline-none transition-all resize-none font-serif text-xl" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Traduction Française</label>
                      <textarea required rows={4} value={sourateFormData.translation_fr} onChange={e => setSourateFormData({...sourateFormData, translation_fr: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-iqra-gold outline-none transition-all resize-none" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Fichier Audio</label>
                      <input type="file" accept="audio/*" ref={fileInputRef} onChange={e => setUploadFile(e.target.files?.[0] || null)} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-iqra-gold/10 file:text-iqra-gold hover:file:bg-iqra-gold/20" />
                    </div>
                  </div>
                  <button type="submit" disabled={formLoading} className="w-full bg-iqra-green text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-iqra-green/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-widest text-sm">
                    {formLoading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Enregistrer</>}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleGrilleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Jour</label>
                      <select value={grilleFormData.day} onChange={e => setGrilleFormData({...grilleFormData, day: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-iqra-gold outline-none transition-all">
                        {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Titre</label>
                      <input type="text" required value={grilleFormData.title} onChange={e => setGrilleFormData({...grilleFormData, title: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-iqra-gold outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Début (ex: 08:00)</label>
                      <input type="time" required value={grilleFormData.start_time} onChange={e => setGrilleFormData({...grilleFormData, start_time: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-iqra-gold outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Fin (ex: 09:30)</label>
                      <input type="time" required value={grilleFormData.end_time} onChange={e => setGrilleFormData({...grilleFormData, end_time: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-iqra-gold outline-none transition-all" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Description</label>
                      <textarea rows={3} value={grilleFormData.description} onChange={e => setGrilleFormData({...grilleFormData, description: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-iqra-gold outline-none transition-all resize-none" />
                    </div>
                  </div>
                  <button type="submit" disabled={formLoading} className="w-full bg-iqra-green text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-iqra-green/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-widest text-sm">
                    {formLoading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Enregistrer</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-iqra-gold text-iqra-green rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-serif font-bold text-iqra-green">Administration</h1>
          <p className="text-gray-400 text-sm mt-2">Zone sécurisée - Radio Iqra TV</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Email</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-iqra-gold transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-iqra-gold transition-all" />
            </div>
          </div>

          {error && <div className="p-4 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-100 text-center">{error}</div>}

          <button type="submit" disabled={loading} className="w-full bg-iqra-green text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-iqra-green/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-widest text-sm">
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><LogIn size={20} /> Se connecter</>}
          </button>
        </form>
      </div>
    </div>
  );
}

