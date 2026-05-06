import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { BookOpen, Calendar, BookMarked, ChevronRight } from "lucide-react";
import { applyTafsirTheme } from "../hooks/useSiteConfig";

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
    const stored = localStorage.getItem("tafsir_theme");
    if (stored) applyTafsirTheme(stored);
  }, []);

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
      <div className="tafsir-detail-page flex items-center justify-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <div className="w-12 h-12 border-2 rounded-full animate-spin mx-auto" style={{
            borderColor: "var(--tafsir-primary, #c9a227)30",
            borderTopColor: "var(--tafsir-primary, #c9a227)",
          }} />
          <p className="mt-4 text-sm" style={{ color: "var(--tafsir-text-muted, #9ca3af)" }}>Chargement du tafsir…</p>
        </div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="tafsir-detail-page flex items-center justify-center" style={{ minHeight: "60vh" }}>
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{
            background: "var(--tafsir-primary-soft, rgba(201,162,39,0.08))",
          }}>
            <BookOpen size={28} style={{ color: "var(--tafsir-text-muted, #9ca3af)" }} />
          </div>
          <h2 className="text-2xl font-serif font-semibold mb-2" style={{ color: "var(--tafsir-text, #1a1a1a)" }}>Tafsir non trouvé</h2>
          <p className="mb-6" style={{ color: "var(--tafsir-text-secondary, #6b7280)" }}>Ce tafsir n'est pas disponible pour le moment.</p>
          <Link
            to="/tafsir"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
            style={{
              background: "var(--tafsir-primary, #c9a227)",
              color: "#fff",
            }}
          >
            ← Retour à la liste des tafsirs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="tafsir-detail-page">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="py-4 text-sm" aria-label="Fil d'Ariane">
          <ol className="flex flex-wrap items-center gap-1" style={{ color: "var(--tafsir-text-muted, #9ca3af)" }}>
            <li>
              <Link to="/tafsir" className="hover:opacity-70 transition-colors">Tafsir</Link>
            </li>
            <li><ChevronRight size={12} className="inline" /></li>
            <li>
              <Link to={`/tafsir?s=${entry.surahNumber}`} className="hover:opacity-70 transition-colors">
                {entry.surahNameFr}
              </Link>
            </li>
            <li><ChevronRight size={12} className="inline" /></li>
            <li className="truncate max-w-[200px] font-medium" style={{ color: "var(--tafsir-text, #1a1a1a)" }}>{entry.title}</li>
          </ol>
        </nav>

        {/* Article Hero */}
        <header className="pb-8 mb-10" style={{ borderBottom: "1px solid var(--tafsir-border, rgba(0,0,0,0.06))" }}>
          {/* Section eyebrow */}
          <div className="flex items-center gap-3 mb-5">
            <span className="font-serif text-lg font-semibold" style={{ color: "var(--tafsir-primary, #c9a227)" }}>{surahNum}</span>
            <span className="w-8 h-px" style={{ background: "var(--tafsir-primary, #c9a227)40" }} />
            <span className="font-serif" style={{ color: "var(--tafsir-text-secondary, #6b7280)" }}>{entry.surahNameFr}</span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-[clamp(1.75rem,4vw,2.75rem)] font-medium leading-[1.1] tracking-tight mb-5" style={{
            color: "var(--tafsir-text, #1a1a1a)",
          }}>
            {entry.title}
          </h1>

          {/* Meta badges */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm" style={{
              border: "1px solid var(--tafsir-border, rgba(0,0,0,0.06))",
              background: "var(--tafsir-card, #ffffff)",
              color: "var(--tafsir-text-secondary, #6b7280)",
            }}>
              <BookMarked size={14} style={{ color: "var(--tafsir-primary, #c9a227)" }} />
              <span className="font-medium">{entry.surahNameFr}</span>
              {entry.surahNameAr && (
                <span className="font-arabic text-base" style={{ color: "var(--tafsir-text, #1a1a1a)" }} dir="rtl">{entry.surahNameAr}</span>
              )}
              <span className="opacity-60">({entry.surahNumber})</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm" style={{
              border: "1px solid var(--tafsir-border, rgba(0,0,0,0.06))",
              background: "var(--tafsir-card, #ffffff)",
              color: "var(--tafsir-text-secondary, #6b7280)",
            }}>
              Versets {verseRange}
            </span>

            {entry.date && (
              <time className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm" style={{
                border: "1px solid var(--tafsir-border, rgba(0,0,0,0.06))",
                background: "var(--tafsir-card, #ffffff)",
                color: "var(--tafsir-text-muted, #9ca3af)",
              }}>
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
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl" style={{
            background: "var(--tafsir-gradient-hero, linear-gradient(135deg, #faf8f4, #f3f0ea))",
            border: "1px solid var(--tafsir-card-border, rgba(201,162,39,0.12))",
          }}>
            <h3 className="font-serif text-xl" style={{ color: "var(--tafsir-text, #1a1a1a)" }}>Continuer la lecture</h3>
            <Link
              to="/tafsir"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors shadow-lg"
              style={{
                background: "var(--tafsir-primary, #c9a227)",
                color: "#fff",
                boxShadow: `0 8px 24px var(--tafsir-primary, #c9a227)30`,
              }}
            >
              <BookOpen size={18} />
              Explorer tous les tafsirs
            </Link>
          </div>
        </div>
      </div>

      {/* Theme-aware article styles */}
      <style>{`
        .tafsir-detail-page {
          min-height: 100vh;
          background: var(--tafsir-bg, #faf8f4);
        }
        .font-arabic {
          font-family: 'Amiri', 'Traditional Arabic', serif;
        }
        .article-content {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 1.125rem;
          line-height: 1.75;
          color: var(--tafsir-text-secondary, #6b7280);
        }
        .article-content h1 {
          font-family: 'Georgia', serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--tafsir-text, #1a1a1a);
          margin: 2rem 0 1rem;
          line-height: 1.3;
        }
        .article-content h2 {
          font-family: 'Georgia', serif;
          font-size: 1.35rem;
          font-weight: 600;
          color: var(--tafsir-text, #1a1a1a);
          margin: 2.5rem 0 1rem;
          padding-bottom: 0.5rem;
          position: relative;
          line-height: 1.35;
          border-bottom: 1px solid var(--tafsir-border, rgba(0,0,0,0.06));
        }
        .article-content h2::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 50px;
          height: 1px;
          background: var(--tafsir-primary, #c9a227);
        }
        .article-content h3 {
          font-family: 'Georgia', serif;
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--tafsir-primary, #c9a227);
          margin: 2rem 0 0.75rem;
          line-height: 1.35;
        }
        .article-content h4 {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--tafsir-text, #1a1a1a);
          margin: 1.5rem 0 0.75rem;
        }
        .article-content p {
          margin-bottom: 1.25rem;
          color: var(--tafsir-text-secondary, #6b7280);
        }
        .article-content strong, .article-content b {
          font-weight: 600;
          color: var(--tafsir-text, #1a1a1a);
        }
        .article-content blockquote {
          font-style: italic;
          font-size: 1.05rem;
          line-height: 1.7;
          color: var(--tafsir-text-secondary, #6b7280);
          padding: 1rem 1.25rem;
          margin: 1.5rem 0;
          background: var(--tafsir-blockquote-bg, linear-gradient(to right, rgba(201,162,39,0.06), transparent));
          border-left: 3px solid var(--tafsir-blockquote-border, #c9a227);
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
          color: var(--tafsir-primary, #c9a227);
        }
        .article-content hr {
          border: none;
          height: 1px;
          background: var(--tafsir-divider, linear-gradient(to right, transparent, rgba(0,0,0,0.1), transparent));
          margin: 2rem 0;
        }
        .article-content a {
          color: var(--tafsir-primary, #c9a227);
          text-decoration: underline;
          text-decoration-color: color-mix(in srgb, var(--tafsir-primary, #c9a227) 30%, transparent);
          text-underline-offset: 2px;
          transition: text-decoration-color 150ms;
        }
        .article-content a:hover {
          text-decoration-color: var(--tafsir-primary, #c9a227);
        }
        .article-content em {
          font-style: italic;
        }
        .article-content code {
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 0.875em;
          padding: 0.15em 0.4em;
          background: var(--tafsir-bg-alt, #f3f0ea);
          border-radius: 0.25rem;
          color: var(--tafsir-primary, #c9a227);
        }
        .article-content pre {
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 0.875rem;
          padding: 1.25rem;
          background: var(--tafsir-bg-alt, #f3f0ea);
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
          border: 1px solid var(--tafsir-border, rgba(0,0,0,0.06));
        }
        .article-content pre code {
          padding: 0;
          background: none;
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
