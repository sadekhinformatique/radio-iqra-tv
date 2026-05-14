import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, Loader2, CheckCircle2 } from 'lucide-react';
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
    <div className="min-h-screen pt-28 pb-20 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-cairo font-bold text-white mb-4">Contactez-nous</h1>
          <p className="text-gray-400 max-w-xl mx-auto">Une question ? Un témoignage ? Notre équipe est à votre écoute.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {[
              { icon: MapPin, title: 'Notre Siège', desc: config.address },
              { icon: Phone, title: 'Appelez-nous', desc: `${config.primary_phone}${config.secondary_phone ? ' / ' + config.secondary_phone : ''}` },
              { icon: Mail, title: 'Email', desc: config.email },
            ].map((item, i) => (
              <div key={i} className="glass-card rounded-xl p-6 flex gap-4 items-start group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-gold-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                  <item.icon size={22} />
                </div>
                <div>
                  <h4 className="font-cairo font-bold text-white mb-1">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <div className="glass-card rounded-2xl p-8 lg:p-10">
              {status.type === 'success' ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-emerald-600/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} className="text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-cairo font-bold text-white mb-4">Merci !</h3>
                  <p className="text-gray-400 mb-8">{status.message}</p>
                  <button onClick={() => setStatus({ type: '', message: '' })} className="px-8 py-3 bg-gold-500/10 border border-gold-500/20 text-gold-400 font-semibold rounded-xl hover:bg-gold-500/20 transition-all">
                    Envoyer un autre message
                  </button>
                </motion.div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Nom Complet</label>
                      <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Abdou Traoré" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Email</label>
                      <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="votre@email.com" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Sujet</label>
                    <input type="text" required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="Ex: Demande de renseignement" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Message</label>
                    <textarea rows={5} required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Votre message ici..." className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none" />
                  </div>
                  {status.type === 'error' && (
                    <p className="text-red-400 text-sm bg-red-500/10 p-4 rounded-xl">{status.message}</p>
                  )}
                  <button type="submit" disabled={loading} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-emerald-600/20">
                    {loading ? <Loader2 className="animate-spin" size={22} /> : <><Send size={20} /> Envoyer le message</>}
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
