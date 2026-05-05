import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
  modern_theme: 'dark'
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
          setConfig(data);
          
          // Apply dynamic colors to CSS variables
          document.documentElement.style.setProperty('--iqra-green', data.primary_color || DEFAULT_CONFIG.primary_color);
          document.documentElement.style.setProperty('--iqra-gold', data.secondary_color || DEFAULT_CONFIG.secondary_color);
          
          // Apply modern theme CSS variables
          const theme = data.modern_theme || 'dark';
          applyThemeVariables(theme);
          
          // Apply title and favicon
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
