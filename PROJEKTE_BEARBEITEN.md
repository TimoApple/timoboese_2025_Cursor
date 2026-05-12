# Projekte bearbeiten – Anleitung

## Projekt-Struktur

Jedes Projekt liegt in einem eigenen Ordner unter `projects/`:

```
projects/
  project_01/          ← Showreel
    project.json       ← Metadaten, Beschreibungen, Galerie, Navigation
    assets/
      mov/             ← Hero-Video + Galerie-Videos
      img/             ← Galerie-Bilder
  project_02/          ← The Last Museum
    ...
  project_03/          ← Pro7 TV Idents
    ...
  ...
```

## project.json – Alle Felder

```json
{
  "title": "Projektname",
  "client": "Kundenname",
  "role": "Eigene Rolle",
  "year": "2025",
  "agency": "Agentur (oder '-' bei Direktkunden)",

  "galleryLayout": "horizontal",       // "horizontal" oder "grid"
  "passwordProtected": false,           // true = Passwort-Overlay (nur project_09)

  "description_en": [                   // Englische Beschreibung (Array = Absätze)
    "Absatz 1 mit <a href=\"...\">Link</a>.",
    "Absatz 2."
  ],
  "description_de": [                   // Deutsche Beschreibung
    "Absatz 1 mit <a href=\"...\">Link</a>.",
    "Absatz 2."
  ],

  "credits": [
    { "role": "Rolle", "name": "Name" },
    { "role": "Music", "name": "Michael Fakesch" }
  ],

  "heroVideo": "assets/mov/project_XX.webm",   // oder YouTube-URL
  "gallery": [                                  // Galerie (optional, leer lassen wenn keine)
    { "type": "image", "src": "assets/img/01.webp", "caption": "" },
    { "type": "video", "src": "assets/mov/extra.webm", "caption": "Szene 1" }
  ],

  "nav": {
    "prevLabel": "back",
    "prevTitle": "Vorheriges Projekt",
    "prevHref": "../project/?id=project_XX",
    "nextLabel": "next project",
    "nextTitle": "Nächstes Projekt",
    "nextHref": "../project/?id=project_YY"
  }
}
```

## Beschreibungen (DE / EN)

Jedes Projekt hat **zwei** Beschreibungsfelder:

- `description_en` – wird bei englischer Sprache angezeigt
- `description_de` – wird bei deutscher Sprache angezeigt

**Wichtig:** Die Texte sind Arrays. Jeder Eintrag wird ein eigener Absatz (`<p>`).

**Links in Texten:** Du kannst HTML-Links in den Beschreibungen verwenden, z.B.:
```
"<a href=\"../project/?id=project_03\">Vollständige Credits hier</a>"
```

## YouTube-Videos als Hero

Wenn das Hero-Video von YouTube kommt, trag einfach die YouTube-URL ein:

```json
"heroVideo": "https://www.youtube.com/watch?v=VIDEO_ID"
```

Der Player erkennt das automatisch und zeigt ein eingebettetes YouTube-Video statt eines lokalen Videos.

YouTube-Videos können auch in der Galerie verwendet werden:
```json
{ "type": "video", "src": "https://www.youtube.com/watch?v=VIDEO_ID", "caption": "Titel" }
```

## Passwort-geschützte Projekte

Für vertrauliche Projekte (wie project_09 – Lufthansa):

```json
{
  "passwordProtected": true,
  "password": "meinpasswort",     // optional, Fallback ist "lufthansa2024"
  "description_en": ["..."],
  "description_de": ["..."]
}
```

Solange das Passwort nicht eingegeben wird, sieht man nur das Overlay. Die Nav-Verknüpfungen zu diesem Projekt funktionieren trotzdem – man kommt zur Seite, sieht aber nur das Passwort-Overlay.

## Galerie-Layouts

| Wert | Effekt | Wann? |
|------|--------|-------|
| `"horizontal"` | Horizontale Scroll-Gallery | Viele Bilder/Videos |
| `"grid"` | 2-Spalten-Grid | Wenige Assets oder Bild-lastig |

## Navigation (prev / next)

Die `nav`-Einträge steuern die Footer-Navigation zwischen Projekten. Die Kette muss geschlossen sein:

```
project_01 → project_02 → project_03 → ... → project_10 → project_01
```

## Daten für die Hauptseite

Die Titel und Meta-Infos auf der Startseite (`index.html#work`) werden in `data/de.json` und `data/en.json` unter `"work"` gesteuert:

```json
// data/de.json
"work": {
  "showreel": "Showreel",
  "showreel_meta": "Arbeitsproben",
  "museum": "The Last Museum",
  "museum_meta": "KI-Video Konzept",
  ...
}
```

Wenn du ein neues Projekt hinzufügst, musst du beide Dateien aktualisieren.

## Aktuelle Projekte (Stand 2025)

| ID | Projekt | Layout | Hero |
|----|---------|--------|------|
| 01 | Showreel | horizontal | assets/mov/project_01.webm |
| 02 | The Last Museum | grid | assets/mov/project_02.webm |
| 03 | Pro7 TV Idents | horizontal | assets/mov/project_03.webm |
| 04 | Toca Me | horizontal | assets/mov/project_04.webm |
| 05 | Nike Kobe 8 | horizontal | assets/mov/project_05.webm |
| 06 | Bilou 2023 | horizontal | assets/mov/project_06.webm |
| 07 | Bilou Wednesday | horizontal | assets/mov/project_07.webm |
| 08 | Âme | horizontal | YouTube (wird ergänzt) |
| 09 | Lufthansa Digital Hangar | horizontal | 🔒 Passwort-geschützt |
| 10 | Aviation | horizontal | assets/mov/project_10.webm |
