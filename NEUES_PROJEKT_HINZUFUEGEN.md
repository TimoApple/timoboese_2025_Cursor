# Neues Projekt hinzufügen – Anleitung

So fügst du ein neues Projekt zur Portfolio-Seite hinzu:

## 1. Ordner anlegen

Erstelle einen neuen Ordner unter `projects/` mit der nächsten freien ID:

```
projects/project_11/
```

## 2. Dateien im Projektordner

### `project.json` (Pflicht)
```json
{
  "id": "project_11",
  "title": "Mein Projekt",
  "client": "Kundenname",
  "role": "Motion Design, 3D Animation",
  "year": "2025",
  "agency": "Agenturname (optional)",
  "galleryLayout": "horizontal",
  "heroVideo": "assets/mov/hero-video.webm",
  "description": [
    "Beschreibung Absatz 1.",
    "Beschreibung Absatz 2."
  ],
  "credits": [
    { "role": "Creative Direction", "name": "Timo Böse" },
    { "role": "Animation", "name": "Timo Böse" }
  ],
  "gallery": [
    { "type": "video", "src": "assets/mov/project_11_01.webm", "caption": "Szene 1" },
    { "type": "image", "src": "assets/img/project_11_01.webp", "caption": "Standbild" }
  ],
  "nav": {
    "prevHref": "project.html?id=project_10",
    "prevTitle": "Liquid Forms",
    "nextHref": "index.html#work",
    "nextTitle": "Overview",
    "prevLabel": "Zurück",
    "nextLabel": "Nächstes Projekt"
  }
}
```

### `galleryLayout` Optionen
| Wert | Effekt | Wann? |
|---|---|---|
| `"horizontal"` | Horizontale Scroll-Gallery (400vh) | Viele Bilder (≥3) |
| `"grid"` | Vertikales 2-Spalten-Grid | Wenige Bilder (1-3) |

### Mediendateien
Lege die Dateien im **Projekt-Ordner** ab (nicht mehr in `assets/`):
- `assets/mov/` – Videos (.webm oder .mp4)
- `assets/img/` – Galerie-Bilder (.webp, .jpg, .png)

**Bild-Pfade im JSON** sind relativ zum Projekt-Ordner, z.B.:
- `"src": "assets/img/01.webp"`
- `"src": "assets/mov/project_11.webm"`

**Verschiedene Seitenverhältnisse** werden automatisch beibehalten – Hochkant-Bilder werden schmal, Querformat-Bilder breit.

## 3. index.html aktualisieren

Füge einen neuen `.project-item` Block im `#work` Section hinzu:

```html
<!-- 11. Mein Projekt -->
<div class="project-item" onclick="openProject('project_11')">
    <div class="project-media">
        <video loading="lazy" src="./assets/mov/project_11.webm" muted loop playsinline preload="none"></video>
    </div>
    <div class="project-info">
        <div class="project-title" data-i18n="work.mein_projekt">Mein Projekt</div>
        <div class="project-meta" data-i18n="work.mein_projekt_meta">Kategorie</div>
    </div>
</div>
```

## 4. Übersetzungen hinzufügen

In `data/de.json` und `data/en.json` unter `"work"`:

```json
"mein_projekt": "Mein Projekt",
"mein_projekt_meta": "Kategorie"
```

## 5. Video in assets ablegen

Kopiere das Thumbnail-Video nach:
```
assets/mov/project_11.webm
```

## 6. Navigation einrichten

Passe in `project.json` die `nav`-Einträge an:
- `prevHref` → Link zum vorherigen Projekt
- `nextHref` → Link zum nächsten Projekt (oder `index.html#work`)

---

## Projekt-IDs (aktuell belegt)

| ID | Projekt | Gallery-Layout | Hero-Video |
|---|---|---|---|
| project_01 | Showreel | horizontal | assets/mov/project_01.webm |
| project_02 | The Last Museum | grid | assets/mov/project_03.webm |
| project_03 | Bilou Wednesday | horizontal | assets/mov/project_02.webm |
| project_04 | Pro7 | horizontal | assets/mov/project_04.webm |
| project_05 | Toca Me | horizontal | assets/mov/project_05.webm |
| project_06 | Bilou Flamingo | horizontal | assets/mov/project_06.webm |
| project_07 | LEGO | horizontal | assets/mov/project_07.webm |
| project_08 | Porsche | horizontal | assets/mov/project_08.webm |
| project_09 | Neural Net | grid | assets/mov/project_09.webm |
| project_10 | Liquid Forms | grid | assets/mov/project_10.webm |
