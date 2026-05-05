import { useState, useEffect } from "react";
import { BookOpen, Search, Calendar, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";

interface TafsirEntry {
  id: number;
  surahNumber: number;
  surahName: string;
  surahNameAr: string;
  surahNameFr: string;
  title: string;
  slug: string;
  verses: number[];
  date: string;
}

export default function Tafsir() {
  const [data, setData] = useState<TafsirEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);

  useEffect(() => {
    fetch("/tafsir/tafsir-data.json")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const surahOptions: { number: number; name: string; arabic: string }[] = Array.from(
    new Map(data.map((e) => [e.surahNumber, { number: e.surahNumber, name: e.surahNameFr, arabic: e.surahNameAr }])).values(),
  ) as { number: number; name: string; arabic: string }[];
  surahOptions.sort((a, b) => a.number - b.number);

  const filtered = data.filter((entry) => {
    const matchesSearch =
      searchQuery === "" ||
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.surahNameFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.surahNameAr.includes(searchQuery);
    const matchesSurah = selectedSurah === null || entry.surahNumber === selectedSurah;
    return matchesSearch && matchesSurah;
  });

  const groupedBySurah = filtered.reduce<Record<number, TafsirEntry[]>>((acc, entry) => {
    if (!acc[entry.surahNumber]) acc[entry.surahNumber] = [];
    acc[entry.surahNumber].push(entry);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-amber-600/30 border-t-amber-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-gray-400 font-serif">Chargement des tafsirs…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-10">
          <Link to="/coran" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-amber-600 mb-6 transition-colors font-serif">
            ← Retour au Coran
          </Link>

          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/50 text-amber-700 flex items-center justify-center flex-shrink-0">
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-gray-900 tracking-tight">
                Tafsir du Coran
              </h1>
              <p className="text-sm text-gray-400 font-serif mt-0.5">Exégèse et Commentaires en Français</p>
            </div>
          </div>
          <p className="text-gray-500 mt-4 max-w-2xl leading-relaxed">
            Collection de <span className="font-semibold text-amber-700">{data.length}</span> études d'exégèse coranique, regroupées par sourate — sources Ibn Kathir, Tabari et tradition prophétique.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
              <input
                type="text"
                placeholder="Rechercher un verset, un thème…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-sm bg-gray-50/50 font-serif placeholder:text-gray-300"
              />
            </div>
            <div className="sm:w-60">
              <select
                value={selectedSurah ?? ""}
                onChange={(e) => setSelectedSurah(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-4 py-2.5 border border-gray-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-sm bg-gray-50/50 font-serif"
              >
                <option value="">Toutes les sourates</option>
                {surahOptions.map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.number}. {s.name}
                  </option>
                ))}
              </select>
            </div>
            {(searchQuery || selectedSurah !== null) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSurah(null);
                }}
                className="px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 rounded-xl transition-colors border border-amber-200/60 font-serif"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-400 mb-6 font-serif">
          {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {Object.keys(groupedBySurah).length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center">
                <BookOpen size={28} className="text-amber-600/40" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-gray-600">Aucun résultat trouvé</h3>
              <p className="text-sm text-gray-400 mt-1 font-serif">Essayez une autre recherche</p>
            </motion.div>
          ) : (
            Object.entries(groupedBySurah)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([surahNum, entries]: [string, TafsirEntry[]]) => {
                const firstEntry = entries[0];
                const numPadded = Number(surahNum).toString().padStart(2, "0");
                return (
                  <motion.div
                    key={surahNum}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                  >
                    {/* Surah header */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-amber-600 font-serif text-base font-semibold">{numPadded}</span>
                        <span className="w-6 h-px bg-amber-600/30" />
                      </div>
                      <div>
                        <h2 className="text-base font-serif font-semibold text-gray-800">
                          {firstEntry.surahNameFr}
                          {firstEntry.surahNameAr && (
                            <span className="ml-2 text-amber-600/80 font-arabic" dir="rtl">{firstEntry.surahNameAr}</span>
                          )}
                        </h2>
                      </div>
                      <span className="ml-auto text-xs text-gray-300 font-serif">{entries.length} tafsir{entries.length !== 1 ? "s" : ""}</span>
                      <div className="h-px flex-1 bg-gradient-to-r from-gray-200/60 to-transparent max-w-24 ml-4" />
                    </div>

                    {/* Cards grid */}
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {entries.map((entry) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => (window.location.href = `/tafsir/${entry.slug}`)}
                          className="group bg-white rounded-xl border border-gray-100 p-5 hover:border-amber-200/60 hover:shadow-lg hover:shadow-amber-600/[0.04] transition-all cursor-pointer relative overflow-hidden"
                        >
                          {/* Top accent line */}
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                          <h3 className="font-serif font-semibold text-gray-800 text-sm mb-3 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug">
                            {entry.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-50 text-amber-700/80 font-serif">
                              {entry.verses.length > 5 ? `${entry.verses[0]}–${entry.verses[entry.verses.length - 1]}` : entry.verses.join(", ")}
                            </span>
                            {entry.date && (
                              <span className="inline-flex items-center gap-1 text-xs text-gray-300 font-serif">
                                <Calendar size={11} />
                                {entry.date}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 mt-3 text-xs text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity font-serif">
                            Lire le tafsir
                            <ChevronRight size={12} />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .font-arabic {
          font-family: 'Amiri', 'Traditional Arabic', serif;
        }
      `}</style>
    </div>
  );
}
