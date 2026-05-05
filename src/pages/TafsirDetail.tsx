import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Calendar, Tag } from "lucide-react";

interface TafsirDetail {
  id: number;
  surahNumber: number;
  surahName: string;
  surahNameAr: string;
  surahNameFr: string;
  title: string;
  slug: string;
  verses: number[];
  date: string;
  content: string;
}

export default function TafsirDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [entry, setEntry] = useState<TafsirDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    fetch(`/tafsir/content/${slug}.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Contenu non trouvé");
        return res.json();
      })
      .then((data) => {
        setEntry(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Tafsir non trouvé</h2>
          <Link to="/tafsir" className="text-emerald-600 hover:text-emerald-700">
            ← Retour à la liste des tafsirs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/tafsir" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 mb-6 transition-all">
          <ArrowLeft size={16} />
          Retour au Tafsir
        </Link>

        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 sm:p-8">
            <div className="flex items-center gap-2 text-emerald-100 text-sm mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-sm font-bold">
                {entry.surahNumber}
              </div>
              <span>Sourate {entry.surahNameFr}</span>
              <span className="font-serif" dir="rtl">{entry.surahNameAr}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">{entry.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-emerald-100">
              <div className="flex items-center gap-1">
                <Tag size={14} />
                Versets: {entry.verses.length > 5 ? `${entry.verses[0]}-${entry.verses[entry.verses.length - 1]}` : entry.verses.join(", ")}
              </div>
              {entry.date && (
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  {entry.date}
                </div>
              )}
            </div>
          </div>

          <div
            className="p-6 sm:p-8 prose prose-emerald max-w-none prose-headings:font-semibold prose-a:text-emerald-600 prose-blockquote:border-l-emerald-500 prose-blockquote:bg-emerald-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-ul:list-disc prose-ol:list-decimal"
            dangerouslySetInnerHTML={{ __html: entry.content }}
          />
        </article>

        <div className="mt-8 text-center">
          <Link
            to="/tafsir"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
          >
            <BookOpen size={18} />
            Explorer d'autres tafsirs
          </Link>
        </div>
      </div>
    </div>
  );
}
