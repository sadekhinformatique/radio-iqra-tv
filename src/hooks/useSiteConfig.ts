import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/* ═══════════════════════════════════════════════════════════════
   FULL SITE THEMES — Thèmes complets pour tout le site
   ═══════════════════════════════════════════════════════════════ */

export interface SiteTheme {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  style: 'dark' | 'light';
  preview: {
    bg: string;
    headerBg: string;
    footerBg: string;
    cardBg: string;
    primary: string;
    gold: string;
    text: string;
    textMuted: string;
    border: string;
  };
  variables: Record<string, string>;
}

export const SITE_THEMES: SiteTheme[] = [
  {
    id: 'medine-nuit',
    name: 'Médine la Nuit',
    nameAr: 'المدينة ليلاً',
    description: 'Bleu nuit profond avec or — inspiré des mosquées illuminées après le Maghrib',
    style: 'dark',
    preview: {
      bg: '#0a0e1a',
      headerBg: '#0d1220',
      footerBg: '#060912',
      cardBg: '#111827',
      primary: '#4ade80',
      gold: '#fbbf24',
      text: '#f1f5f9',
      textMuted: '#64748b',
      border: 'rgba(255,255,255,0.06)',
    },
    variables: {
      '--site-bg': '#0a0e1a',
      '--site-bg-alt': '#0d1220',
      '--site-header-bg': 'rgba(13,18,32,0.92)',
      '--site-header-border': 'rgba(251,191,36,0.12)',
      '--site-footer-bg': '#060912',
      '--site-footer-border': 'rgba(251,191,36,0.08)',
      '--site-card': '#111827',
      '--site-card-hover': '#1a2332',
      '--site-card-border': 'rgba(255,255,255,0.06)',
      '--site-primary': '#4ade80',
      '--primary-soft': 'rgba(74,222,128,0.12)',
      '--primary-glow': 'rgba(74,222,128,0.25)',
      '--site-gold': '#fbbf24',
      '--gold-soft': 'rgba(251,191,36,0.12)',
      '--site-text': '#f1f5f9',
      '--site-text-secondary': '#94a3b8',
      '--site-text-muted': '#64748b',
      '--site-border': 'rgba(255,255,255,0.06)',
      '--site-shadow': '0 4px 32px rgba(0,0,0,0.4)',
      '--site-shadow-gold': '0 4px 24px rgba(251,191,36,0.08)',
      '--site-pattern-opacity': '0.03',
      '--site-gradient-hero': 'linear-gradient(135deg, #0a0e1a 0%, #0d1220 50%, #111827 100%)',
      '--site-btn-bg': '#4ade80',
      '--site-btn-text': '#0a0e1a',
      '--site-badge-bg': 'rgba(251,191,36,0.1)',
      '--site-badge-text': '#fbbf24',
      '--site-divider': 'linear-gradient(to right, transparent, rgba(251,191,36,0.15), transparent)',
      '--site-overlay': 'rgba(0,0,0,0.6)',
      '--site-input-bg': 'rgba(255,255,255,0.04)',
      '--site-input-border': 'rgba(255,255,255,0.08)',
      '--site-player-bg': 'rgba(13,18,32,0.95)',
    },
  },
  {
    id: 'aube-sacree',
    name: 'Aube Sacrée',
    nameAr: 'الفجر المقدس',
    description: 'Crème chaud avec vert émeraude et or — la lumière douce du Fajr',
    style: 'light',
    preview: {
      bg: '#faf8f2',
      headerBg: '#ffffff',
      footerBg: '#1a2e1a',
      cardBg: '#ffffff',
      primary: '#2e7d32',
      gold: '#c9a227',
      text: '#1a1a2e',
      textMuted: '#9ca3af',
      border: 'rgba(0,0,0,0.06)',
    },
    variables: {
      '--site-bg': '#faf8f2',
      '--site-bg-alt': '#f3f0e8',
      '--site-header-bg': 'rgba(255,255,255,0.92)',
      '--site-header-border': 'rgba(201,162,39,0.12)',
      '--site-footer-bg': '#1a2e1a',
      '--site-footer-border': 'rgba(201,162,39,0.1)',
      '--site-card': '#ffffff',
      '--site-card-hover': '#fefdf8',
      '--site-card-border': 'rgba(0,0,0,0.06)',
      '--site-primary': '#2e7d32',
      '--primary-soft': 'rgba(46,125,50,0.08)',
      '--primary-glow': 'rgba(46,125,50,0.15)',
      '--site-gold': '#c9a227',
      '--gold-soft': 'rgba(201,162,39,0.08)',
      '--site-text': '#1a1a2e',
      '--site-text-secondary': '#4b5563',
      '--site-text-muted': '#9ca3af',
      '--site-border': 'rgba(0,0,0,0.06)',
      '--site-shadow': '0 4px 32px rgba(0,0,0,0.06)',
      '--site-shadow-gold': '0 4px 24px rgba(201,162,39,0.08)',
      '--site-pattern-opacity': '0.02',
      '--site-gradient-hero': 'linear-gradient(135deg, #faf8f2 0%, #f3f0e8 50%, #ede8dc 100%)',
      '--site-btn-bg': '#2e7d32',
      '--site-btn-text': '#ffffff',
      '--site-badge-bg': 'rgba(201,162,39,0.08)',
      '--site-badge-text': '#9a7a1c',
      '--site-divider': 'linear-gradient(to right, transparent, rgba(201,162,39,0.15), transparent)',
      '--site-overlay': 'rgba(0,0,0,0.3)',
      '--site-input-bg': '#f9f7f0',
      '--site-input-border': 'rgba(0,0,0,0.08)',
      '--site-player-bg': 'rgba(255,255,255,0.95)',
    },
  },
  {
    id: 'mosquee-blanche',
    name: 'Mosquée Blanche',
    nameAr: 'المسجد الأبيض',
    description: 'Blanc pur avec turquoise — minimaliste comme les mosquées de Médine',
    style: 'light',
    preview: {
      bg: '#f8fffe',
      headerBg: '#ffffff',
      footerBg: '#0f2922',
      cardBg: '#ffffff',
      primary: '#0d9488',
      gold: '#f59e0b',
      text: '#1e293b',
      textMuted: '#94a3b8',
      border: 'rgba(0,0,0,0.06)',
    },
    variables: {
      '--site-bg': '#f8fffe',
      '--site-bg-alt': '#f0f7f5',
      '--site-header-bg': 'rgba(255,255,255,0.94)',
      '--site-header-border': 'rgba(13,148,136,0.1)',
      '--site-footer-bg': '#0f2922',
      '--site-footer-border': 'rgba(13,148,136,0.15)',
      '--site-card': '#ffffff',
      '--site-card-hover': '#fafffe',
      '--site-card-border': 'rgba(0,0,0,0.05)',
      '--site-primary': '#0d9488',
      '--primary-soft': 'rgba(13,148,136,0.08)',
      '--primary-glow': 'rgba(13,148,136,0.15)',
      '--site-gold': '#f59e0b',
      '--gold-soft': 'rgba(245,158,11,0.08)',
      '--site-text': '#1e293b',
      '--site-text-secondary': '#475569',
      '--site-text-muted': '#94a3b8',
      '--site-border': 'rgba(0,0,0,0.05)',
      '--site-shadow': '0 4px 32px rgba(13,148,136,0.06)',
      '--site-shadow-gold': '0 4px 24px rgba(245,158,11,0.06)',
      '--site-pattern-opacity': '0.015',
      '--site-gradient-hero': 'linear-gradient(135deg, #f8fffe 0%, #f0f7f5 50%, #e8f4f0 100%)',
      '--site-btn-bg': '#0d9488',
      '--site-btn-text': '#ffffff',
      '--site-badge-bg': 'rgba(13,148,136,0.08)',
      '--site-badge-text': '#0d9488',
      '--site-divider': 'linear-gradient(to right, transparent, rgba(13,148,136,0.15), transparent)',
      '--site-overlay': 'rgba(0,0,0,0.3)',
      '--site-input-bg': '#f4fafa',
      '--site-input-border': 'rgba(0,0,0,0.06)',
      '--site-player-bg': 'rgba(255,255,255,0.95)',
    },
  },
  {
    id: 'desert-dore',
    name: 'Désert Doré',
    nameAr: 'الصحراء الذهبية',
    description: 'Tons sable, ambre et terre — la chaleur du Sahara au coucher du soleil',
    style: 'light',
    preview: {
      bg: '#fdf6ec',
      headerBg: '#fff8f0',
      footerBg: '#2c1810',
      cardBg: '#fffaf0',
      primary: '#b8860b',
      gold: '#d4a017',
      text: '#3e2c1c',
      textMuted: '#a08060',
      border: 'rgba(0,0,0,0.06)',
    },
    variables: {
      '--site-bg': '#fdf6ec',
      '--site-bg-alt': '#f5ead6',
      '--site-header-bg': 'rgba(255,248,240,0.94)',
      '--site-header-border': 'rgba(184,134,11,0.12)',
      '--site-footer-bg': '#2c1810',
      '--site-footer-border': 'rgba(184,134,11,0.1)',
      '--site-card': '#fffaf0',
      '--site-card-hover': '#fff8e8',
      '--site-card-border': 'rgba(184,134,11,0.1)',
      '--site-primary': '#b8860b',
      '--primary-soft': 'rgba(184,134,11,0.08)',
      '--primary-glow': 'rgba(184,134,11,0.15)',
      '--site-gold': '#d4a017',
      '--gold-soft': 'rgba(212,160,23,0.08)',
      '--site-text': '#3e2c1c',
      '--site-text-secondary': '#6b4c2a',
      '--site-text-muted': '#a08060',
      '--site-border': 'rgba(0,0,0,0.06)',
      '--site-shadow': '0 4px 32px rgba(139,105,20,0.08)',
      '--site-shadow-gold': '0 4px 24px rgba(212,160,23,0.08)',
      '--site-pattern-opacity': '0.02',
      '--site-gradient-hero': 'linear-gradient(135deg, #fdf6ec 0%, #f5ead6 50%, #ede0c8 100%)',
      '--site-btn-bg': '#b8860b',
      '--site-btn-text': '#ffffff',
      '--site-badge-bg': 'rgba(184,134,11,0.08)',
      '--site-badge-text': '#b8860b',
      '--site-divider': 'linear-gradient(to right, transparent, rgba(184,134,11,0.15), transparent)',
      '--site-overlay': 'rgba(0,0,0,0.3)',
      '--site-input-bg': '#f9f4ea',
      '--site-input-border': 'rgba(0,0,0,0.08)',
      '--site-player-bg': 'rgba(255,248,240,0.95)',
    },
  },
  {
    id: 'ramadan-mystique',
    name: 'Ramadan Mystique',
    nameAr: 'رمضان صوفي',
    description: 'Violet profond avec or et argent — la spiritualité des nuits de Ramadan',
    style: 'dark',
    preview: {
      bg: '#120a1e',
      headerBg: '#170e28',
      footerBg: '#0a0612',
      cardBg: '#1e1430',
      primary: '#c084fc',
      gold: '#fbbf24',
      text: '#ede8f5',
      textMuted: '#7c6a9a',
      border: 'rgba(255,255,255,0.05)',
    },
    variables: {
      '--site-bg': '#120a1e',
      '--site-bg-alt': '#170e28',
      '--site-header-bg': 'rgba(23,14,40,0.92)',
      '--site-header-border': 'rgba(192,132,252,0.1)',
      '--site-footer-bg': '#0a0612',
      '--site-footer-border': 'rgba(192,132,252,0.08)',
      '--site-card': '#1e1430',
      '--site-card-hover': '#261a3d',
      '--site-card-border': 'rgba(255,255,255,0.05)',
      '--site-primary': '#c084fc',
      '--primary-soft': 'rgba(192,132,252,0.1)',
      '--primary-glow': 'rgba(192,132,252,0.2)',
      '--site-gold': '#fbbf24',
      '--gold-soft': 'rgba(251,191,36,0.1)',
      '--site-text': '#ede8f5',
      '--site-text-secondary': '#a898c0',
      '--site-text-muted': '#7c6a9a',
      '--site-border': 'rgba(255,255,255,0.05)',
      '--site-shadow': '0 4px 32px rgba(0,0,0,0.4)',
      '--site-shadow-gold': '0 4px 24px rgba(192,132,252,0.1)',
      '--site-pattern-opacity': '0.025',
      '--site-gradient-hero': 'linear-gradient(135deg, #120a1e 0%, #170e28 50%, #1e1430 100%)',
      '--site-btn-bg': '#c084fc',
      '--site-btn-text': '#120a1e',
      '--site-badge-bg': 'rgba(251,191,36,0.1)',
      '--site-badge-text': '#fbbf24',
      '--site-divider': 'linear-gradient(to right, transparent, rgba(192,132,252,0.15), transparent)',
      '--site-overlay': 'rgba(0,0,0,0.6)',
      '--site-input-bg': 'rgba(255,255,255,0.04)',
      '--site-input-border': 'rgba(255,255,255,0.08)',
      '--site-player-bg': 'rgba(23,14,40,0.95)',
    },
  },
  {
    id: 'andalousie',
    name: 'Andalousie',
    nameAr: 'الأندلس',
    description: 'Terracotta, bleu azur et or — les jardins de Grenade et Cordoue',
    style: 'light',
    preview: {
      bg: '#fef7f0',
      headerBg: '#ffffff',
      footerBg: '#3d1c0e',
      cardBg: '#ffffff',
      primary: '#1565c0',
      gold: '#c9a227',
      text: '#2c1810',
      textMuted: '#a08060',
      border: 'rgba(0,0,0,0.06)',
    },
    variables: {
      '--site-bg': '#fef7f0',
      '--site-bg-alt': '#f9ece0',
      '--site-header-bg': 'rgba(255,255,255,0.94)',
      '--site-header-border': 'rgba(201,162,39,0.1)',
      '--site-footer-bg': '#3d1c0e',
      '--site-footer-border': 'rgba(201,162,39,0.08)',
      '--site-card': '#ffffff',
      '--site-card-hover': '#fffaf5',
      '--site-card-border': 'rgba(0,0,0,0.05)',
      '--site-primary': '#1565c0',
      '--primary-soft': 'rgba(21,101,192,0.08)',
      '--primary-glow': 'rgba(21,101,192,0.15)',
      '--site-gold': '#c9a227',
      '--gold-soft': 'rgba(201,162,39,0.08)',
      '--site-text': '#2c1810',
      '--site-text-secondary': '#5a3e28',
      '--site-text-muted': '#a08060',
      '--site-border': 'rgba(0,0,0,0.05)',
      '--site-shadow': '0 4px 32px rgba(21,101,192,0.06)',
      '--site-shadow-gold': '0 4px 24px rgba(201,162,39,0.06)',
      '--site-pattern-opacity': '0.02',
      '--site-gradient-hero': 'linear-gradient(135deg, #fef7f0 0%, #f9ece0 50%, #f5e2d0 100%)',
      '--site-btn-bg': '#1565c0',
      '--site-btn-text': '#ffffff',
      '--site-badge-bg': 'rgba(201,162,39,0.08)',
      '--site-badge-text': '#9a7a1c',
      '--site-divider': 'linear-gradient(to right, transparent, rgba(21,101,192,0.12), transparent)',
      '--site-overlay': 'rgba(0,0,0,0.3)',
      '--site-input-bg': '#faf4ec',
      '--site-input-border': 'rgba(0,0,0,0.08)',
      '--site-player-bg': 'rgba(255,255,255,0.95)',
    },
  },
  {
    id: 'kaaba-noire',
    name: 'Kaaba Royale',
    nameAr: 'الكعبة الملكية',
    description: 'Noir profond avec or pur — la majesté de la Kaaba',
    style: 'dark',
    preview: {
      bg: '#0a0a0a',
      headerBg: '#111111',
      footerBg: '#050505',
      cardBg: '#161616',
      primary: '#d4af37',
      gold: '#f0d060',
      text: '#f5f0e0',
      textMuted: '#8a8070',
      border: 'rgba(212,175,55,0.1)',
    },
    variables: {
      '--site-bg': '#0a0a0a',
      '--site-bg-alt': '#0f0f0f',
      '--site-header-bg': 'rgba(17,17,17,0.95)',
      '--site-header-border': 'rgba(212,175,55,0.15)',
      '--site-footer-bg': '#050505',
      '--site-footer-border': 'rgba(212,175,55,0.1)',
      '--site-card': '#161616',
      '--site-card-hover': '#1e1e1e',
      '--site-card-border': 'rgba(212,175,55,0.1)',
      '--site-primary': '#d4af37',
      '--primary-soft': 'rgba(212,175,55,0.1)',
      '--primary-glow': 'rgba(212,175,55,0.2)',
      '--site-gold': '#f0d060',
      '--gold-soft': 'rgba(240,208,96,0.1)',
      '--site-text': '#f5f0e0',
      '--site-text-secondary': '#a8a090',
      '--site-text-muted': '#6a6055',
      '--site-border': 'rgba(212,175,55,0.08)',
      '--site-shadow': '0 4px 32px rgba(0,0,0,0.5)',
      '--site-shadow-gold': '0 4px 24px rgba(212,175,55,0.12)',
      '--site-pattern-opacity': '0.03',
      '--site-gradient-hero': 'linear-gradient(135deg, #0a0a0a 0%, #0f0f0f 50%, #141414 100%)',
      '--site-btn-bg': '#d4af37',
      '--site-btn-text': '#0a0a0a',
      '--site-badge-bg': 'rgba(212,175,55,0.1)',
      '--site-badge-text': '#d4af37',
      '--site-divider': 'linear-gradient(to right, transparent, rgba(212,175,55,0.2), transparent)',
      '--site-overlay': 'rgba(0,0,0,0.7)',
      '--site-input-bg': 'rgba(255,255,255,0.04)',
      '--site-input-border': 'rgba(212,175,55,0.1)',
      '--site-player-bg': 'rgba(17,17,17,0.95)',
    },
  },
  {
    id: 'jannat',
    name: 'Jannat (Paradis)',
    nameAr: 'الجنة',
    description: 'Vert jardin avec ciel azur — les jardins du Paradis décrits dans le Coran',
    style: 'light',
    preview: {
      bg: '#f0faf4',
      headerBg: '#ffffff',
      footerBg: '#0a2e1a',
      cardBg: '#ffffff',
      primary: '#16a34a',
      gold: '#2563eb',
      text: '#1a2e1a',
      textMuted: '#86efac',
      border: 'rgba(0,0,0,0.05)',
    },
    variables: {
      '--site-bg': '#f0faf4',
      '--site-bg-alt': '#e6f5ec',
      '--site-header-bg': 'rgba(255,255,255,0.94)',
      '--site-header-border': 'rgba(22,163,74,0.1)',
      '--site-footer-bg': '#0a2e1a',
      '--site-footer-border': 'rgba(22,163,74,0.15)',
      '--site-card': '#ffffff',
      '--site-card-hover': '#f8fff8',
      '--site-card-border': 'rgba(0,0,0,0.04)',
      '--site-primary': '#16a34a',
      '--primary-soft': 'rgba(22,163,74,0.08)',
      '--primary-glow': 'rgba(22,163,74,0.15)',
      '--site-gold': '#2563eb',
      '--gold-soft': 'rgba(37,99,235,0.08)',
      '--site-text': '#1a2e1a',
      '--site-text-secondary': '#4a6a4a',
      '--site-text-muted': '#86a88e',
      '--site-border': 'rgba(0,0,0,0.04)',
      '--site-shadow': '0 4px 32px rgba(22,163,74,0.06)',
      '--site-shadow-gold': '0 4px 24px rgba(37,99,235,0.06)',
      '--site-pattern-opacity': '0.015',
      '--site-gradient-hero': 'linear-gradient(135deg, #f0faf4 0%, #e6f5ec 50%, #d8f0e2 100%)',
      '--site-btn-bg': '#16a34a',
      '--site-btn-text': '#ffffff',
      '--site-badge-bg': 'rgba(22,163,74,0.08)',
      '--site-badge-text': '#16a34a',
      '--site-divider': 'linear-gradient(to right, transparent, rgba(22,163,74,0.15), transparent)',
      '--site-overlay': 'rgba(0,0,0,0.25)',
      '--site-input-bg': '#eef8f0',
      '--site-input-border': 'rgba(0,0,0,0.06)',
      '--site-player-bg': 'rgba(255,255,255,0.95)',
    },
  },
];

export function getSiteThemeById(id: string): SiteTheme | undefined {
  return SITE_THEMES.find(t => t.id === id);
}

export function applySiteTheme(themeId: string) {
  const theme = getSiteThemeById(themeId);
  if (!theme) return;
  Object.entries(theme.variables).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
  document.documentElement.setAttribute('data-site-theme', themeId);
  document.documentElement.setAttribute('data-theme-style', theme.style);
  localStorage.setItem('site_theme', themeId);
}

/* ═══════════════════════════════════════════════════════════════
   TAFSIR THEMES (pour les pages de tafsir uniquement)
   ═══════════════════════════════════════════════════════════════ */

export interface TafsirThemeDef {
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

export const TAFSIR_THEMES: TafsirThemeDef[] = [
  {
    id: 'nuit-sacree',
    name: 'Nuit Sacrée',
    description: 'Bleu nuit profond avec accents dorés',
    preview: { bg: '#0f1724', card: '#1a2735', primary: '#c9a227', accent: '#4ade80', text: '#e8e0d0', textMuted: '#8a8070' },
    variables: {
      '--tafsir-bg': '#0f1724', '--tafsir-bg-alt': '#14202e', '--tafsir-card': '#1a2735',
      '--tafsir-card-hover': '#1f3040', '--tafsir-card-border': 'rgba(201,162,39,0.15)',
      '--tafsir-primary': '#c9a227', '--tafsir-primary-light': '#d9b84a', '--tafsir-primary-soft': 'rgba(201,162,39,0.1)',
      '--tafsir-accent': '#4ade80', '--tafsir-accent-soft': 'rgba(74,222,128,0.1)',
      '--tafsir-text': '#e8e0d0', '--tafsir-text-secondary': '#a89e8e', '--tafsir-text-muted': '#6a6055',
      '--tafsir-border': 'rgba(255,255,255,0.06)', '--tafsir-gradient-hero': 'linear-gradient(135deg, #0f1724 0%, #1a2735 100%)',
      '--tafsir-shadow': '0 4px 24px rgba(0,0,0,0.3)', '--tafsir-badge-bg': 'rgba(201,162,39,0.1)', '--tafsir-badge-text': '#c9a227',
      '--tafsir-blockquote-bg': 'linear-gradient(to right, rgba(201,162,39,0.08), transparent)',
      '--tafsir-blockquote-border': '#c9a227', '--tafsir-divider': 'linear-gradient(to right, transparent, rgba(201,162,39,0.3), transparent)',
    },
  },
  {
    id: 'aube-doree',
    name: 'Aube Dorée',
    description: 'Fond crème avec accents émeraude et or',
    preview: { bg: '#faf8f4', card: '#ffffff', primary: '#c9a227', accent: '#2e7d32', text: '#1a1a1a', textMuted: '#9ca3af' },
    variables: {
      '--tafsir-bg': '#faf8f4', '--tafsir-bg-alt': '#f3f0ea', '--tafsir-card': '#ffffff',
      '--tafsir-card-hover': '#fffef9', '--tafsir-card-border': 'rgba(201,162,39,0.12)',
      '--tafsir-primary': '#c9a227', '--tafsir-primary-light': '#d9b84a', '--tafsir-primary-soft': 'rgba(201,162,39,0.08)',
      '--tafsir-accent': '#2e7d32', '--tafsir-accent-soft': 'rgba(46,125,50,0.06)',
      '--tafsir-text': '#1a1a1a', '--tafsir-text-secondary': '#6b7280', '--tafsir-text-muted': '#9ca3af',
      '--tafsir-border': 'rgba(0,0,0,0.06)', '--tafsir-gradient-hero': 'linear-gradient(135deg, #faf8f4 0%, #f3f0ea 100%)',
      '--tafsir-shadow': '0 4px 24px rgba(0,0,0,0.06)', '--tafsir-badge-bg': 'rgba(201,162,39,0.08)', '--tafsir-badge-text': '#9a7a1c',
      '--tafsir-blockquote-bg': 'linear-gradient(to right, rgba(201,162,39,0.06), transparent)',
      '--tafsir-blockquote-border': '#c9a227', '--tafsir-divider': 'linear-gradient(to right, transparent, rgba(0,0,0,0.1), transparent)',
    },
  },
  {
    id: 'emeraude',
    name: 'Émeraude Profonde',
    description: 'Vert islamique profond avec or',
    preview: { bg: '#0a2e1a', card: '#0f3d24', primary: '#d4af37', accent: '#6ee7b7', text: '#e8f5e9', textMuted: '#81c784' },
    variables: {
      '--tafsir-bg': '#0a2e1a', '--tafsir-bg-alt': '#0d3820', '--tafsir-card': '#0f3d24',
      '--tafsir-card-hover': '#134a2c', '--tafsir-card-border': 'rgba(212,175,55,0.2)',
      '--tafsir-primary': '#d4af37', '--tafsir-primary-light': '#e8c84a', '--tafsir-primary-soft': 'rgba(212,175,55,0.12)',
      '--tafsir-accent': '#6ee7b7', '--tafsir-accent-soft': 'rgba(110,231,183,0.08)',
      '--tafsir-text': '#e8f5e9', '--tafsir-text-secondary': '#81c784', '--tafsir-text-muted': '#4caf50',
      '--tafsir-border': 'rgba(255,255,255,0.05)', '--tafsir-gradient-hero': 'linear-gradient(135deg, #0a2e1a 0%, #0d3820 100%)',
      '--tafsir-shadow': '0 4px 24px rgba(0,0,0,0.35)', '--tafsir-badge-bg': 'rgba(212,175,55,0.12)', '--tafsir-badge-text': '#d4af37',
      '--tafsir-blockquote-bg': 'linear-gradient(to right, rgba(212,175,55,0.1), transparent)',
      '--tafsir-blockquote-border': '#d4af37', '--tafsir-divider': 'linear-gradient(to right, transparent, rgba(212,175,55,0.3), transparent)',
    },
  },
  {
    id: 'mosquee-blanche',
    name: 'Mosquée Blanche',
    description: 'Blanc pur avec turquoise',
    preview: { bg: '#f8fffe', card: '#ffffff', primary: '#0d9488', accent: '#f59e0b', text: '#1e293b', textMuted: '#94a3b8' },
    variables: {
      '--tafsir-bg': '#f8fffe', '--tafsir-bg-alt': '#f0f7f5', '--tafsir-card': '#ffffff',
      '--tafsir-card-hover': '#fafffe', '--tafsir-card-border': 'rgba(13,148,136,0.12)',
      '--tafsir-primary': '#0d9488', '--tafsir-primary-light': '#14b8a6', '--tafsir-primary-soft': 'rgba(13,148,136,0.08)',
      '--tafsir-accent': '#f59e0b', '--tafsir-accent-soft': 'rgba(245,158,11,0.06)',
      '--tafsir-text': '#1e293b', '--tafsir-text-secondary': '#64748b', '--tafsir-text-muted': '#94a3b8',
      '--tafsir-border': 'rgba(0,0,0,0.06)', '--tafsir-gradient-hero': 'linear-gradient(135deg, #f8fffe 0%, #f0f7f5 100%)',
      '--tafsir-shadow': '0 4px 24px rgba(13,148,136,0.08)', '--tafsir-badge-bg': 'rgba(13,148,136,0.08)', '--tafsir-badge-text': '#0d9488',
      '--tafsir-blockquote-bg': 'linear-gradient(to right, rgba(13,148,136,0.06), transparent)',
      '--tafsir-blockquote-border': '#0d9488', '--tafsir-divider': 'linear-gradient(to right, transparent, rgba(13,148,136,0.2), transparent)',
    },
  },
  {
    id: 'desert',
    name: 'Désert',
    description: 'Tons sable et ambre',
    preview: { bg: '#fdf6ec', card: '#fffaf0', primary: '#b8860b', accent: '#d2691e', text: '#3e2c1c', textMuted: '#a08060' },
    variables: {
      '--tafsir-bg': '#fdf6ec', '--tafsir-bg-alt': '#f5ead6', '--tafsir-card': '#fffaf0',
      '--tafsir-card-hover': '#fff8e8', '--tafsir-card-border': 'rgba(184,134,11,0.15)',
      '--tafsir-primary': '#b8860b', '--tafsir-primary-light': '#daa520', '--tafsir-primary-soft': 'rgba(184,134,11,0.08)',
      '--tafsir-accent': '#d2691e', '--tafsir-accent-soft': 'rgba(210,105,30,0.06)',
      '--tafsir-text': '#3e2c1c', '--tafsir-text-secondary': '#8b6914', '--tafsir-text-muted': '#a08060',
      '--tafsir-border': 'rgba(0,0,0,0.06)', '--tafsir-gradient-hero': 'linear-gradient(135deg, #fdf6ec 0%, #f5ead6 100%)',
      '--tafsir-shadow': '0 4px 24px rgba(139,105,20,0.08)', '--tafsir-badge-bg': 'rgba(184,134,11,0.08)', '--tafsir-badge-text': '#b8860b',
      '--tafsir-blockquote-bg': 'linear-gradient(to right, rgba(184,134,11,0.06), transparent)',
      '--tafsir-blockquote-border': '#b8860b', '--tafsir-divider': 'linear-gradient(to right, transparent, rgba(184,134,11,0.2), transparent)',
    },
  },
  {
    id: 'ramadan',
    name: 'Nuit de Ramadan',
    description: 'Violet profond avec argent et or',
    preview: { bg: '#1a1025', card: '#241835', primary: '#c9a227', accent: '#c084fc', text: '#e8dff0', textMuted: '#8a7a9a' },
    variables: {
      '--tafsir-bg': '#1a1025', '--tafsir-bg-alt': '#201530', '--tafsir-card': '#241835',
      '--tafsir-card-hover': '#2d1e42', '--tafsir-card-border': 'rgba(201,162,39,0.15)',
      '--tafsir-primary': '#c9a227', '--tafsir-primary-light': '#d9b84a', '--tafsir-primary-soft': 'rgba(201,162,39,0.1)',
      '--tafsir-accent': '#c084fc', '--tafsir-accent-soft': 'rgba(192,132,252,0.08)',
      '--tafsir-text': '#e8dff0', '--tafsir-text-secondary': '#a898b8', '--tafsir-text-muted': '#6a5a7a',
      '--tafsir-border': 'rgba(255,255,255,0.05)', '--tafsir-gradient-hero': 'linear-gradient(135deg, #1a1025 0%, #201530 100%)',
      '--tafsir-shadow': '0 4px 24px rgba(0,0,0,0.35)', '--tafsir-badge-bg': 'rgba(192,132,252,0.1)', '--tafsir-badge-text': '#c084fc',
      '--tafsir-blockquote-bg': 'linear-gradient(to right, rgba(192,132,252,0.06), transparent)',
      '--tafsir-blockquote-border': '#c084fc', '--tafsir-divider': 'linear-gradient(to right, transparent, rgba(201,162,39,0.3), transparent)',
    },
  },
];

function getTafsirThemeById(id: string): TafsirThemeDef | undefined {
  return TAFSIR_THEMES.find(t => t.id === id);
}

export function applyTafsirTheme(themeId: string) {
  const theme = getTafsirThemeById(themeId);
  if (!theme) return;
  Object.entries(theme.variables).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
  document.documentElement.setAttribute('data-tafsir-theme', themeId);
  localStorage.setItem('tafsir_theme', themeId);
}

/* ═══════════════════════════════════════════════════════════════
   LEGACY: Ancien système dark/light (toujours utilisé)
   ═══════════════════════════════════════════════════════════════ */

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
  site_theme: string;
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
  site_theme: 'aube-sacree',
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
            site_theme: data.site_theme || localStorage.getItem('site_theme') || DEFAULT_CONFIG.site_theme,
          };
          setConfig(mergedConfig);
          
          document.documentElement.style.setProperty('--iqra-green', data.primary_color || DEFAULT_CONFIG.primary_color);
          document.documentElement.style.setProperty('--iqra-gold', data.secondary_color || DEFAULT_CONFIG.secondary_color);
          
          const theme = mergedConfig.modern_theme;
          const resolvedTheme = theme === 'auto'
            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : theme;
          applyThemeVariables(resolvedTheme);

          applySiteTheme(mergedConfig.site_theme);

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
