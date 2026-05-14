import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, LogIn, LayoutDashboard, Plus, Pencil, Trash2, X, Music, 
  Save, Loader2, FileText, BookOpen, Clock, 
  CalendarRange, Mail, CheckCircle2, ChevronRight, AlertCircle
} from "lucide-react";

// Types
interface Message { id: string; name: string; email: string; subject: string; message: string; created_at: string; is_read: boolean; }
interface Podcast { id: string | number; title: string; category: string; date: string; duration: string; audio_url: string; }
interface Article { id: string | number; title: string; content: string; date: string; image_url: string; }
interface Sourate { id: string | number; number: number; name_ar: string; name_fr: string; text_ar: string; translation_fr: string; audio_url: string; }
interface GrilleItem { id: string; day: string; start_time: string; end_time: string; title: string; description: string; }

const CATEGORIES = ["Prêche", "Tafsir", "Hadith", "Conseils", "Émission culturelle"];
const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export default function AdminSecretAccess() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Data
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [sourates, setSourates] = useState<Sourate[]>([]);
  const [grilleItems, setGrilleItems] = useState<GrilleItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [configFormData, setConfigFormData] = useState<any>({});
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Form States
  const [podcastForm, setPodcastForm] = useState({ title: "", category: "Prêche", date: "", duration: "" });
  const [articleForm, setArticleForm] = useState({ title: "", content: "", date: "" });
  const [sourateForm, setSourateForm] = useState({ number: 1, name_ar: "", name_fr: "", text_ar: "", translation_fr: "" });
  const [grilleForm, setGrilleForm] = useState({ day: "Lundi", start_time: "08:00", end_time: "09:00", title: "", description: "" });

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) loadData();
  }, [user, activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === "dashboard" || activeTab === "messages") {
        const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
        setMessages(data || []);
      }
      if (activeTab === "dashboard" || activeTab === "podcasts") {
        const { data } = await supabase.from('podcasts').select('*').order('date', { ascending: false });
        setPodcasts(data || []);
      }
      if (activeTab === "dashboard" || activeTab === "articles") {
        const { data } = await supabase.from('articles').select('*').order('date', { ascending: false });
        setArticles(data || []);
      }
      if (activeTab === "dashboard" || activeTab === "sourates") {
        const { data } = await supabase.from('sourates').select('*').order('number', { ascending: true });
        setSourates(data || []);
      }
      if (activeTab === "grille") {
        const { data } = await supabase.from('grille').select('*').order('day', { ascending: true });
        setGrilleItems(data || []);
      }
      if (activeTab === "config") {
        const { data } = await supabase.from('site_config').select('*').eq('id', 1).maybeSingle();
        if (data) setConfigFormData(data);
      }
    } catch (e) { console.error(e); }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#070A11] flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-[#0B0F19] p-12 rounded-[48px] border border-white/5 shadow-3xl text-center">
           <div className="w-20 h-20 bg-gradient-to-br from-[#0F5132] to-[#D4AF37] rounded-3xl mx-auto flex items-center justify-center mb-8 shadow-2xl shadow-[#D4AF37]/10">
              <Lock size={32} className="text-white" />
           </div>
           <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-10">Administration</h1>
           <form onSubmit={handleLogin} className="space-y-6">
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-[#D4AF37]/50 transition-all" required />
              <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-[#D4AF37]/50 transition-all" required />
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-3"><AlertCircle size={16}/> {error}</div>}
              <button type="submit" disabled={loading} className="w-full py-5 bg-[#D4AF37] text-[#0B0F19] font-black rounded-2xl uppercase tracking-widest hover:scale-[1.02] transition-all">
                {loading ? <Loader2 className="animate-spin mx-auto" /> : "Connexion"}
              </button>
           </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A11] text-white flex overflow-hidden selection:bg-[#D4AF37] selection:text-[#0B0F19]">
      {/* Sidebar */}
      <aside className="w-80 bg-[#0B0F19] border-r border-white/5 flex flex-col shrink-0">
        <div className="p-10">
           <div className="flex items-center gap-4 mb-12">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F5132] to-[#D4AF37] flex items-center justify-center font-black">IQ</div>
              <h2 className="text-2xl font-black tracking-tighter">IQRA <span className="text-[#D4AF37]">CMS</span></h2>
           </div>
           <nav className="space-y-4">
              {[
                { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
                { id: "podcasts", label: "Podcasts", icon: Music },
                { id: "articles", label: "Blog", icon: FileText },
                { id: "sourates", label: "Coran", icon: BookOpen },
                { id: "grille", label: "Grille TV", icon: CalendarRange },
                { id: "messages", label: "Messages", icon: Mail, badge: messages.filter(m => !m.is_read).length },
                { id: "config", label: "Réglages", icon: Save },
              ].map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-[#D4AF37] text-[#0B0F19] font-black shadow-lg shadow-[#D4AF37]/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                  <div className="flex items-center gap-4"><item.icon size={20} /><span className="text-[11px] uppercase tracking-[0.2em]">{item.label}</span></div>
                  {item.badge ? <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-1 rounded-lg text-[10px] font-black">{item.badge}</span> : null}
                </button>
              ))}
           </nav>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="mt-auto p-10 text-red-400 text-[10px] uppercase font-black tracking-widest hover:bg-red-500/5 transition-all flex items-center gap-3"><LogIn size={16} /> Quitter</button>
      </aside>

      {/* Main Container */}
      <main className="flex-1 overflow-y-auto p-12 relative bg-gradient-to-br from-[#070A11] via-[#070A11] to-[#0F5132]/5">
         <div className="max-w-6xl mx-auto space-y-12">
            <header className="flex justify-between items-center">
               <h1 className="text-4xl font-black tracking-tight uppercase">{activeTab}</h1>
               {["podcasts", "articles", "sourates", "grille"].includes(activeTab) && (
                 <button onClick={() => { setEditingId(null); setIsFormOpen(true); }} className="px-8 py-4 bg-[#D4AF37] text-[#0B0F19] font-black rounded-2xl flex items-center gap-3 uppercase text-[10px] tracking-widest shadow-xl shadow-[#D4AF37]/20 hover:scale-105 transition-all"><Plus size={18} /> Ajouter</button>
               )}
            </header>

            <AnimatePresence mode="wait">
               {activeTab === "dashboard" && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                      { l: "Podcasts", v: podcasts.length, i: Music, c: "text-emerald-400" },
                      { l: "Articles", v: articles.length, i: FileText, c: "text-[#D4AF37]" },
                      { l: "Coran", v: sourates.length, i: BookOpen, c: "text-blue-400" },
                      { l: "Messages", v: messages.length, i: Mail, c: "text-purple-400" },
                    ].map((s, idx) => (
                      <div key={idx} className="bg-[#0B0F19] p-10 rounded-[40px] border border-white/5 relative overflow-hidden group">
                         <s.i size={24} className={`${s.c} mb-6`} />
                         <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{s.l}</p>
                         <p className="text-4xl font-black">{s.v}</p>
                         <s.i size={100} className={`absolute -right-4 -bottom-4 ${s.c} opacity-[0.03] group-hover:opacity-[0.1] transition-all`} />
                      </div>
                    ))}
                 </motion.div>
               )}

               {activeTab === "podcasts" && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    {podcasts.map(p => (
                      <div key={p.id} className="bg-[#0B0F19] p-6 rounded-3xl border border-white/5 flex items-center justify-between group">
                         <div className="flex items-center gap-6">
                            <Music size={20} className="text-[#D4AF37]" />
                            <div><h4 className="font-black uppercase text-sm">{p.title}</h4><p className="text-[10px] text-gray-500 font-bold uppercase">{p.category} • {p.date}</p></div>
                         </div>
                         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => { setEditingId(p.id); setPodcastForm(p as any); setIsFormOpen(true); }} className="p-3 bg-white/5 rounded-xl hover:text-blue-400 transition-colors"><Pencil size={16} /></button>
                            <button onClick={async () => { if(confirm("Supprimer ?")) { await supabase.from('podcasts').delete().eq('id', p.id); loadData(); } }} className="p-3 bg-white/5 rounded-xl hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                         </div>
                      </div>
                    ))}
                 </motion.div>
               )}

               {activeTab === "messages" && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    {messages.map(m => (
                      <div key={m.id} className={`bg-[#0B0F19] p-8 rounded-[40px] border border-white/5 ${!m.is_read ? 'border-l-4 border-l-[#D4AF37]' : ''}`}>
                         <div className="flex justify-between items-start mb-4">
                            <div><h4 className="text-xl font-black">{m.name}</h4><p className="text-xs text-gray-500 font-bold">{m.email}</p></div>
                            <span className="text-[10px] font-mono text-gray-700">{new Date(m.created_at).toLocaleString()}</span>
                         </div>
                         <p className="text-[#D4AF37] text-[10px] font-black uppercase mb-3 tracking-widest">{m.subject}</p>
                         <p className="text-gray-400 text-sm leading-relaxed mb-6">{m.message}</p>
                         <div className="flex gap-3">
                            {!m.is_read && <button onClick={async () => { await supabase.from('contact_messages').update({ is_read: true }).eq('id', m.id); loadData(); }} className="px-5 py-2 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-lg uppercase">Marquer Lu</button>}
                            <button onClick={async () => { if(confirm("Supprimer ?")) { await supabase.from('contact_messages').delete().eq('id', m.id); loadData(); } }} className="px-5 py-2 bg-red-500/10 text-red-400 text-[10px] font-black rounded-lg uppercase">Supprimer</button>
                         </div>
                      </div>
                    ))}
                 </motion.div>
               )}

               {activeTab === "config" && (
                 <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={async (e) => {
                    e.preventDefault(); setFormLoading(true);
                    await supabase.from('site_config').update(configFormData).eq('id', 1);
                    setFormLoading(false); loadData();
                 }} className="bg-[#0B0F19] p-12 rounded-[56px] border border-white/5 space-y-12 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2"><label className="text-[10px] font-black text-gray-500 uppercase">Nom du Site</label><input type="text" value={configFormData.site_name || ""} onChange={e => setConfigFormData({...configFormData, site_name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5" /></div>
                       <div className="space-y-2"><label className="text-[10px] font-black text-gray-500 uppercase">Email Contact</label><input type="text" value={configFormData.email || ""} onChange={e => setConfigFormData({...configFormData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5" /></div>
                       <textarea value={configFormData.hero_subtitle || ""} onChange={e => setConfigFormData({...configFormData, hero_subtitle: e.target.value})} className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5 h-32" placeholder="Sous-titre Accueil" />
                       <input type="text" value={configFormData.daily_quote || ""} onChange={e => setConfigFormData({...configFormData, daily_quote: e.target.value})} className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5" placeholder="Citation du jour" />
                    </div>
                    <button type="submit" disabled={formLoading} className="w-full py-6 bg-[#D4AF37] text-[#0B0F19] font-black rounded-3xl uppercase tracking-widest shadow-2xl flex items-center justify-center gap-4 hover:scale-[1.01] transition-all">
                       {formLoading ? <Loader2 className="animate-spin" /> : <Save />} Enregistrer les Modifications
                    </button>
                 </motion.form>
               )}
            </AnimatePresence>
         </div>
      </main>

      {/* Form Overlay */}
      <AnimatePresence>
         {isFormOpen && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFormOpen(false)} className="absolute inset-0 bg-[#070A11]/95 backdrop-blur-xl" />
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative z-10 w-full max-w-xl bg-[#0B0F19] rounded-[48px] border border-white/10 overflow-hidden flex flex-col shadow-3xl">
                 <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                    <h3 className="text-2xl font-black uppercase tracking-tight">{editingId ? "Éditer" : "Ajouter"} {activeTab}</h3>
                    <button onClick={() => setIsFormOpen(false)} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"><X /></button>
                 </div>
                 <div className="p-10">
                    <form onSubmit={async (e) => {
                       e.preventDefault(); setFormLoading(true);
                       let audio_url = "";
                       if (uploadFile) {
                          const path = `podcasts/${Date.now()}-${uploadFile.name}`;
                          await supabase.storage.from('podcasts-audio').upload(path, uploadFile);
                          const { data } = supabase.storage.from('podcasts-audio').getPublicUrl(path);
                          audio_url = data.publicUrl;
                       }
                       const payload = audio_url ? { ...podcastForm, audio_url } : podcastForm;
                       if (editingId) await supabase.from('podcasts').update(payload).eq('id', editingId);
                       else await supabase.from('podcasts').insert([payload]);
                       setFormLoading(false); setIsFormOpen(false); loadData();
                    }} className="space-y-6">
                       <input type="text" value={podcastForm.title} onChange={e => setPodcastForm({...podcastForm, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5" placeholder="Titre" required />
                       <select value={podcastForm.category} onChange={e => setPodcastForm({...podcastForm, category: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none">
                          {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0B0F19]">{c}</option>)}
                       </select>
                       <input type="date" value={podcastForm.date} onChange={e => setPodcastForm({...podcastForm, date: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5" required />
                       <div><label className="text-[10px] font-black text-[#D4AF37] uppercase mb-4 block">Fichier MP3</label><input type="file" onChange={e => setUploadFile(e.target.files?.[0] || null)} className="w-full bg-white/5 border border-dashed border-white/20 rounded-2xl p-8 text-center" /></div>
                       <button type="submit" disabled={formLoading} className="w-full py-5 bg-[#D4AF37] text-[#0B0F19] font-black rounded-2xl uppercase tracking-widest">{formLoading ? <Loader2 className="animate-spin mx-auto" /> : "Sauvegarder"}</button>
                    </form>
                 </div>
              </motion.div>
           </div>
         )}
      </AnimatePresence>
    </div>
  );
}
