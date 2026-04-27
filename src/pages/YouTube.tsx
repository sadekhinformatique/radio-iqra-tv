import { Youtube, ExternalLink } from "lucide-react";

export default function YouTube() {
  return (
    <div className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-iqra-green mb-4">Iqra YouTube</h1>
          <p className="text-gray-500 font-medium">Suivez toutes nos vidéos et nos live émissions en direct du Burkina Faso.</p>
        </div>
        <a 
          href="https://www.youtube.com/@RADIOIQRA-TV" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-red-600 text-white px-6 py-3 rounded-full flex items-center gap-2 font-bold uppercase tracking-widest text-xs hover:bg-red-700 transition-colors shadow-lg"
        >
          <Youtube size={20} /> S'abonner à la chaine
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Video (Featured) */}
        <div className="lg:col-span-2">
          <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative group">
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/live_stream?channel=UCv-6e6_OAgx2LgD5fX8Ebw" // Placeholder for live link
              title="Radio Iqra TV Live"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="mt-6">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-tighter">En Direct Live</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-iqra-green">Émission Spéciale : Les Enseignements de l'Islam</h2>
          </div>
        </div>

        {/* Sidebar Videos (Mock) */}
        <div className="space-y-6">
          <h3 className="font-bold text-iqra-gold uppercase tracking-widest text-xs border-b border-gray-100 pb-2">Dernières Vidéos</h3>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 group cursor-pointer">
              <div className="w-32 h-20 bg-gray-200 rounded-xl flex-shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-iqra-green/10 flex items-center justify-center">
                  <Youtube className="text-iqra-green/20" size={24} />
                </div>
              </div>
              <div>
                <p className="text-iqra-green font-bold text-sm leading-tight hover:text-iqra-gold transition-colors">Conférence du Vendredi - Ouagadougou</p>
                <p className="text-gray-400 text-xs mt-1 italic">Il y a 2 jours</p>
              </div>
            </div>
          ))}
          <button className="w-full py-3 border-2 border-gray-100 rounded-xl text-gray-400 text-xs font-bold uppercase tracking-widest hover:border-iqra-gold hover:text-iqra-gold transition-all flex items-center justify-center gap-2">
            Voir plus sur YouTube <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
