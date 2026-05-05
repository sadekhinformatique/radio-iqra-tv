import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { BookOpen, Calendar, BookMarked, ChevronRight } from "lucide-react";

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

  const surahNum = entry?.surahNumber.toString().padStart(2, "0") ?? "00";
  const verseRange = entry && entry.verses.length > 5
    ? `${entry.verses[0]}–${entry.verses[entry.verses.length - 1]}`
    : entry?.verses.join(", ") ?? "";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-amber-600/30 border-t-amber-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-gray-400 font-serif">Chargement du tafsir…</p>
        </div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-50 flex items-center justify-center">
            <BookOpen size={28} className="text-amber-600/50" />
          </div>
          <h2 className="text-2xl font-serif font-semibold text-gray-800 mb-2">Tafsir non trouvé</h2>
          <p className="text-gray-500 mb-6">Ce tafsir n'est pas disponible pour le moment.</p>
          <Link
            to="/tafsir"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white rounded-full text-sm font-medium hover:bg-amber-700 transition-colors"
          >
            ← Retour à la liste des tafsirs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="py-4 text-sm" aria-label="Fil d'Ariane">
          <ol className="flex flex-wrap items-center gap-1 text-gray-400">
            <li>
              <Link to="/tafsir" className="hover:text-amber-600 transition-colors">Tafsir</Link>
            </li>
            <li><ChevronRight size={12} className="inline" /></li>
            <li>
              <Link to={`/tafsir?s=${entry.surahNumber}`} className="hover:text-amber-600 transition-colors">
                {entry.surahNameFr}
              </Link>
            </li>
            <li><ChevronRight size={12} className="inline" /></li>
            <li className="text-gray-700 font-medium truncate max-w-[200px]">{entry.title}</li>
          </ol>
        </nav>

        {/* Article Hero */}
        <header className="pb-8 border-b border-gray-200 mb-10">
          {/* Section eyebrow */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-amber-600 font-serif text-lg font-semibold">{surahNum}</span>
            <span className="w-8 h-px bg-amber-600/40" />
            <span className="text-gray-500 font-serif">{entry.surahNameFr}</span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-[clamp(1.75rem,4vw,2.75rem)] font-medium leading-[1.1] tracking-tight text-gray-900 mb-5">
            {entry.title}
          </h1>

          {/* Meta badges */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-full text-sm text-gray-500 bg-white">
              <BookMarked size={14} className="text-amber-600" />
              <span className="font-medium">{entry.surahNameFr}</span>
              {entry.surahNameAr && (
                <span className="font-arabic text-base text-gray-700" dir="rtl">{entry.surahNameAr}</span>
              )}
              <span className="opacity-60">({entry.surahNumber})</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-full text-sm text-gray-500 bg-white">
              Versets {verseRange}
            </span>

            {entry.date && (
              <time className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-full text-sm text-gray-400 bg-white">
                <Calendar size={13} />
                {entry.date}
              </time>
            )}
          </div>
        </header>

        {/* Article Content */}
        <article
          className="article-content"
          dangerouslySetInnerHTML={{ __html: entry.content }}
        />

        {/* CTA */}
        <div className="mt-16 mb-12 text-center">
          <div className="inline-flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-amber-50 to-emerald-50 rounded-2xl border border-amber-100/50">
            <h3 className="font-serif text-xl text-gray-800">Continuer la lecture</h3>
            <Link
              to="/tafsir"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-full font-medium hover:bg-amber-700 transition-colors shadow-lg shadow-amber-600/20"
            >
              <BookOpen size={18} />
              Explorer tous les tafsirs
            </Link>
          </div>
        </div>
      </div>

      {/* Article content styles */}
      <style>{`
        .article-content {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 1.125rem;
          line-height: 1.75;
          color: #374151;
        }
        .article-content h1 {
          font-family: 'Georgia', serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: #111827;
          margin: 2rem 0 1rem;
          line-height: 1.3;
        }
        .article-content h2 {
          font-family: 'Georgia', serif;
          font-size: 1.35rem;
          font-weight: 600;
          color: #111827;
          margin: 2.5rem 0 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e5e7eb;
          position: relative;
          line-height: 1.35;
        }
        .article-content h2::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 50px;
          height: 1px;
          background: #c9a227;
        }
        .article-content h3 {
          font-family: 'Georgia', serif;
          font-size: 1.15rem;
          font-weight: 600;
          color: #c9a227;
          margin: 2rem 0 0.75rem;
          line-height: 1.35;
        }
        .article-content h4 {
          font-size: 1.05rem;
          font-weight: 600;
          color: #374151;
          margin: 1.5rem 0 0.75rem;
        }
        .article-content p {
          margin-bottom: 1.25rem;
          color: #4b5563;
        }
        .article-content strong, .article-content b {
          font-weight: 600;
          color: #111827;
        }
        .article-content blockquote {
          font-style: italic;
          font-size: 1.05rem;
          line-height: 1.7;
          color: #6b7280;
          padding: 1rem 1.25rem;
          margin: 1.5rem 0;
          background: linear-gradient(to right, rgba(201, 162, 39, 0.08), transparent);
          border-left: 3px solid #c9a227;
          border-radius: 0 0.5rem 0.5rem 0;
        }
        .article-content blockquote p {
          margin-bottom: 0.5rem;
        }
        .article-content blockquote p:last-child {
          margin-bottom: 0;
        }
        .article-content ul, .article-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1.25rem;
        }
        .article-content li {
          margin-bottom: 0.5rem;
          line-height: 1.7;
        }
        .article-content li::marker {
          color: #c9a227;
        }
        .article-content hr {
          border: none;
          height: 1px;
          background: linear-gradient(to right, transparent, #d1d5db, transparent);
          margin: 2rem 0;
        }
        .article-content a {
          color: #c9a227;
          text-decoration: underline;
          text-decoration-color: rgba(201, 162, 39, 0.3);
          text-underline-offset: 2px;
          transition: text-decoration-color 150ms;
        }
        .article-content a:hover {
          text-decoration-color: #c9a227;
        }
        .article-content em {
          font-style: italic;
        }
        .article-content code {
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 0.875em;
          padding: 0.15em 0.4em;
          background: #f3f4f6;
          border-radius: 0.25rem;
          color: #9a7a1c;
        }
        .article-content pre {
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 0.875rem;
          padding: 1.25rem;
          background: #f9fafb;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
          border: 1px solid #e5e7eb;
        }
        .article-content pre code {
          padding: 0;
          background: none;
        }
        .font-arabic {
          font-family: 'Amiri', 'Traditional Arabic', serif;
        }
        @media (max-width: 640px) {
          .article-content {
            font-size: 1rem;
          }
          .article-content h1 {
            font-size: 1.3rem;
          }
          .article-content h2 {
            font-size: 1.2rem;
          }
          .article-content h3 {
            font-size: 1.1rem;
          }
          .article-content blockquote {
            padding: 0.75rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}
