import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import RadioPlayer from "./RadioPlayer";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col pb-24 md:pb-20">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-gray-50 border-t border-gray-200 py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-white rounded-full shadow-md overflow-hidden border-2 border-iqra-gold p-0.5">
                <img 
                  src="https://i.pinimg.com/1200x/ac/2a/6e/ac2a6e5b57e6831dc47d7d50d0a95894.jpg" 
                  alt="Logo Radio Iqra TV" 
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-serif font-bold text-xl text-iqra-green uppercase">RADIO IQRA TV</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Dédiée à la diffusion des enseignements authentiques de l'Islam, 
              dans un esprit de paix, de fraternité et d'éducation spirituelle au Burkina Faso.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-iqra-gold mb-4">Navigation</h4>
            <ul className="text-sm text-gray-600 flex flex-col gap-2">
              <li><a href="/a-propos" className="hover:text-iqra-green transition-colors">À propos</a></li>
              <li><a href="/contact" className="hover:text-iqra-green transition-colors">Nous contacter</a></li>
              <li><a href="/" className="hover:text-iqra-green transition-colors">Accueil</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-iqra-gold mb-4">Réseaux Sociaux</h4>
            <div className="flex gap-4">
              {/* Add social icons here later */}
              <span className="text-xs text-gray-400 font-mono tracking-widest uppercase">Ouaga, Burkina Faso</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest">
            © {new Date().getFullYear()} Radio Iqra TV. Tous droits réservés.
          </p>
        </div>
      </footer>
      <RadioPlayer />
    </div>
  );
}
