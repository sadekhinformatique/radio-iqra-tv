import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface MediaItem {
  id: string | number;
  title: string;
  subtitle?: string;
  image?: string;
  url?: string;
  link?: string;
  badge?: string;
  type?: 'video' | 'audio' | 'article';
}

interface MediaSliderProps {
  title: string;
  items: MediaItem[];
  viewAllLink?: string;
}

export default function MediaSlider({ title, items, viewAllLink }: MediaSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, [items]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="relative group/slider">
      <div className="flex items-center justify-between mb-6 px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-gold-500 rounded-full" />
          <h2 className="text-xl lg:text-2xl font-cairo font-bold text-white">{title}</h2>
        </div>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="text-sm text-gold-500 hover:text-gold-400 font-medium transition-colors flex items-center gap-1"
          >
            Voir tout
            <ChevronRight size={16} />
          </Link>
        )}
      </div>

      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-night-900/80 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 hover:bg-emerald-600 shadow-xl"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth px-4 lg:px-8 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <Link
              key={item.id}
              to={item.link || '#'}
              className="flex-shrink-0 w-[200px] sm:w-[220px] md:w-[240px] group/card"
            >
              <div className="relative rounded-xl overflow-hidden aspect-[3/4] bg-night-700/50 border border-white/5 group-hover/card:border-emerald-500/30 transition-all duration-500">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-900/30 to-night-800 flex items-center justify-center">
                    <Play size={40} className="text-gold-500/30" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/20 to-transparent opacity-60 group-hover/card:opacity-80 transition-opacity duration-500" />

                <div className="absolute top-3 right-3">
                  {item.badge && (
                    <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-lg">
                      {item.badge}
                    </span>
                  )}
                  {item.type === 'video' && (
                    <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white shadow-lg">
                      VIDEO
                    </span>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover/card:text-gold-400 transition-colors duration-300">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{item.subtitle}</p>
                  )}
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-gold-500/90 text-night-900 flex items-center justify-center shadow-xl transform scale-75 group-hover/card:scale-100 transition-transform duration-300">
                    <Play size={22} fill="currentColor" className="ml-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-night-900/80 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 hover:bg-emerald-600 shadow-xl"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </section>
  );
}
