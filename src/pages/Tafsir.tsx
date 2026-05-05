import { useState, useEffect } from "react";
import { BookOpen, Search, Calendar, ArrowLeft } from "lucide-react";
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
  const [surahs, setSurahs] = useState<{ number: number; frenchName: string; name: string }[]>([]);

  useEffect(() => {
    fetch("/quran/surahs.json")
      .then((res) => res.json())
      .then((data) => setSurahs(data))
      .catch(console.error);

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/coran" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 mb-6 transition-all">
          <ArrowLeft size={16} />
          Retour au Coran
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tafsir du Coran</h1>
              <p className="text-sm text-gray-500">Exégèse et Commentaires en Français</p>
            </div>
          </div>
          <p className="text-gray-600 mt-3">
            Collection de <span className="font-semibold text-emerald-600">{data.length}</span> études d'exégèse coranique, regroupées par sourate — sources Ibn Kathir, Tabari et tradition prophétique.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Rechercher un tafsir..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="sm:w-64">
              <select
                value={selectedSurah ?? ""}
                onChange={(e) => setSelectedSurah(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-white"
              >
                <option value="">Toutes les sourates</option>
                {surahOptions.map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.name} ({s.number})
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
                className="px-4 py-2.5 text-sm text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-emerald-200"
              >
                RÃ©initialiser
              </button>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-6">
          {filtered.length} rÃ©sultat{filtered.length !== 1 ? "s" : ""}
        </div>

        <AnimatePresence mode="wait">
          {Object.keys(groupedBySurah).length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600">Aucun rÃ©sultat trouvÃ©</h3>
              <p className="text-sm text-gray-400 mt-1">Essayez une autre recherche</p>
            </motion.div>
          ) : (
            Object.entries(groupedBySurah)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([surahNum, entries]: [string, TafsirEntry[]]) => {
                const firstEntry = entries[0];
                return (
                  <motion.div
                    key={surahNum}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
                        {surahNum}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">
                          {firstEntry.surahNameFr}{" "}
                          <span className="text-emerald-600 font-serif" dir="rtl">{firstEntry.surahNameAr}</span>
                        </h2>
                        <p className="text-xs text-gray-400">{entries.length} tafsir{entries.length !== 1 ? "s" : ""}</p>
                      </div>
                      <div className="ml-auto h-px flex-1 bg-gradient-to-r from-emerald-200 to-transparent max-w-32" />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {entries.map((entry) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="group bg-white rounded-xl border border-gray-100 p-5 hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer"
                          onClick={() => window.location.href = `/tafsir/${entry.slug}`}
                        >
                          <h3 className="font-semibold text-gray-800 text-sm mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
                            {entry.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="bg-gray-100 px-2 py-0.5 rounded-full">
                              Verset{entry.verses.length > 1 ? "s" : ""}: {entry.verses.length > 5 ? `${entry.verses[0]}-${entry.verses[entry.verses.length - 1]}` : entry.verses.join(", ")}
                            </span>
                          </div>
                          {entry.date && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-gray-300">
                              <Calendar size={12} />
                              {entry.date}
                            </div>
                          )}
                          <div className="flex items-center gap-1 mt-3 text-xs text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            Lire le tafsir
                            <ArrowLeft size={12} className="rotate-180" />
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
    </div>
  );
}
