import { MapPin, Phone, Mail, MessageSquare, Send, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useSiteConfig } from "../hooks/useSiteConfig";

export default function Contact() {
  const { config } = useSiteConfig();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([formData]);

      if (error) throw error;

      setStatus({ 
        type: "success", 
        message: "Votre message a été envoyé avec succès ! Nous vous répondrons bientôt." 
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      console.error("Error sending message:", err);
      setStatus({ 
        type: "error", 
        message: "Une erreur est survenue lors de l'envoi. Veuillez réessayer." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-iqra-green mb-4">Contactez-nous</h1>
        <p className="text-gray-500 max-w-xl mx-auto font-medium">
          Une question ? Un témoignage ? Notre équipe est à votre écoute pour vous accompagner dans votre cheminement spirituel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Info Sidebar */}
        <div className="lg:col-span-2 space-y-8">
          <ContactCard 
            icon={MapPin} 
            title="Notre Siège" 
            desc={config.address}
            color="bg-iqra-green"
          />
          <ContactCard 
            icon={Phone} 
            title="Appelez-nous" 
            desc={`${config.primary_phone} ${config.secondary_phone ? '/ ' + config.secondary_phone : ''}`}
            color="bg-iqra-gold"
          />
          <ContactCard 
            icon={Mail} 
            title="Email" 
            desc={config.email}
            color="bg-iqra-green"
          />
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-3 bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-50">
          {status.type === "success" ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold font-serif text-iqra-green mb-4">Merci !</h3>
              <p className="text-gray-600 mb-8">{status.message}</p>
              <button 
                onClick={() => setStatus({ type: "", message: "" })}
                className="px-8 py-3 bg-iqra-gold text-iqra-green font-bold rounded-xl shadow-lg"
              >
                Envoyer un autre message
              </button>
            </motion.div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Nom Complet</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Abdou Traoré"
                    className="w-full px-4 py-4 rounded-xl border border-gray-100 focus:border-iqra-gold focus:ring-2 focus:ring-iqra-gold/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="votre@email.com"
                    className="w-full px-4 py-4 rounded-xl border border-gray-100 focus:border-iqra-gold focus:ring-2 focus:ring-iqra-gold/20 outline-none transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Sujet</label>
                <input 
                  type="text" 
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="Ex: Demande de renseignement"
                  className="w-full px-4 py-4 rounded-xl border border-gray-100 focus:border-iqra-gold focus:ring-2 focus:ring-iqra-gold/20 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Message</label>
                <textarea 
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Votre message ici..."
                  className="w-full px-4 py-4 rounded-xl border border-gray-100 focus:border-iqra-gold focus:ring-2 focus:ring-iqra-gold/20 outline-none transition-all resize-none"
                ></textarea>
              </div>

              {status.type === "error" && (
                <p className="text-red-500 text-sm font-bold bg-red-50 p-4 rounded-xl">{status.message}</p>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-iqra-green text-white font-bold uppercase tracking-widest rounded-xl hover:bg-iqra-green/90 transition-all flex items-center justify-center gap-3 shadow-lg group disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>Envoyer le message <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function ContactCard({ icon: Icon, title, desc, color }: any) {
  return (
    <div className="flex gap-6 items-start group">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
        <Icon size={24} />
      </div>
      <div>
        <h4 className="font-serif font-bold text-xl text-iqra-green mb-1">{title}</h4>
        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
