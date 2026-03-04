# PremiumDowngrade.com - Code Analyse & Optimierungen

**URL:** http://premiumdowngrade.com/  
**Backup erstellt:** 04.03.2026  
**Struktur:** HTML5, CSS (modular), JS (modular), Video-Assets

---

## Aktuelle Ordnerstruktur

```
premiumdowngrade.com/
├── index.html              # Hauptseite (8.9 KB)
├── css/
│   ├── style.css          # Basis-Styles
│   ├── header.css         # Header-Komponente
│   ├── text.css          # Typografie
│   ├── work.css          # Portfolio-Grid
│   └── footer.css        # Footer
├── js/
│   ├── text.js           # Text-Animationen
│   ├── script.js         # Hauptlogik
│   └── work.js           # Portfolio-Funktionen
├── assets/mov/           # Video-Dateien (10 Projekte)
└── footer.html           # External Footer
```

---

## Gefundene Optimierungen

### 1. Performance (Kritisch)

#### ✅ Empfohlen: CSS & JS kombinieren
**Aktuell:** 5 CSS-Dateien + 3 JS-Dateien = 8 HTTP-Requests  
**Optimierung:** Alles in je eine Datei:
```css
<!-- Statt 5 Dateien -->
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/header.css">
...

<!-- Bessere Lösung -->
<link rel="stylesheet" href="css/main.min.css?v=1.0">
```

**Einsparung:** ~60% weniger Requests

#### ✅ Lazy Loading für Videos
**Aktuell:** Alle Videos laden sofort  
**Problem:** Datenverbrauch, Ladezeit

**Lösung:**
```html
<video preload="none" loading="lazy" ...>
```

#### ✅ Bilder/Thumbnails statt Videos (Mobile)
**Empfehlung:** Poster-Bilder für mobile Geräte

### 2. SEO-Verbesserungen

#### ⚠️ Fehlende Meta-Tags
```html
<!-- Hinzufügen -->
<meta name="description" content="Timo Böse - Visual Designer & Motion Artist. 3D/2D Animation, Branding, UX. Berlin.">
<meta name="keywords" content="Motion Design, Animation, Visual Designer, Berlin, 3D, 2D">
<meta property="og:title" content="Timo Böse - Visual Designer">
<meta property="og:image" content="assets/og-image.jpg">
```

#### ⚠️ Alt-Attribute fehlen
**Aktuell:** Keine Alt-Tags bei Videos  
**Lösung:**
```html
<video ... aria-label="Showreel Motion Design">
```

### 3. Zugänglichkeit (Accessibility)

#### ⚠️ Kontrast prüfen
Text auf Video-Hintergrund evtl. schwer lesbar  
**Lösung:** Text-Schatten oder Overlay erhöhen

#### ⚠️ Keyboard-Navigation
**Prüfen:** Tab-Navigation durch alle Elemente

#### ⚠️ ARIA-Labels
```html
<nav aria-label="Hauptnavigation">
```

### 4. Sicherheit

#### ⚠️ Content Security Policy fehlt
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' cdnjs.cloudflare.com;
               style-src 'self' 'unsafe-inline';
               media-src 'self';">
```

### 5. Code-Qualität

#### ✅ Empfohlene Erweiterungen

| Feature | Implementierung | Nutzen |
|---------|-----------------|--------|
| **PWA-Support** | Service Worker + Manifest | Offline-Verfügbarkeit |
| **Dark Mode** | CSS Variables | Bessere UX |
| **Analytics** | Privacy-focused (Plausible) | Tracking ohne Cookies |
| **Contact Form** | Netlify Forms / Formspree | Direkte Anfragen |
| **CMS** | Headless (Strapi/Sanity) | Einfache Updates |

#### ✅ JavaScript Verbesserungen
**Aktuell:** fetch() ohne Fallback  
**Besser:**
```javascript
// Mit Error Handling
try {
  const response = await fetch('footer.html');
  if (!response.ok) throw new Error('Footer nicht gefunden');
} catch (error) {
  console.error('Fehler:', error);
  // Fallback: Footer aus index.html laden
}
```

### 6. Mobile-Optimierung

#### ⚠️ Viewport-Settings OK, aber testen
- Touch-Events für Videos
- Swipe-Gesten für Portfolio
- Mobile Performance (WebM-Codec)

### 7. Wartbarkeit

#### ✅ Versionsnummern hinzufügen
```html
<link rel="stylesheet" href="css/main.css?v=2.1">
```

#### ✅ Source Maps (für Entwicklung)
```
css/
├── main.min.css
└── main.min.css.map  # Source Map
```

---

## Prioritäten (nach Impact)

| Prio | Maßnahme | Zeitaufwand | Impact |
|------|----------|-------------|--------|
| 🔴 1 | CSS/JS kombinieren + minifizieren | 2h | Sehr hoch |
| 🔴 2 | Meta-Tags + SEO | 1h | Hoch |
| 🟡 3 | Lazy Loading Videos | 1h | Hoch |
| 🟡 4 | Accessibility (Alt, ARIA) | 2h | Mittel |
| 🟢 5 | CSP + Security | 1h | Mittel |
| 🟢 6 | PWA Features | 4h | Niedrig |

---

## Spezifische Code-Probleme

### Problem 1: Video-Tag nicht korrekt geschlossen
```html
<!-- Zeile 67-68 -->
<source src="assets/mov/hero-video.webm" type="video/webm">
<!-- Fehlt: </video> vor <div>? -->
```

### Problem 2: svg-defs leer
```html
<svg style="position: absolute; width: 0; height: 0;">
  <defs id="svg-defs"></defs>
</svg>
```
→ Wird genutzt? Sonst entfernen.

---

## Empfohlene Tools zur Implementierung

| Tool | Zweck |
|------|-------|
| **Vite** | Build-Tool, Bundling, Minification |
| **PostCSS** | Autoprefixing, Optimization |
| **Lighthouse CI** | Performance-Monitoring |
| **Prettier** | Code-Formatting |

---

## Backup Status

✅ Index-HTML gesichert  
⏳ CSS-Dateien (benötige Download)  
⏳ JS-Dateien (benötige Download)  
⏳ Videos (optional, groß)

---

*Nächste Schritte sollen mit Akh besprochen werden.*
