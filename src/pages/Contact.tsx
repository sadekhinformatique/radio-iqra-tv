import { MapPin, Phone, Mail, MessageSquare, Send } from "lucide-react";
import { motion } from "motion/react";

export default function Contact() {
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
            desc="Ouagadougou, Secteur 12, Quartier Gounghin, Burkina Faso"
            color="bg-iqra-green"
          />
          <ContactCard 
            icon={Phone} 
            title="Appelez-nous" 
            desc="+226 25 XX XX XX / +226 70 XX XX XX"
            color="bg-iqra-gold"
          />
          <ContactCard 
            icon={Mail} 
            title="Email" 
            desc="contact@radioiqratv.bf"
            color="bg-iqra-green"
          />
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-3 bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-50">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Nom Complet</label>
                <input 
                  type="text" 
                  placeholder="Ex: Abdou Traoré"
                  className="w-full px-4 py-4 rounded-xl border border-gray-100 focus:border-iqra-gold focus:ring-2 focus:ring-iqra-gold/20 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email</label>
                <input 
                  type="email" 
                  placeholder="votre@email.com"
                  className="w-full px-4 py-4 rounded-xl border border-gray-100 focus:border-iqra-gold focus:ring-2 focus:ring-iqra-gold/20 outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Sujet</label>
              <input 
                type="text" 
                placeholder="Ex: Demande de renseignement"
                className="w-full px-4 py-4 rounded-xl border border-gray-100 focus:border-iqra-gold focus:ring-2 focus:ring-iqra-gold/20 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Message</label>
              <textarea 
                rows={5}
                placeholder="Votre message ici..."
                className="w-full px-4 py-4 rounded-xl border border-gray-100 focus:border-iqra-gold focus:ring-2 focus:ring-iqra-gold/20 outline-none transition-all resize-none"
              ></textarea>
            </div>

            <button className="w-full py-5 bg-iqra-green text-white font-bold uppercase tracking-widest rounded-xl hover:bg-iqra-green/90 transition-all flex items-center justify-center gap-3 shadow-lg group">
              Envoyer le message <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>
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
