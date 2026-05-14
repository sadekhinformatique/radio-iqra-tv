import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
  // New fields for Hero
  hero_title_1: string;
  hero_title_2: string;
  hero_subtitle: string;
  hero_image_url: string;
  // New fields for Donation
  donation_title: string;
  donation_description: string;
  donation_goal: number;
  donation_current: number;
  // New fields for Daily Quote
  daily_quote: string;
  daily_quote_author: string;
  // Prayer location
  prayer_location: string;
  // About Page texts
  about_history: string;
  about_mission: string;
  about_vision: string;
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
  youtube_url: "",
  whatsapp_number: "",
  telegram_url: "",
  twitter_url: "",
  instagram_url: "",
  footer_text: "© 2024 RADIO IQRA TV - La voix du Saint Coran au Burkina Faso",
  primary_color: "#2e7d32",
  secondary_color: "#D4AF37",
  radio_stream_url: "https://stream.radio.co/s8f8f8f8f8/listen",
  youtube_api_key: "",
  use_modern_ui: true,
  hero_title_1: "La Foi Connectée,",
  hero_title_2: "Le Savoir Partagé.",
  hero_subtitle: "Découvrez une expérience spirituelle unique avec RADIO IQRA TV. Streaming HD, podcasts exclusifs et enseignements authentiques.",
  hero_image_url: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
  donation_title: "Unissez-vous pour le Savoir.",
  donation_description: "Votre soutien permet à RADIO IQRA TV de continuer sa mission d'éducation et de partage spirituel à travers le monde. Chaque don compte.",
  donation_goal: 20000000,
  donation_current: 15000000,
  daily_quote: "Le meilleur d'entre vous est celui qui apprend le Coran et l'enseigne.",
  daily_quote_author: "Rapporté par Al-Boukhari",
  prayer_location: "OUAGADOUGOU",
  about_history: "Fondée avec la vision d'apporter la lumière du Coran dans chaque foyer, RADIO IQRA TV a grandi pour devenir une référence spirituelle.",
  about_mission: "Notre mission est de diffuser les enseignements authentiques de l'Islam à travers des programmes de haute qualité.",
  about_vision: "Devenir le premier média islamique numérique en Afrique francophone d'ici 2030."
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
