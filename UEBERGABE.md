# ÜBERGABE — Nächster Chat

## FTP-Zugangsdaten
- Host: w008f6b4.kasserver.com
- Port: 21
- User: f0184def
- Pass: Y3jbmdDu(gS8iTgw8Vmk
- Remote Root: / (direkt das Root, kein zusätzlicher Pfad)
- Besonderheit: Vor STOR in das Zielverzeichnis cwd, dann nur Dateiname angeben
- Upload-Script: `upload_ftp.py` (bereits vorhanden und getestet)

---

## AKTUELLER STAND (vor dem Fail)

### Was bereits gemacht wurde:
1. **Cookie Banner** — HTML, CSS, JS, i18n-Texte ✅
2. **Link-Style in project.css** — `.info-text p a` in Textfarbe ✅
3. **FTP Upload** — Alle Dateien sind auf dem Server ✅

### Was NICHT gemacht wurde (Mobile-Version):
Der Fokus lag auf Desktop. Mobile wurde nicht getestet/umgesetzt.

---

## AUFGABEN FÜR DEN NÄCHSTEN CHAT

### 1. MOBILE VERSION TESTEN & FIXEN
Die Seite auf dem Handy testen (localhost:3000 oder Handy im selben Netzwerk):
- [ ] **Landing Section** — Video + Scroll-Hint auf Mobile
- [ ] **About Section** — Text-Layout, Schriftgrößen, Animationen
- [ ] **Work Section (Grid)** — Projekt-Kacheln gestapelt, kein Hover-Effekt
- [ ] **Header** — Kollabierter Header auf Mobile, Nav-Items, Language-Switch
- [ ] **Footer** — Kontakt-Links, Copyright, Legal-Links
- [ ] **Project Detail Page** — Video-Controls, Gallery, Credits
- [ ] **Cookie Banner** — Buttons gestapelt, lesbar
- [ ] **Overlays** — Imprint/Privacy Overlay auf Mobile

### 2. BEKANNTE MOBILE-PROBLEME (aus vorherigem Chat)
- `#work` Section hat `height: auto` auf Mobile, aber die Grid-Kacheln brauchen Mindesthöhe
- Header-Sprache-Selector funktioniert nicht sauber auf Mobile (Dropdown vs. Toggle)
- About-Animation (Char-by-Char) ist auf Mobile zu langsam/aufwendig
- Project-Seite: horizontale Gallery bricht auf Mobile nicht richtig um
- Video-Blur-Effekt auf Hover funktioniert auf Touch nicht

### 3. NACH MOBILE-FIX: ERNEUTER FTP UPLOAD
- `python upload_ftp.py` ausführen
- Seite auf premiumdowngrade.com testen

---

## WICHTIGE DATEIEN
- `index.html` — Hauptseite
- `css/main.combined.css` — Komprimiertes CSS (nicht manuell editieren!)
- `js/main.combined.js` — Komprimiertes JS (nicht manuell editieren!)
- `css/work.css` — Work-Section Styles
- `css/project.css` — Project-Detail Styles
- `js/text.js` — About-Animation
- `js/work.js` — Work-Grid Logic
- `data/de.json` / `data/en.json` — Übersetzungen
- `project/index.html` — Project-Detail Seite
- `upload_ftp.py` — FTP Upload Script

## LOKALER SERVER
```bash
node server.js
# Läuft auf http://localhost:3000
```
