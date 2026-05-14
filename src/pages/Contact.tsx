import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, Loader2, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { useSiteConfig } from '../hooks/useSiteConfig';

export default function Contact() {
  const { config } = useSiteConfig();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      const { error } = await supabase.from('contact_messages').insert([formData]);
      if (error) throw error;
      setStatus({ type: 'success', message: 'Votre message a été envoyé avec succès !' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus({ type: 'error', message: 'Une erreur est survenue. Veuillez réessayer.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 lg:px-8 bg-night">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-[32px] bg-primary/20 text-gold mb-8 gold-glow"
          >
            <MessageSquare size={48} />
          </motion.div>
          <h1 className="text-5xl lg:text-7xl font-cairo font-black text-white mb-6 tracking-tighter uppercase">
            Contactez <span className="text-gold italic">L'équipe</span>
          </h1>
          <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">
            Une question ? Un témoignage ? Notre équipe est à votre écoute pour vous accompagner.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5 space-y-8">
            {[
              { icon: MapPin, title: 'Notre Siège', desc: config.address, color: 'text-blue-400' },
              { icon: Phone, title: 'Appelez-nous', desc: `${config.primary_phone}${config.secondary_phone ? ' / ' + config.secondary_phone : ''}`, color: 'text-emerald-400' },
              { icon: Mail, title: 'Email direct', desc: config.email, color: 'text-gold' },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-[32px] p-8 flex gap-6 items-center group border-white/5 hover:border-gold/30 transition-all shadow-xl"
              >
                <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center ${item.color} flex-shrink-0 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500`}>
                  <item.icon size={28} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{item.title}</h4>
                  <p className="text-xl font-black text-white uppercase tracking-tight">{item.desc}</p>
                </div>
              </motion.div>
            ))}

            <div className="glass rounded-[32px] p-10 border border-white/10 relative overflow-hidden">
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gold/5 blur-[60px] rounded-full" />
               <Sparkles className="text-gold mb-6" size={32} />
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 italic">Heures de service</h3>
               <p className="text-gray-400 font-medium leading-relaxed">
                  Notre équipe est disponible pour répondre à vos préoccupations du lundi au samedi, de 8h00 à 18h00.
               </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="glass-card rounded-[48px] p-10 lg:p-16 border-white/5 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
              {status.type === 'success' ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
                  <div className="w-24 h-24 rounded-[32px] bg-emerald-500/10 flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-2xl">
                    <CheckCircle2 size={48} className="text-emerald-500" />
                  </div>
                  <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">Message Envoyé !</h3>
                  <p className="text-gray-400 text-xl font-medium mb-12">{status.message}</p>
                  <button 
                    onClick={() => setStatus({ type: '', message: '' })} 
                    className="px-12 py-5 bg-primary text-gold font-black uppercase tracking-widest text-xs rounded-full gold-glow hover:scale-105 transition-all"
                  >
                    Envoyer un nouveau message
                  </button>
                </motion.div>
              ) : (
                <form className="space-y-8" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Nom Complet</label>
                      <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Abdou Traoré" className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-3xl text-white placeholder-gray-600 focus:outline-none focus:border-gold transition-all font-medium text-lg" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Adresse Email</label>
                      <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="votre@email.com" className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-3xl text-white placeholder-gray-600 focus:outline-none focus:border-gold transition-all font-medium text-lg" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Sujet de votre message</label>
                    <input type="text" required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="Ex: Demande de renseignement" className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-3xl text-white placeholder-gray-600 focus:outline-none focus:border-gold transition-all font-medium text-lg" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Votre Message</label>
                    <textarea rows={6} required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Comment pouvons-nous vous aider ?" className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-3xl text-white placeholder-gray-600 focus:outline-none focus:border-gold transition-all font-medium text-lg resize-none" />
                  </div>
                  {status.type === 'error' && (
                    <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-6 rounded-3xl font-bold">{status.message}</motion.p>
                  )}
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full py-6 bg-gold text-night font-black uppercase tracking-[0.3em] text-sm rounded-full transition-all flex items-center justify-center gap-4 disabled:opacity-50 gold-glow hover:scale-[1.02] active:scale-95 mt-4"
                  >
                    {loading ? <Loader2 className="animate-spin" size={24} /> : <><Send size={24} /> Envoyer Maintenant</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

