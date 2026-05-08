/**
 * i18n.js – Sprachumschaltung DE/EN
 * 
 * Funktionsweise:
 * 1. Beim Laden: Browser-Sprache erkennen (DE → Deutsch, alles andere → Englisch)
 * 2. Sprache in localStorage speichern
 * 3. Alle Elemente mit data-i18n Attribut übersetzen
 * 4. Sprach-Switch im Header: Klick wechselt Sprache
 */

(function () {
  'use strict';

  let currentLang = 'en';
  let translations = {};

  // Verfügbare Sprachen
  const LANGUAGES = ['de', 'en'];

  // ===== Sprache erkennen =====
  function detectLanguage() {
    // 1. localStorage check
    const stored = localStorage.getItem('preferredLang');
    if (stored && LANGUAGES.includes(stored)) return stored;

    // 2. Browser-Sprache
    const browserLang = (navigator.language || navigator.userLanguage || '').substring(0, 2);
    if (browserLang === 'de') return 'de';

    // 3. Default
    return 'en';
  }

  // ===== Übersetzungen laden =====
  async function loadTranslations(lang) {
    try {
      const response = await fetch(`data/${lang}.json`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      console.error(`i18n: Fehler beim Laden von data/${lang}.json`, err);
      // Fallback: Englisch laden
      if (lang !== 'en') return loadTranslations('en');
      return {};
    }
  }

  // ===== Seite übersetzen =====
  function applyTranslations(data) {
    translations = data;
    if (!data) return;

    // Meta-Tags
    if (data.meta) {
      document.title = data.meta.title || document.title;
      setMeta('description', data.meta.description);
      setMeta('og:title', data.meta.og_title);
      setMeta('og:description', data.meta.og_description);
      setMeta('twitter:title', data.meta.og_title);
    }

    // Alle Elemente mit data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = getNestedValue(data, key);
      if (text) {
        el.textContent = text;
      }
    });

    // Alle Elemente mit data-i18n-attr (für Attribute wie placeholder, title, etc.)
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const attrs = el.getAttribute('data-i18n-attr').split(';');
      attrs.forEach(attr => {
        const [attrName, key] = attr.split(':');
        if (attrName && key) {
          const text = getNestedValue(data, key);
          if (text) {
            el.setAttribute(attrName.trim(), text);
          }
        }
      });
    });

    // html lang Attribut setzen
    document.documentElement.lang = currentLang === 'de' ? 'de' : 'en';

    // Sprach-Switch Buttons aktualisieren
    document.querySelectorAll('.lang-switch-btn').forEach(btn => {
      const lang = btn.getAttribute('data-lang');
      btn.classList.toggle('active', lang === currentLang);
    });
    // Aktuelle Sprache im Header anzeigen
    const currentBtn = document.querySelector('.lang-current');
    if (currentBtn) {
      const label = currentBtn.querySelector('.lang-label');
      if (label) label.textContent = currentLang.toUpperCase();
    }

    // Event auslösen für andere Skripte
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: currentLang } }));
  }

  // ===== Hilfsfunktionen =====
  function setMeta(name, content) {
    if (!content) return;
    let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      if (name.startsWith('og:') || name.startsWith('twitter:')) {
        el.setAttribute('property', name);
      } else {
        el.setAttribute('name', name);
      }
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  // ===== Sprache wechseln =====
  async function setLanguage(lang) {
    if (!LANGUAGES.includes(lang)) return;
    if (lang === currentLang && Object.keys(translations).length > 0) return;

    currentLang = lang;
    localStorage.setItem('preferredLang', lang);

    const data = await loadTranslations(lang);
    applyTranslations(data);
  }

  // ===== Initialisierung =====
  async function init() {
    const detectedLang = detectLanguage();
    const data = await loadTranslations(detectedLang);
    currentLang = detectedLang;
    applyTranslations(data);

    // Sprach-Switch Events binden (nachdem DOM geladen ist)
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('.lang-switch-btn');
      if (btn) {
        const lang = btn.getAttribute('data-lang');
        if (lang) setLanguage(lang);
      }
    });
  }

  // ===== Globale API =====
  window.i18n = {
    getLang: () => currentLang,
    setLang: setLanguage,
    t: (key) => getNestedValue(translations, key) || key,
    onLanguageChange: (callback) => {
      document.addEventListener('languageChanged', (e) => callback(e.detail.lang));
    }
  };

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
