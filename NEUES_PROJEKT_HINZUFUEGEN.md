# Neues Projekt hinzufügen – Anleitung

So fügst du ein neues Projekt zur Portfolio-Seite hinzu.

Ausführliche Dokumentation zu allen Feldern: [`PROJEKTE_BEARBEITEN.md`](PROJEKTE_BEARBEITEN.md)

## 1. Ordner anlegen

Erstelle einen neuen Ordner unter `projects/` mit der nächsten freien ID:

```
projects/project_11/
  project.json
  assets/
    mov/
    img/
```

## 2. `project.json` anlegen

```json
{
  "title": "Mein Projekt",
  "client": "Kundenname",
  "role": "Motion Design, 3D Animation",
  "year": "2025",
  "agency": "Agenturname (optional)",
  "galleryLayout": "horizontal",
  "description_en": [
    "English description paragraph 1.",
    "English description paragraph 2."
  ],
  "description_de": [
    "Deutsche Beschreibung Absatz 1.",
    "Deutsche Beschreibung Absatz 2."
  ],
  "credits": [
    { "role": "Creative Direction", "name": "Timo Böse" },
    { "role": "Animation", "name": "Timo Böse" }
  ],
  "heroVideo": "assets/mov/project_11.webm",
  "gallery": [
    { "type": "video", "src": "assets/mov/project_11_01.webm", "caption": "Szene 1" },
    { "type": "image", "src": "assets/img/project_11_01.webp", "caption": "Standbild" }
  ],
  "nav": {
    "prevLabel": "back",
    "prevTitle": "Vorheriges Projekt",
    "prevHref": "../project/?id=project_10",
    "nextLabel": "next project",
    "nextTitle": "Nächstes Projekt",
    "nextHref": "../project/?id=project_12"
  }
}
```

**Wichtig:** Immer beide Beschreibungen (`description_en` + `description_de`) anlegen!

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

## 4. Übersetzungen in `data/de.json` und `data/en.json`

In beiden Dateien unter `"work"`:

```json
"mein_projekt": "Mein Projekt",
"mein_projekt_meta": "Kategorie"
```

## 5. Navigation einrichten

Passe in `project.json` die `nav`-Einträge an:
- `prevHref` → Link zum vorherigen Projekt
- `nextHref` → Link zum nächsten Projekt

Außerdem musst du im **vorherigen** Projekt den `next`-Eintrag und im **nächsten** Projekt den `prev`-Eintrag anpassen, damit die Kette geschlossen bleibt.

## 6. Mediendateien

Lege die Dateien im Projekt-Ordner ab:
- `assets/mov/` – Videos (.webm oder .mp4)
- `assets/img/` – Galerie-Bilder (.webp, .jpg, .png)

**Bild-Pfade im JSON** sind relativ zum Projekt-Ordner, z.B.:
- `"src": "assets/img/01.webp"`
- `"src": "assets/mov/project_11.webm"`

## YouTube-Videos

Statt einer lokalen Videodatei kannst du auch YouTube-URLs verwenden:
```json
"heroVideo": "https://www.youtube.com/watch?v=VIDEO_ID"
```

## Passwort-Schutz

Für vertrauliche Projekte:
```json
"passwordProtected": true,
"password": "meinpasswort"
```

---

## Projekt-IDs (aktuell belegt)

| ID | Projekt | Layout | Hero |
|----|---------|--------|------|
| project_01 | Showreel | horizontal | assets/mov/project_01.webm |
| project_02 | The Last Museum | grid | assets/mov/project_02.webm |
| project_03 | Pro7 TV Idents | horizontal | assets/mov/project_03.webm |
| project_04 | Toca Me | horizontal | assets/mov/project_04.webm |
| project_05 | Nike Kobe 8 | horizontal | assets/mov/project_05.webm |
| project_06 | Bilou 2023 | horizontal | assets/mov/project_06.webm |
| project_07 | Bilou Wednesday | horizontal | assets/mov/project_07.webm |
| project_08 | Âme | horizontal | YouTube |
| project_09 | Lufthansa Digital Hangar | horizontal | 🔒 Passwort |
| project_10 | Aviation | horizontal | assets/mov/project_10.webm |
