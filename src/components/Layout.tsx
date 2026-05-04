import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import RadioPlayer from "./RadioPlayer";
import { useSiteConfig } from "../hooks/useSiteConfig";
import { Facebook, Youtube, Send, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react";

export default function Layout() {
  const { config } = useSiteConfig();

  return (
    <div className="min-h-screen flex flex-col pb-24 md:pb-20">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-gray-50 border-t border-gray-200 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-full shadow-md overflow-hidden border-2 border-iqra-gold p-0.5">
                <img 
                  src={config.logo_url || "https://i.pinimg.com/1200x/ac/2a/6e/ac2a6e5b57e6831dc47d7d50d0a95894.jpg"} 
                  alt={`Logo ${config.site_name}`} 
                  className="w-full h-full object-contain rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-serif font-bold text-lg text-iqra-green uppercase">{config.site_name}</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Dédiée à la diffusion des enseignements authentiques de l'Islam, 
              dans un esprit de paix, de fraternité et d'éducation spirituelle au Burkina Faso.
            </p>
            <div className="flex gap-4">
              {config.facebook_url && (
                <a href={config.facebook_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-iqra-green hover:text-iqra-gold transition-colors">
                  <Facebook size={18} />
                </a>
              )}
              {config.youtube_url && (
                <a href={config.youtube_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-iqra-green hover:text-iqra-gold transition-colors">
                  <Youtube size={18} />
                </a>
              )}
              {config.whatsapp_number && (
                <a href={`https://wa.me/${config.whatsapp_number}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-iqra-green hover:text-iqra-gold transition-colors">
                  <Send size={18} />
                </a>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-iqra-gold mb-6 border-b-2 border-iqra-gold/20 pb-2 inline-block">Navigation</h4>
            <ul className="text-sm text-gray-600 flex flex-col gap-3">
              <li><a href="/" className="hover:text-iqra-green transition-colors flex items-center gap-2">• Accueil</a></li>
              <li><a href="/radio" className="hover:text-iqra-green transition-colors flex items-center gap-2">• Radio Direct</a></li>
              <li><a href="/podcasts" className="hover:text-iqra-green transition-colors flex items-center gap-2">• Podcasts</a></li>
              <li><a href="/a-propos" className="hover:text-iqra-green transition-colors flex items-center gap-2">• À propos</a></li>
              <li><a href="/contact" className="hover:text-iqra-green transition-colors flex items-center gap-2">• Contact</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold text-sm uppercase tracking-widest text-iqra-gold mb-6 border-b-2 border-iqra-gold/20 pb-2 inline-block">Contact & Adresse</h4>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-iqra-gold flex-shrink-0" />
                <span>{config.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-iqra-gold flex-shrink-0" />
                <span>{config.primary_phone}</span>
              </div>
              {config.email && (
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-iqra-gold flex-shrink-0" />
                  <span>{config.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest leading-loose">
            {config.footer_text}
          </p>
        </div>
      </footer>
      <RadioPlayer />
    </div>
  );
}
