import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  preview: {
    bg: string;
    card: string;
    primary: string;
    accent: string;
    text: string;
    textMuted: string;
  };
  variables: Record<string, string>;
}

export const TAFSIR_THEMES: ThemeDefinition[] = [
  {
    id: 'nuit-sacree',
    name: 'Nuit Sacrée',
    description: 'Bleu nuit profond avec accents dorés — inspiré du ciel nocturne du désert',
    preview: {
      bg: '#0f1724',
      card: '#1a2735',
      primary: '#c9a227',
      accent: '#4ade80',
      text: '#e8e0d0',
      textMuted: '#8a8070',
    },
    variables: {
      '--tafsir-bg': '#0f1724',
      '--tafsir-bg-alt': '#14202e',
      '--tafsir-card': '#1a2735',
      '--tafsir-card-hover': '#1f3040',
      '--tafsir-card-border': 'rgba(201,162,39,0.15)',
      '--tafsir-primary': '#c9a227',
      '--tafsir-primary-light': '#d9b84a',
      '--tafsir-primary-soft': 'rgba(201,162,39,0.1)',
      '--tafsir-accent': '#4ade80',
      '--tafsir-accent-soft': 'rgba(74,222,128,0.1)',
      '--tafsir-text': '#e8e0d0',
      '--tafsir-text-secondary': '#a89e8e',
      '--tafsir-text-muted': '#6a6055',
      '--tafsir-border': 'rgba(255,255,255,0.06)',
      '--tafsir-gradient-hero': 'linear-gradient(135deg, #0f1724 0%, #1a2735 100%)',
      '--tafsir-shadow': '0 4px 24px rgba(0,0,0,0.3)',
      '--tafsir-badge-bg': 'rgba(201,162,39,0.1)',
      '--tafsir-badge-text': '#c9a227',
      '--tafsir-blockquote-bg': 'linear-gradient(to right, rgba(201,162,39,0.08), transparent)',
      '--tafsir-blockquote-border': '#c9a227',
      '--tafsir-divider': 'linear-gradient(to right, transparent, rgba(201,162,39,0.3), transparent)',
    },
  },
  {
    id: 'aube-doree',
    name: 'Aube Dorée',
    description: 'Fond crème avec accents émeraude et or — doux et lumineux',
    preview: {
      bg: '#faf8f4',
      card: '#ffffff',
      primary: '#c9a227',
      accent: '#2e7d32',
      text: '#1a1a1a',
      textMuted: '#9ca3af',
    },
    variables: {
      '--tafsir-bg': '#faf8f4',
      '--tafsir-bg-alt': '#f3f0ea',
      '--tafsir-card': '#ffffff',
      '--tafsir-card-hover': '#fffef9',
      '--tafsir-card-border': 'rgba(201,162,39,0.12)',
      '--tafsir-primary': '#c9a227',
      '--tafsir-primary-light': '#d9b84a',
      '--tafsir-primary-soft': 'rgba(201,162,39,0.08)',
      '--tafsir-accent': '#2e7d32',
      '--tafsir-accent-soft': 'rgba(46,125,50,0.06)',
      '--tafsir-text': '#1a1a1a',
      '--tafsir-text-secondary': '#6b7280',
      '--tafsir-text-muted': '#9ca3af',
      '--tafsir-border': 'rgba(0,0,0,0.06)',
      '--tafsir-gradient-hero': 'linear-gradient(135deg, #faf8f4 0%, #f3f0ea 100%)',
      '--tafsir-shadow': '0 4px 24px rgba(0,0,0,0.06)',
      '--tafsir-badge-bg': 'rgba(201,162,39,0.08)',
      '--tafsir-badge-text': '#9a7a1c',
      '--tafsir-blockquote-bg': 'linear-gradient(to right, rgba(201,162,39,0.06), transparent)',
      '--tafsir-blockquote-border': '#c9a227',
      '--tafsir-divider': 'linear-gradient(to right, transparent, rgba(0,0,0,0.1), transparent)',
    },
  },
  {
    id: 'emeraude',
    name: 'Émeraude Profonde',
    description: 'Vert islamique profond avec or — classique et majestueux',
    preview: {
      bg: '#0a2e1a',
      card: '#0f3d24',
      primary: '#d4af37',
      accent: '#6ee7b7',
      text: '#e8f5e9',
      textMuted: '#81c784',
    },
    variables: {
      '--tafsir-bg': '#0a2e1a',
      '--tafsir-bg-alt': '#0d3820',
      '--tafsir-card': '#0f3d24',
      '--tafsir-card-hover': '#134a2c',
      '--tafsir-card-border': 'rgba(212,175,55,0.2)',
      '--tafsir-primary': '#d4af37',
      '--tafsir-primary-light': '#e8c84a',
      '--tafsir-primary-soft': 'rgba(212,175,55,0.12)',
      '--tafsir-accent': '#6ee7b7',
      '--tafsir-accent-soft': 'rgba(110,231,183,0.08)',
      '--tafsir-text': '#e8f5e9',
      '--tafsir-text-secondary': '#81c784',
      '--tafsir-text-muted': '#4caf50',
      '--tafsir-border': 'rgba(255,255,255,0.05)',
      '--tafsir-gradient-hero': 'linear-gradient(135deg, #0a2e1a 0%, #0d3820 100%)',
      '--tafsir-shadow': '0 4px 24px rgba(0,0,0,0.35)',
      '--tafsir-badge-bg': 'rgba(212,175,55,0.12)',
      '--tafsir-badge-text': '#d4af37',
      '--tafsir-blockquote-bg': 'linear-gradient(to right, rgba(212,175,55,0.1), transparent)',
      '--tafsir-blockquote-border': '#d4af37',
      '--tafsir-divider': 'linear-gradient(to right, transparent, rgba(212,175,55,0.3), transparent)',
    },
  },
  {
    id: 'mosquee-blanche',
    name: 'Mosquée Blanche',
    description: 'Blanc pur avec turquoise — minimaliste et apaisant',
    preview: {
      bg: '#f8fffe',
      card: '#ffffff',
      primary: '#0d9488',
      accent: '#f59e0b',
      text: '#1e293b',
      textMuted: '#94a3b8',
    },
    variables: {
      '--tafsir-bg': '#f8fffe',
      '--tafsir-bg-alt': '#f0f7f5',
      '--tafsir-card': '#ffffff',
      '--tafsir-card-hover': '#fafffe',
      '--tafsir-card-border': 'rgba(13,148,136,0.12)',
      '--tafsir-primary': '#0d9488',
      '--tafsir-primary-light': '#14b8a6',
      '--tafsir-primary-soft': 'rgba(13,148,136,0.08)',
      '--tafsir-accent': '#f59e0b',
      '--tafsir-accent-soft': 'rgba(245,158,11,0.06)',
      '--tafsir-text': '#1e293b',
      '--tafsir-text-secondary': '#64748b',
      '--tafsir-text-muted': '#94a3b8',
      '--tafsir-border': 'rgba(0,0,0,0.06)',
      '--tafsir-gradient-hero': 'linear-gradient(135deg, #f8fffe 0%, #f0f7f5 100%)',
      '--tafsir-shadow': '0 4px 24px rgba(13,148,136,0.08)',
      '--tafsir-badge-bg': 'rgba(13,148,136,0.08)',
      '--tafsir-badge-text': '#0d9488',
      '--tafsir-blockquote-bg': 'linear-gradient(to right, rgba(13,148,136,0.06), transparent)',
      '--tafsir-blockquote-border': '#0d9488',
      '--tafsir-divider': 'linear-gradient(to right, transparent, rgba(13,148,136,0.2), transparent)',
    },
  },
  {
    id: 'desert',
    name: 'Désert',
    description: 'Tons sable et ambre — chaleureux comme le Sahara',
    preview: {
      bg: '#fdf6ec',
      card: '#fffaf0',
      primary: '#b8860b',
      accent: '#d2691e',
      text: '#3e2c1c',
      textMuted: '#a08060',
    },
    variables: {
      '--tafsir-bg': '#fdf6ec',
      '--tafsir-bg-alt': '#f5ead6',
      '--tafsir-card': '#fffaf0',
      '--tafsir-card-hover': '#fff8e8',
      '--tafsir-card-border': 'rgba(184,134,11,0.15)',
      '--tafsir-primary': '#b8860b',
      '--tafsir-primary-light': '#daa520',
      '--tafsir-primary-soft': 'rgba(184,134,11,0.08)',
      '--tafsir-accent': '#d2691e',
      '--tafsir-accent-soft': 'rgba(210,105,30,0.06)',
      '--tafsir-text': '#3e2c1c',
      '--tafsir-text-secondary': '#8b6914',
      '--tafsir-text-muted': '#a08060',
      '--tafsir-border': 'rgba(0,0,0,0.06)',
      '--tafsir-gradient-hero': 'linear-gradient(135deg, #fdf6ec 0%, #f5ead6 100%)',
      '--tafsir-shadow': '0 4px 24px rgba(139,105,20,0.08)',
      '--tafsir-badge-bg': 'rgba(184,134,11,0.08)',
      '--tafsir-badge-text': '#b8860b',
      '--tafsir-blockquote-bg': 'linear-gradient(to right, rgba(184,134,11,0.06), transparent)',
      '--tafsir-blockquote-border': '#b8860b',
      '--tafsir-divider': 'linear-gradient(to right, transparent, rgba(184,134,11,0.2), transparent)',
    },
  },
  {
    id: 'ramadan',
    name: 'Nuit de Ramadan',
    description: 'Violet profond avec argent et or — mystique et spirituel',
    preview: {
      bg: '#1a1025',
      card: '#241835',
      primary: '#c9a227',
      accent: '#c084fc',
      text: '#e8dff0',
      textMuted: '#8a7a9a',
    },
    variables: {
      '--tafsir-bg': '#1a1025',
      '--tafsir-bg-alt': '#201530',
      '--tafsir-card': '#241835',
      '--tafsir-card-hover': '#2d1e42',
      '--tafsir-card-border': 'rgba(201,162,39,0.15)',
      '--tafsir-primary': '#c9a227',
      '--tafsir-primary-light': '#d9b84a',
      '--tafsir-primary-soft': 'rgba(201,162,39,0.1)',
      '--tafsir-accent': '#c084fc',
      '--tafsir-accent-soft': 'rgba(192,132,252,0.08)',
      '--tafsir-text': '#e8dff0',
      '--tafsir-text-secondary': '#a898b8',
      '--tafsir-text-muted': '#6a5a7a',
      '--tafsir-border': 'rgba(255,255,255,0.05)',
      '--tafsir-gradient-hero': 'linear-gradient(135deg, #1a1025 0%, #201530 100%)',
      '--tafsir-shadow': '0 4px 24px rgba(0,0,0,0.35)',
      '--tafsir-badge-bg': 'rgba(192,132,252,0.1)',
      '--tafsir-badge-text': '#c084fc',
      '--tafsir-blockquote-bg': 'linear-gradient(to right, rgba(192,132,252,0.06), transparent)',
      '--tafsir-blockquote-border': '#c084fc',
      '--tafsir-divider': 'linear-gradient(to right, transparent, rgba(201,162,39,0.3), transparent)',
    },
  },
];

function getThemeById(id: string): ThemeDefinition | undefined {
  return TAFSIR_THEMES.find(t => t.id === id);
}

export function applyTafsirTheme(themeId: string) {
  const theme = getThemeById(themeId);
  if (!theme) return;
  Object.entries(theme.variables).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
  document.documentElement.setAttribute('data-tafsir-theme', themeId);
  localStorage.setItem('tafsir_theme', themeId);
}

const THEMES = {
  dark: {
    '--modern-bg-dark': '#0f1923',
    '--modern-card-bg': 'rgba(255, 255, 255, 0.05)',
    '--modern-text-primary': '#ffffff',
    '--modern-text-secondary': '#a0a8b3',
    '--modern-border-color': 'rgba(255, 255, 255, 0.1)',
    '--modern-header-bg': 'rgba(15, 25, 35, 0.95)',
    '--modern-primary': '#4ade80',
    '--modern-gold': '#fbbf24',
  },
  light: {
    '--modern-bg-dark': '#f5f7fa',
    '--modern-card-bg': '#ffffff',
    '--modern-text-primary': '#1a1a2e',
    '--modern-text-secondary': '#6b7280',
    '--modern-border-color': 'rgba(0, 0, 0, 0.1)',
    '--modern-header-bg': 'rgba(255, 255, 255, 0.95)',
    '--modern-primary': '#2e7d32',
    '--modern-gold': '#D4AF37',
  }
};

function applyThemeVariables(theme: 'dark' | 'light') {
  const vars = THEMES[theme];
  if (!vars) return;
  Object.entries(vars).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
  document.documentElement.setAttribute('data-theme', theme);
}

export function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light' | 'auto'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('modern_theme') as 'dark' | 'light' | 'auto';
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    if (theme === 'auto') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      applyThemeVariables(systemTheme);
    } else {
      applyThemeVariables(theme);
    }
    localStorage.setItem('modern_theme', theme);
  }, [theme]);

  return { theme, setTheme };
}

export interface SiteConfig {
  site_name: string;
  logo_url: string;
  favicon_url: string;
  primary_phone: string;
  secondary_phone: string;
  email: string;
  address: string;
  facebook_url: string;
  youtube_url: string;
  whatsapp_number: string;
  telegram_url: string;
  twitter_url: string;
  instagram_url: string;
  footer_text: string;
  primary_color: string;
  secondary_color: string;
  radio_stream_url: string;
  youtube_api_key: string;
  use_modern_ui: boolean;
  modern_theme: 'dark' | 'light' | 'auto';
  tafsir_theme: string;
}

const DEFAULT_CONFIG: SiteConfig = {
  site_name: "RADIO IQRA TV",
  logo_url: "",
  favicon_url: "",
  primary_phone: "+226 25 30 00 00",
  secondary_phone: "",
  email: "contact@iqra.tv",
  address: "Ouagadougou, Burkina Faso",
  facebook_url: "",
  youtube_url: "https://www.youtube.com/channel/UCJ9nE4p5YlbTsP_fLZvxRLw",
  whatsapp_number: "",
  telegram_url: "",
  twitter_url: "",
  instagram_url: "",
  footer_text: "© 2024 RADIO IQRA TV - La voix du Saint Coran au Burkina Faso",
  primary_color: "#2e7d32",
  secondary_color: "#D4AF37",
  radio_stream_url: "https://stream.radio.co/s8f8f8f8f8/listen",
  youtube_api_key: "",
  use_modern_ui: false,
  modern_theme: 'dark',
  tafsir_theme: 'aube-doree',
};

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('*')
          .eq('id', 1)
          .single();

        if (error) throw error;
        if (data) {
          const mergedConfig: SiteConfig = {
            ...DEFAULT_CONFIG,
            ...data,
            modern_theme: data.modern_theme || localStorage.getItem('modern_theme') || DEFAULT_CONFIG.modern_theme,
            tafsir_theme: data.tafsir_theme || localStorage.getItem('tafsir_theme') || DEFAULT_CONFIG.tafsir_theme,
          };
          setConfig(mergedConfig);
          
          document.documentElement.style.setProperty('--iqra-green', data.primary_color || DEFAULT_CONFIG.primary_color);
          document.documentElement.style.setProperty('--iqra-gold', data.secondary_color || DEFAULT_CONFIG.secondary_color);
          
          const theme = mergedConfig.modern_theme;
          const resolvedTheme = theme === 'auto'
            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : theme;
          applyThemeVariables(resolvedTheme);

          const tafsirTheme = mergedConfig.tafsir_theme;
          applyTafsirTheme(tafsirTheme);
          
          if (data.site_name) document.title = data.site_name;
          if (data.favicon_url) {
            let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.head.appendChild(link);
            }
            link.href = data.favicon_url;
          }
        }
      } catch (err) {
        console.error("Error loading site config:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchConfig();
  }, []);

  return { config, loading };
}
