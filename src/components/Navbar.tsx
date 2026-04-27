import { Link, useLocation } from "react-router-dom";
import { Menu, X, Radio, Youtube, BookOpen, MessageSquare, Mic2, Info, Home } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { name: "Accueil", path: "/", icon: Home },
  { name: "Radio", path: "/radio", icon: Radio },
  { name: "Youtube", path: "/youtube", icon: Youtube },
  { name: "Coran", path: "/coran", icon: BookOpen },
  { name: "Podcasts", path: "/podcasts", icon: Mic2 },
  { name: "Conseils", path: "/conseils", icon: MessageSquare },
  { name: "Contact", path: "/contact", icon: MessageSquare },
  { name: "À propos", path: "/a-propos", icon: Info },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-iqra-green text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden border-2 border-iqra-gold group-hover:scale-110 transition-transform">
              <img 
                src="https://i.pinimg.com/1200x/ac/2a/6e/ac2a6e5b57e6831dc47d7d50d0a95894.jpg" 
                alt="Logo RADIO IQRA TV" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-2xl font-bold tracking-tight uppercase">RADIO IQRA TV</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold uppercase tracking-wider">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition-colors ${
                    isActive ? "text-iqra-gold border-b-2 border-iqra-gold pb-1" : "hover:text-iqra-gold"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
            id="mobile-menu-button"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-iqra-green border-t border-white/10 py-4 px-4 shadow-xl">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition-colors ${
                    isActive ? "bg-iqra-gold text-iqra-green" : "text-white hover:bg-white/10"
                  }`}
                >
                  <Icon size={20} />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
