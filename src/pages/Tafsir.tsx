import { useState, useEffect } from "react";
import { BookOpen, Search, Calendar, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { applyTafsirTheme } from "../hooks/useSiteConfig";

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
    const stored = localStorage.getItem("tafsir_theme");
    if (stored) applyTafsirTheme(stored);
  }, []);

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
      <div className="tafsir-page flex items-center justify-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <div className="w-12 h-12 border-2 rounded-full animate-spin mx-auto" style={{
            borderColor: "var(--tafsir-primary, #c9a227)30",
            borderTopColor: "var(--tafsir-primary, #c9a227)",
          }} />
          <p className="mt-4 text-sm" style={{ color: "var(--tafsir-text-muted, #9ca3af)" }}>Chargement des tafsirs…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tafsir-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-10">
          <Link to="/coran" className="inline-flex items-center gap-1.5 text-sm transition-colors mb-6" style={{
            color: "var(--tafsir-text-muted, #9ca3af)",
          }}>
            ← Retour au Coran
          </Link>

          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{
              background: "var(--tafsir-primary-soft, rgba(201,162,39,0.08))",
              color: "var(--tafsir-primary, #c9a227)",
              border: "1px solid var(--tafsir-card-border, rgba(201,162,39,0.12))",
            }}>
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-semibold tracking-tight" style={{
                color: "var(--tafsir-text, #1a1a1a)",
              }}>
                Tafsir du Coran
              </h1>
              <p className="text-sm mt-0.5 font-serif" style={{ color: "var(--tafsir-text-muted, #9ca3af)" }}>
                Exégèse et Commentaires en Français
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-2xl leading-relaxed" style={{ color: "var(--tafsir-text-secondary, #6b7280)" }}>
            Collection de <span className="font-semibold" style={{ color: "var(--tafsir-primary, #c9a227)" }}>{data.length}</span> études d'exégèse coranique, regroupées par sourate — sources Ibn Kathir, Tabari et tradition prophétique.
          </p>
        </div>

        {/* Filters */}
        <div className="rounded-2xl p-5 mb-8 shadow-sm" style={{
          background: "var(--tafsir-card, #ffffff)",
          border: "1px solid var(--tafsir-border, rgba(0,0,0,0.06))",
        }}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{ color: "var(--tafsir-text-muted, #9ca3af)" }} />
              <input
                type="text"
                placeholder="Rechercher un verset, un thème…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl focus:outline-none text-sm font-serif placeholder-opacity-50"
                style={{
                  background: "var(--tafsir-bg-alt, #f3f0ea)",
                  border: "1px solid var(--tafsir-border, rgba(0,0,0,0.06))",
                  color: "var(--tafsir-text, #1a1a1a)",
                }}
              />
            </div>
            <div className="sm:w-60">
              <select
                value={selectedSurah ?? ""}
                onChange={(e) => setSelectedSurah(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-4 py-2.5 rounded-xl focus:outline-none text-sm font-serif"
                style={{
                  background: "var(--tafsir-bg-alt, #f3f0ea)",
                  border: "1px solid var(--tafsir-border, rgba(0,0,0,0.06))",
                  color: "var(--tafsir-text, #1a1a1a)",
                }}
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
                className="px-4 py-2.5 text-sm rounded-xl transition-colors font-serif"
                style={{
                  color: "var(--tafsir-primary, #c9a227)",
                  border: "1px solid var(--tafsir-card-border, rgba(201,162,39,0.12))",
                }}
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm mb-6 font-serif" style={{ color: "var(--tafsir-text-muted, #9ca3af)" }}>
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
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{
                background: "var(--tafsir-primary-soft, rgba(201,162,39,0.08))",
              }}>
                <BookOpen size={28} style={{ color: "var(--tafsir-text-muted, #9ca3af)" }} />
              </div>
              <h3 className="text-lg font-serif font-semibold" style={{ color: "var(--tafsir-text-secondary, #6b7280)" }}>Aucun résultat trouvé</h3>
              <p className="text-sm mt-1 font-serif" style={{ color: "var(--tafsir-text-muted, #9ca3af)" }}>Essayez une autre recherche</p>
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
                        <span className="font-serif text-base font-semibold" style={{ color: "var(--tafsir-primary, #c9a227)" }}>{numPadded}</span>
                        <span className="w-6 h-px" style={{ background: "var(--tafsir-primary, #c9a227)40" }} />
                      </div>
                      <div>
                        <h2 className="text-base font-serif font-semibold" style={{ color: "var(--tafsir-text, #1a1a1a)" }}>
                          {firstEntry.surahNameFr}
                          {firstEntry.surahNameAr && (
                            <span className="ml-2 font-arabic" style={{ color: "var(--tafsir-primary, #c9a227)" }} dir="rtl">{firstEntry.surahNameAr}</span>
                          )}
                        </h2>
                      </div>
                      <span className="ml-auto text-xs font-serif" style={{ color: "var(--tafsir-text-muted, #9ca3af)" }}>{entries.length} tafsir{entries.length !== 1 ? "s" : ""}</span>
                      <div className="h-px flex-1 max-w-24 ml-4" style={{
                        background: "var(--tafsir-divider, linear-gradient(to right, transparent, rgba(0,0,0,0.1), transparent))",
                      }} />
                    </div>

                    {/* Cards grid */}
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {entries.map((entry) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => (window.location.href = `/tafsir/${entry.slug}`)}
                          className="group rounded-xl p-5 cursor-pointer relative overflow-hidden transition-all duration-200"
                          style={{
                            background: "var(--tafsir-card, #ffffff)",
                            border: "1px solid var(--tafsir-border, rgba(0,0,0,0.06))",
                            boxShadow: "var(--tafsir-shadow, 0 4px 24px rgba(0,0,0,0.06))",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLDivElement).style.borderColor = "var(--tafsir-card-border, rgba(201,162,39,0.12))";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLDivElement).style.borderColor = "var(--tafsir-border, rgba(0,0,0,0.06))";
                          }}
                        >
                          {/* Top accent line */}
                          <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{
                            background: "linear-gradient(90deg, var(--tafsir-primary, #c9a227), var(--tafsir-primary-light, #d9b84a), var(--tafsir-primary, #c9a227))",
                          }} />

                          <h3 className="font-serif font-semibold text-sm mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug" style={{
                            color: "var(--tafsir-text, #1a1a1a)",
                          }}>
                            {entry.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-serif" style={{
                              background: "var(--tafsir-badge-bg, rgba(201,162,39,0.08))",
                              color: "var(--tafsir-badge-text, #9a7a1c)",
                            }}>
                              {entry.verses.length > 5 ? `${entry.verses[0]}–${entry.verses[entry.verses.length - 1]}` : entry.verses.join(", ")}
                            </span>
                            {entry.date && (
                              <span className="inline-flex items-center gap-1 text-xs font-serif" style={{ color: "var(--tafsir-text-muted, #9ca3af)" }}>
                                <Calendar size={11} />
                                {entry.date}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 mt-3 text-xs opacity-0 group-hover:opacity-100 transition-opacity font-serif" style={{
                            color: "var(--tafsir-primary, #c9a227)",
                          }}>
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
        .tafsir-page {
          min-height: 100vh;
          background: var(--tafsir-bg, #faf8f4);
          font-family: 'Georgia', 'Times New Roman', serif;
        }
        .font-arabic {
          font-family: 'Amiri', 'Traditional Arabic', serif;
        }
        .tafsir-page input,
        .tafsir-page select {
          font-size: 16px;
        }
        .tafsir-page input::placeholder {
          color: var(--tafsir-text-muted, #9ca3af);
        }
        .tafsir-page input:focus,
        .tafsir-page select:focus {
          border-color: var(--tafsir-primary, #c9a227) !important;
          box-shadow: 0 0 0 2px var(--tafsir-primary-soft, rgba(201,162,39,0.15));
        }
      `}</style>
    </div>
  );
}
